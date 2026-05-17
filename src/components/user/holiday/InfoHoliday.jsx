import React from "react";

export default function InfoHoliday({ item }) {
  return (
    <div
      className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-amber-300 hover:shadow-md transition-all duration-200"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.label}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        {/* Date badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            {item.date}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-900 leading-snug">
          {item.label}
        </h3>
        <p className="mt-1.5 text-xs leading-5 text-slate-500">
          {item.description}
        </p>
      </div>
    </div>
  );
}
