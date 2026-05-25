import { ChevronRight, MapPin } from "lucide-react";

export default function CultureCard({ item, badge, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group w-full text-left rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <div className="relative h-40 overflow-hidden bg-stone-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {badge && (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-amber-800 border border-amber-200 backdrop-blur-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-stone-900 leading-snug group-hover:text-amber-800 transition-colors">
          {item.title}
        </h3>
        <p className="mt-1.5 text-xs leading-5 text-stone-500 line-clamp-2">
          {item.summary}
        </p>

        {item.province && (
          <p className="mt-2 flex items-center gap-1 text-[11px] text-stone-400">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{item.province}</span>
          </p>
        )}

        {item.tags?.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] bg-stone-100 text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <span className="mt-3 inline-flex items-center gap-0.5 text-xs font-medium text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity">
          Xem chi tiết
          <ChevronRight size={14} />
        </span>
      </div>
    </button>
  );
}
