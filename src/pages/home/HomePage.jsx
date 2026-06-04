import { useCallback, useRef, useState } from "react";
import Map from "@/components/user/map/Map";
import SearchBar from "@/components/user/map/SearchBar";
import FilterChips from "@/components/user/map/FilterChips";
import UserProfile from "@/components/user/map/UserProfile";
import { SlidersHorizontal, X } from "lucide-react";

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Ref để gọi selectLocation bên trong Map từ SearchBar
  const selectLocationRef = useRef(null);

  // Map expose hàm selectLocation ra ngoài qua callback này
  const handleRegisterSelectLocation = useCallback((fn) => {
    selectLocationRef.current = fn;
  }, []);

  // Khi user click vào kết quả search → gọi selectLocation của Map
  const handleSelectFromSearch = useCallback((location) => {
    selectLocationRef.current?.(location);
  }, []);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden">
      <Map
        activeFilter={activeFilter}
        onSelectFromSearch={handleRegisterSelectLocation}
      />

      {/* Mobile Top Controls */}
      <div className="md:hidden absolute top-3 right-3 z-[1500] flex items-center gap-2 pointer-events-auto">
        <UserProfile />
        <button
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--brand-primary)]"
        >
          {showFiltersMobile ? <X size={20} /> : <SlidersHorizontal size={20} />}
        </button>
      </div>

      {/* Desktop Top Bar / Mobile Dropdown */}
      <div
        className={`absolute z-[1499] transition-all duration-300
          ${
            showFiltersMobile
              ? "top-[60px] right-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl pointer-events-auto flex flex-col gap-3"
              : "hidden md:flex top-3 left-3 right-3 flex-row items-center gap-3 pointer-events-none"
          }
        `}
      >
        <div className={`shrink-0 pointer-events-auto ${showFiltersMobile ? "w-full" : ""}`}>
          <SearchBar onSelectLocation={handleSelectFromSearch} />
        </div>
        <div
          className={`flex-1 overflow-hidden pointer-events-auto ${
            showFiltersMobile ? "w-full overflow-x-auto pb-1" : "pr-3"
          }`}
        >
          <FilterChips
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>
        {!showFiltersMobile && (
          <div className="shrink-0 pointer-events-auto hidden md:block">
            <UserProfile />
          </div>
        )}
      </div>
    </div>
  );
}
