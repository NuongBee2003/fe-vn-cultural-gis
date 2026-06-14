import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const WebSocketContext = createContext(null);

const toastStyles = `
@keyframes toastSlideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes toastSlideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
.toast-enter {
  animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.toast-exit {
  animation: toastSlideOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;

function ToastCard({ toast, onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 350);
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleToastClick = () => {
    if (toast.post_id) {
      const queryParams = `?post_id=${toast.post_id}${
        toast.comment_id ? `&comment_id=${toast.comment_id}` : ""
      }&noti_id=${toast.rawNoti?.id || ""}`;
      const targetUrl = `/community${queryParams}`;

      if (window.location.pathname === "/community") {
        // Update URL search parameters without reloading
        window.history.replaceState(null, "", targetUrl);
        // Dispatch custom event so CommunityPage can trigger the scrolling/highlighting immediately
        const event = new CustomEvent("ws_notification_click", {
          detail: {
            post_id: toast.post_id,
            comment_id: toast.comment_id,
            noti_id: toast.rawNoti?.id
          }
        });
        window.dispatchEvent(event);
      } else {
        window.location.href = targetUrl;
      }
    } else if (toast.url) {
      window.location.href = toast.url;
    }
    setExiting(true);
    setTimeout(onClose, 350);
  };

  const getInitials = (name) => {
    const cleaned = String(name || "").trim();
    if (!cleaned) return "?";
    const parts = cleaned.split(/\s+/g).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  return (
    <div
      onClick={handleToastClick}
      className={`pointer-events-auto flex items-start gap-3 w-80 p-4 rounded-xl border border-amber-100/50 bg-white/95 shadow-xl backdrop-blur-md cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
        exiting ? "toast-exit" : "toast-enter"
      }`}
    >
      <div className="h-9 w-9 shrink-0 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center text-xs font-semibold overflow-hidden border border-amber-100">
        {toast.actor?.avatar ? (
          <img
            src={toast.actor.avatar}
            alt={toast.actor.username}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(toast.actor?.username || "U")}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900">{toast.title}</p>
        <p className="text-xs text-slate-600 mt-0.5 leading-normal line-clamp-2">
          <span className="font-semibold text-slate-800">{toast.actor?.username || "Người dùng"}</span>{" "}
          {toast.message?.toLowerCase() || "đã gửi thông báo mới"}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setExiting(true);
          setTimeout(onClose, 350);
        }}
        className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer bg-transparent border-none"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function WebSocketProvider({ children }) {
  const socketRef = useRef(null);
  const listenersRef = useRef(new Set());
  const [toasts, setToasts] = useState([]);

  // Add listener
  const addNotificationListener = (callback) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    let reconnectTimeout = null;
    let isDisposed = false;

    function connect() {
      if (isDisposed) return;

      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (!token) {
        // Check for login token again in 3 seconds
        reconnectTimeout = setTimeout(connect, 3000);
        return;
      }

      // Get WebSocket URL from env or fallback to deriving it from VITE_API_URL
      let wsUrl = import.meta.env.VITE_WS_URL || "";
      if (!wsUrl) {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";
        let origin = "";
        try {
          if (apiUrl.startsWith("http")) {
            origin = new URL(apiUrl).origin;
          } else {
            origin = window.location.origin;
          }
        } catch (err) {
          origin = "http://localhost:3002";
          console.error("Error parsing WebSocket URL:", err);
        }

        const wsProtocol = origin.startsWith("https") ? "wss" : "ws";
        const wsHost = origin.replace(/^https?:\/\//, "");
        wsUrl = `${wsProtocol}://${wsHost}/ws`;
      }

      const connector = wsUrl.includes("?") ? "&" : "?";
      const wsConnectUrl = `${wsUrl}${connector}token=${token}`;

      console.log("Connecting to WebSocket...");
      const ws = new WebSocket(wsConnectUrl);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "notification") {
            const noti = message.data;

            // Prepend new toast alert
            const newToast = {
              id: Date.now(),
              title: "Thông báo mới",
              message: noti.message,
              url: noti.url,
              actor: noti.actor,
              post_id: noti.post_id,
              comment_id: noti.comment_id,
              rawNoti: noti,
            };
            setToasts((prev) => [...prev, newToast]);

            // Call all listeners (e.g. to update counts or prepend list)
            listenersRef.current.forEach((cb) => {
              try {
                cb(noti);
              } catch (e) {
                console.error("Error in WebSocket notification listener:", e);
              }
            });
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed. Retrying in 5 seconds...");
        socketRef.current = null;
        if (!isDisposed) {
          reconnectTimeout = setTimeout(connect, 5000);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket connection error:", err);
        ws.close();
      };
    }

    connect();

    // Reconnect immediately if user auth changes
    const handleStorageChange = () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Periodically check login state changes within same tab context
    const loginCheckInterval = setInterval(() => {
      const currentToken = localStorage.getItem("token") || localStorage.getItem("adminToken");
      const hasSocket = !!socketRef.current;
      if (currentToken && !hasSocket) {
        connect();
      } else if (!currentToken && hasSocket) {
        if (socketRef.current) socketRef.current.close();
      }
    }, 2000);

    return () => {
      isDisposed = true;
      clearTimeout(reconnectTimeout);
      clearInterval(loginCheckInterval);
      window.removeEventListener("storage", handleStorageChange);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ addNotificationListener }}>
      <style>{toastStyles}</style>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-2.5 pointer-events-none">
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </div>
      )}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketNotification() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketNotification must be used within a WebSocketProvider");
  }
  return context;
}
