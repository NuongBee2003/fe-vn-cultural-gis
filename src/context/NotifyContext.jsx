import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Context ────────────────────────────────────────────────────────────────
const NotifyCtx = createContext(null);

/**
 * Các type thông báo hỗ trợ:
 *  - "success"  : màu xanh lá, icon CheckCircle2
 *  - "error"    : màu đỏ, icon XCircle
 *  - "warning"  : màu vàng cam, icon AlertTriangle
 *  - "info"     : màu xanh dương, icon Info
 *  - "confirm"  : hiện 2 nút Xác nhận / Hủy, trả về Promise<boolean>
 */

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    titleDefault: "Thành công",
    btnClass: "bg-emerald-500 hover:bg-emerald-600",
  },
  error: {
    icon: XCircle,
    iconClass: "text-rose-500",
    titleDefault: "Lỗi",
    btnClass: "bg-rose-500 hover:bg-rose-600",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    titleDefault: "Cảnh báo",
    btnClass: "bg-amber-500 hover:bg-amber-600",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500",
    titleDefault: "Thông báo",
    btnClass: "bg-blue-500 hover:bg-blue-600",
  },
  confirm: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    titleDefault: "Xác nhận",
    btnClass: "bg-rose-500 hover:bg-rose-600",
  },
};

// ─── Provider ────────────────────────────────────────────────────────────────
export function NotifyProvider({ children }) {
  const [modal, setModal] = useState(null); // { type, title, message, confirmLabel, cancelLabel }
  const resolveRef = useRef(null);

  const open = useCallback((options) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModal(options);
    });
  }, []);

  /** Thông báo thành công */
  const success = useCallback(
    (message, title) => open({ type: "success", message, title }),
    [open]
  );

  /** Thông báo lỗi */
  const error = useCallback(
    (message, title) => open({ type: "error", message, title }),
    [open]
  );

  /** Thông báo cảnh báo */
  const warning = useCallback(
    (message, title) => open({ type: "warning", message, title }),
    [open]
  );

  /** Thông báo thông tin */
  const info = useCallback(
    (message, title) => open({ type: "info", message, title }),
    [open]
  );

  /**
   * Modal xác nhận — trả về Promise<boolean>
   * @example const ok = await notify.confirm("Bạn có chắc muốn xóa?");
   */
  const confirm = useCallback(
    (message, { title, confirmLabel = "Xác nhận", cancelLabel = "Hủy" } = {}) =>
      open({ type: "confirm", message, title, confirmLabel, cancelLabel }),
    [open]
  );

  const handleClose = (result = false) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setModal(null);
  };

  return (
    <NotifyCtx.Provider value={{ success, error, warning, info, confirm }}>
      {children}
      {modal && (
        <NotifyModal modal={modal} onClose={handleClose} />
      )}
    </NotifyCtx.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useNotify() {
  const ctx = useContext(NotifyCtx);
  if (!ctx) throw new Error("useNotify must be used within <NotifyProvider>");
  return ctx;
}

// ─── Modal UI ────────────────────────────────────────────────────────────────
function NotifyModal({ modal, onClose }) {
  const { type = "info", message, title, confirmLabel = "Xác nhận", cancelLabel = "Hủy" } = modal;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const Icon = cfg.icon;
  const isConfirm = type === "confirm";

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => { if (!open) onClose(false); }}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        />

        {/* Content */}
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          {/* Close button */}
          <DialogPrimitive.Close
            onClick={() => onClose(false)}
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Đóng"
          >
            <X size={16} />
          </DialogPrimitive.Close>

          {/* Icon + Title */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${cfg.iconClass.replace("text-", "bg-").replace("500", "50")}`}>
              <Icon size={28} className={cfg.iconClass} strokeWidth={1.8} />
            </div>

            <DialogPrimitive.Title className="text-base font-semibold text-gray-900 leading-snug">
              {title || cfg.titleDefault}
            </DialogPrimitive.Title>

            {message && (
              <DialogPrimitive.Description className="text-sm text-gray-500 leading-relaxed">
                {message}
              </DialogPrimitive.Description>
            )}
          </div>

          {/* Actions */}
          <div className={`mt-5 flex gap-2 ${isConfirm ? "flex-row" : "flex-col"}`}>
            {isConfirm && (
              <button
                onClick={() => onClose(false)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {cancelLabel}
              </button>
            )}
            <button
              onClick={() => onClose(true)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${cfg.btnClass}`}
            >
              {isConfirm ? confirmLabel : "Đóng"}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
