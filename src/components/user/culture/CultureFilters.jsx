export default function CultureFilters({ filters, activeFilter, onFilterChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto flex-nowrap pb-1 custom-scrollbar">
      {filters.map((f) => {
        const isActive = activeFilter === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onFilterChange(f.key)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm border transition-all duration-150 cursor-pointer
              ${isActive
                ? "bg-amber-600 border-amber-600 text-white font-semibold shadow-md"
                : "bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-800"
              }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
