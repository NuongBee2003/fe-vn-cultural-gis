import { useEffect } from "react";
import {
  X,
  Heart,
  MapPin,
  Sparkles,
  User,
  Calendar,
} from "lucide-react";

export default function ExhibitionLightbox({ item, onClose }) {
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

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-label="Đóng"
      />

      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col lg:flex-row bg-white rounded-2xl overflow-hidden shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        <div className="lg:w-[58%] bg-stone-900 flex items-center justify-center min-h-[240px] lg:min-h-0 lg:max-h-[90vh]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-w-full max-h-[50vh] lg:max-h-[90vh] object-contain"
          />
        </div>

        <div className="lg:w-[42%] flex flex-col overflow-y-auto p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Triển lãm ảo
          </p>
          <h2
            className="mt-2 text-2xl font-semibold text-stone-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {item.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {item.source === "studio" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles size={12} />
                Studio AI
              </span>
            )}
            {item.styleTag && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
                {item.styleTag}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
              {item.province}
            </span>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-stone-600">
            <li className="flex items-center gap-2">
              <User size={15} className="text-stone-400 shrink-0" />
              <span>
                <span className="text-stone-400">Tác giả:</span>{" "}
                <span className="font-medium text-stone-800">{item.author}</span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Heart size={15} className="text-rose-400 shrink-0" />
              <span>{item.likes} lượt thích</span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar size={15} className="text-stone-400 shrink-0" />
              <span>
                Đăng ngày{" "}
                {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </li>
            {item.placeName && (
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-amber-600 shrink-0" />
                <span>{item.placeName}</span>
              </li>
            )}
          </ul>

          <div className="mt-8 pt-6 border-t border-stone-100">
            <button
              type="button"
              disabled
              title="Sẽ kết nối bản đồ khi có API"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed"
            >
              <MapPin size={15} />
              Xem trên bản đồ (sắp có)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
