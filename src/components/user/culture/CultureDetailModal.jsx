import { useEffect } from "react";
import { X, MapPin, ListOrdered } from "lucide-react";

export default function CultureDetailModal({
  item,
  onClose,
  badge,
  extraTags = [],
}) {
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

  const { detail } = item;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/75 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-label="Đóng"
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        <div className="h-48 sm:h-56 shrink-0 bg-stone-900">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {badge && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              {badge}
            </span>
          )}

          <h2
            className="text-2xl font-semibold text-stone-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.title}
          </h2>

          <p className="mt-1 text-sm text-stone-500">{item.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.province && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-stone-100 text-stone-600 border border-stone-200">
                <MapPin size={12} />
                {item.province}
              </span>
            )}
            {extraTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-stone-100 text-stone-600 border border-stone-200"
              >
                {tag}
              </span>
            ))}
            {item.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-amber-50 text-amber-800 border border-amber-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-stone-600">
            {detail.description}
          </p>

          {detail.highlights?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Điểm nổi bật
              </h3>
              <ul className="space-y-1.5">
                {detail.highlights.map((point) => (
                  <li
                    key={point}
                    className="text-sm text-stone-600 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.ingredients?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Nguyên liệu chính
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {detail.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-2.5 py-1 rounded-lg text-xs bg-stone-50 border border-stone-200 text-stone-700"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {detail.steps?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                <ListOrdered size={14} />
                Các bước / nghi thức
              </h3>
              <ol className="space-y-2">
                {detail.steps.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 text-sm text-stone-600"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
