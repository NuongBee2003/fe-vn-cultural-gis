import { useCategories } from "@/api/useLocationQuery";
import { FILTER_ACTIVE_STYLE } from "@/constants/mapFilters";

export default function FilterChips({ activeFilter, setActiveFilter }) {
  const { data: categories = [], isLoading } = useCategories();
  console.log("Categories in FilterChips:", categories); // Debug log to check categories data
  const filters = [
    { key: "all", label: "Tất cả", icon: null },
    ...categories.map((c) => ({
      key: c.name,
      label: c.name,
      icon: null,
      iconUrl: c.icon_marker,
      color: c.color 
    })),
  ];

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto flex-nowrap pb-2 pointer-events-auto custom-scrollbar animate-pulse">
        <div className="shrink-0 w-20 h-[30px] bg-gray-200 rounded-full"></div>
        <div className="shrink-0 w-24 h-[30px] bg-gray-200 rounded-full"></div>
        <div className="shrink-0 w-24 h-[30px] bg-gray-200 rounded-full"></div>
        <div className="shrink-0 w-24 h-[30px] bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto flex-nowrap pb-2 pointer-events-auto custom-scrollbar">
      {filters.map((f) => {
        const isActive = activeFilter === f.key;
        const FIcon = f.icon;

        return (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] border-[1.5px] cursor-pointer shadow-md transition-all duration-150
                    ${
                      isActive
                        ? "font-semibold"
                        : "bg-white text-gray-600 border-white font-normal hover:bg-gray-50 hover:border-gray-300"
                    }`}
            style={
              isActive
                ? {
                    borderColor: f.color || "var(--brand-primary)",
                    background: f.color ? `${f.color}15` : "var(--brand-primary-15)",
                    color: f.color || "var(--brand-primary)",
                  }
                : {}
            }
          >
            {f.iconUrl ? (
              <img
                src={f.iconUrl}
                alt=""
                className="w-4 h-4 object-contain pointer-events-none"
                style={{
                  // If active, we can colorize it if needed, but standard display is beautiful
                  opacity: isActive ? 1 : 0.7,
                }}
              />
            ) : FIcon ? (
              <FIcon size={13}/>
            ) : null}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
