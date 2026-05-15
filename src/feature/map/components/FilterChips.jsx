import React from "react";
import { MapPin } from "lucide-react";
import { FILTERS, FILTER_ACTIVE_STYLE, ALL_LOCATIONS_COUNT } from "../../../data/filters";

export default function FilterChips({ activeFilter, setActiveFilter }) {
  return (
    <div className="flex gap-2 flex-wrap pointer-events-auto">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.key;
        const FIcon = f.icon;
        return (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] border-[1.5px] cursor-pointer shadow-md transition-all duration-150
                    ${
                      isActive
                        ? "font-semibold"
                        : "bg-white text-gray-600 border-white font-normal hover:bg-gray-50 hover:border-gray-300"
                    }`}
            style={isActive ? FILTER_ACTIVE_STYLE[f.key] : {}}
          >
            {FIcon && <FIcon size={13} />}
            {f.label}
          </button>
        );
      })}

      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium text-[var(--brand-primary)] shadow-md backdrop-blur-sm"
        style={{ background: "var(--overlay-dark)" }}
      >
        <MapPin size={11} />
        {ALL_LOCATIONS_COUNT} địa điểm
      </div>
    </div>
  );
}
