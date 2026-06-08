import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

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
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = đóng

  const openLightbox = useCallback((idx) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() =>
    setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1)), [images.length]);
  const goNext = useCallback(() =>
    setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0)), [images.length]);

  // Keyboard: Escape đóng gallery hoặc lightbox; Arrows điều hướng lightbox
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) closeLightbox();
        else onClose();
      }
      if (lightboxIndex !== null) {
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    const id = requestAnimationFrame(() => {
      if (lightboxIndex === null) {
        const el = itemRefs.current[initialIndex];
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });

    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, initialIndex, lightboxIndex, closeLightbox, goPrev, goNext]);

  if (!open) return null;

  return createPortal(
    <>
      {/* ── Gallery Panel ──────────────────────────────────── */}
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
                ref={(el) => { itemRefs.current[idx] = el; }}
                className="mb-3 break-inside-avoid sm:mb-4"
              >
                {/* Wrapper có cursor pointer + zoom hint */}
                <div
                  className="group relative cursor-zoom-in overflow-hidden rounded-xl shadow-lg ring-1 ring-black/10"
                  onClick={() => openLightbox(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(idx)}
                  aria-label={`Xem ảnh ${idx + 1} phóng to`}
                >
                  <img
                    src={src}
                    alt={`Ảnh ${idx + 1}`}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay khi hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/25">
                    <ZoomIn
                      size={32}
                      className="text-white opacity-0 drop-shadow-lg transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[10060] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
          onClick={closeLightbox}
        >
          {/* Nút đóng lightbox */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
            aria-label="Đóng ảnh"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Nút Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          {/* Ảnh phóng to */}
          <img
            key={lightboxIndex}
            src={images[lightboxIndex]}
            alt={`Ảnh ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-xl object-contain shadow-2xl"
            style={{ width: "80vw", height: "80vh", animation: "lightboxFadeIn 0.2s ease" }}
          />

          {/* Nút Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight size={26} />
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-2xl bg-black/50 p-2 backdrop-blur-sm">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                  className="relative overflow-hidden rounded-md transition-all"
                  style={{
                    width: idx === lightboxIndex ? 52 : 40,
                    height: 36,
                    outline: idx === lightboxIndex ? "2px solid white" : "none",
                    outlineOffset: 1,
                    opacity: idx === lightboxIndex ? 1 : 0.55,
                    transition: "width 0.2s, opacity 0.2s",
                  }}
                  aria-label={`Chuyển sang ảnh ${idx + 1}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Keyframe animation */}
      <style>{`
        @keyframes lightboxFadeIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>,
    document.body
  );
}
