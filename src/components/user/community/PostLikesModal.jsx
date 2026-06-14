import { useState, useEffect } from "react";
import { X, Loader2, Heart } from "lucide-react";
import { getPostLikes } from "@/api/postApi";

function getInitials(name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/g).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function PostLikesModal({ postId, onClose }) {
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Lắng nghe sự kiện ESC để đóng modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Lấy dữ liệu người thích khi mount
  useEffect(() => {
    let active = true;
    async function fetchLikes() {
      try {
        setIsLoading(true);
        const data = await getPostLikes(postId);
        if (active) {
          setLikes(data);
          setErrorMsg("");
        }
      } catch (err) {
        if (active) {
          console.error("Lỗi lấy danh sách lượt thích:", err);
          setErrorMsg("Không thể tải danh sách lượt thích lúc này.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    fetchLikes();
    return () => {
      active = false;
    };
  }, [postId]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl flex flex-col max-h-[70vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-rose-500 fill-rose-500" />
            <h3 className="text-base font-semibold text-slate-900">Lượt thích</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-[150px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
              <Loader2 size={24} className="animate-spin text-amber-500" />
              <p className="text-xs">Đang tải danh sách...</p>
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col items-center justify-center py-10 text-rose-500 text-center">
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          ) : likes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
              <Heart size={32} className="text-slate-200 stroke-1" />
              <p className="text-sm font-medium text-slate-500">Chưa có lượt thích nào</p>
              <p className="text-xs text-slate-400">Hãy là người đầu tiên thích bài viết này!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {likes.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-semibold overflow-hidden border border-slate-100">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      getInitials(user.username)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
