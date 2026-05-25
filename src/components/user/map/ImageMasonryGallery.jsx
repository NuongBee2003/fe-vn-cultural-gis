import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   images: string[];
 *   title?: string;
 *   initialIndex?: number;
 * }} props
 */
export default function ImageMasonryGallery({
  open,
  onClose,
  images,
  title = "Hình ảnh",
  initialIndex = 0,
}) {
  const itemRefs = useRef(/** @type {(HTMLDivElement | null)[]} */ ([]));

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    const id = requestAnimationFrame(() => {
      const el = itemRefs.current[initialIndex];
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });

    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, initialIndex]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex flex-col bg-white"
      role="dialog"
      aria-modal="true" 
      aria-label={title}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 px-4 py-3 text-black">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold">{title}</p>
          <p className="text-[12px] text-black/60">{images.length} ảnh</p>
        </div>
        <button
          type="button"
          onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/10 text-black hover:bg-black/20"
          aria-label="Đóng gallery"
        >
          <X size={22} />
        </button>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="mx-auto max-w-5xl columns-2 gap-3 sm:columns-3 sm:gap-4">
          {images.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className="mb-3 break-inside-avoid sm:mb-4"
            >
              <img
                src={src}
                alt=""
                className="w-full rounded-xl object-cover shadow-lg ring-1 ring-black/10"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
