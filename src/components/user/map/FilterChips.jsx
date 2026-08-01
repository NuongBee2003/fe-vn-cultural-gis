import { useCategories } from "@/api/user/useLocationQuery";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FilterChips({ activeFilter, setActiveFilter }) {
  const { t } = useTranslation();
  const { data: categories = [], isLoading } = useCategories();
  const scrollContainerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const filters = [
    { key: "all", label: t("map.all", "Tất cả"), icon: null },
    { key: "featured", label: t("map.featured", "Nổi bật"), icon: Star, color: "#eab308" },
    ...categories.map((c) => ({
      key: c.name,
      label: c.name,
      icon: null,
      iconUrl: c.icon_marker,
      color: c.color 
    })),
  ];

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeft(scrollLeft > 0);
    // Use a small buffer (1px) to prevent floating point issues on right edge
    setShowRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [categories]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-hidden flex-nowrap pb-2 pointer-events-auto animate-pulse">
        <div className="shrink-0 w-20 h-[30px] bg-gray-200 rounded-full"></div>
        <div className="shrink-0 w-24 h-[30px] bg-gray-200 rounded-full"></div>
        <div className="shrink-0 w-24 h-[30px] bg-gray-200 rounded-full"></div>
        <div className="shrink-0 w-24 h-[30px] bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center w-full pointer-events-auto group">
      {/* Nút cuộn trái */}
      {showLeft && (
        <div className="absolute left-0 z-10 flex items-center h-full pr-4 bg-gradient-to-r from-white via-white to-transparent">
          <button
            onClick={() => scroll("left")}
            className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] text-gray-700 hover:bg-gray-50 border border-gray-100 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Container cuộn */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto flex-nowrap pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
      >
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          const FIcon = f.icon;

          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] border-[1.5px] cursor-pointer shadow-sm transition-all duration-150
                      ${
                        isActive
                          ? "font-semibold"
                          : "bg-white text-gray-700 border-gray-200 font-normal hover:bg-gray-50 hover:border-gray-300"
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
                    opacity: isActive ? 1 : 0.7,
                  }}
                />
              ) : FIcon ? (
                <FIcon size={13} className={isActive ? "fill-current" : ""} />
              ) : null}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Nút cuộn phải */}
      {showRight && (
        <div className="absolute right-0 z-10 flex items-center h-full pl-4 bg-gradient-to-l from-white via-white to-transparent">
          <button
            onClick={() => scroll("right")}
            className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] text-gray-700 hover:bg-gray-50 border border-gray-100 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
