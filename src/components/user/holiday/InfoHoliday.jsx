import React from "react";
import { ChevronRight } from "lucide-react";
import { HOLIDAY_IMAGES } from "@/pages/user/holiday/HolidaysPage";

export default function InfoHoliday({ item, onClick }) {
  const imageSrc = HOLIDAY_IMAGES[item.image_url] || item.image_url;
  return (
    <button
      type="button"
      onClick={() => onClick && onClick(item)}
      className="group w-full text-left rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-amber-300 hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        {/* Date badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            {item.date_label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between w-full">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
            {item.name}
          </h3>
          <p className="mt-1.5 text-xs leading-5 text-slate-500 line-clamp-2">
            {item.description}
          </p>
        </div>
        <span className="mt-3.5 inline-flex items-center gap-0.5 text-xs font-medium text-amber-700 opacity-0 group-hover:opacity-100 transition-all duration-200">
          Xem gợi ý chi tiết
          <ChevronRight size={13} className="translate-x-0 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </button>
  );
}
