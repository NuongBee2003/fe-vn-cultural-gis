import { useCallback, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Map from "@/components/user/map/Map";
import SearchBar from "@/components/user/map/SearchBar";
import FilterChips from "@/components/user/map/FilterChips";
import { SlidersHorizontal, X, MapPin } from "lucide-react";
import { useAllLocations } from "@/api/user/useLocationQuery";

export default function HomePage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [locationsCount, setLocationsCount] = useState(0);

  // Gọi API lấy tổng số lượng tất cả địa điểm có trong hệ thống
  const { data: allLocsData } = useAllLocations(1, 1);
  const totalDbCount = allLocsData?.meta?.total ?? 0;

  // Tính số lượng địa điểm hiển thị theo filter:
  // - Nếu filter = "all": hiển thị tổng số địa điểm trong DB (tránh bị giới hạn bởi geo-viewport)
  // - Nếu filter khác: hiển thị số lượng địa điểm theo category đã được Map báo lên
  const displayCount = activeFilter === "all" ? totalDbCount : locationsCount;

  // Ref để gọi selectLocation bên trong Map từ SearchBar
  const selectLocationRef = useRef(null);
  // Ref để lưu tọa độ chờ bay tới nếu bản đồ chưa sẵn sàng
  const pendingLocationRef = useRef(null);

  const location = useLocation();

  const [searchResults, setSearchResults] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  // Tính toán urlQuery trực tiếp từ query params của location.search trong thân component
  const searchParams = new URLSearchParams(location.search);
  const urlQuery = searchParams.get("q") || "";

  // Map expose hàm selectLocation ra ngoài qua callback này
  const handleRegisterSelectLocation = useCallback((fn) => {
    selectLocationRef.current = fn;
    if (pendingLocationRef.current) {
      fn(pendingLocationRef.current);
      pendingLocationRef.current = null;
    }
  }, []);

  // Đọc URL params khi location.search thay đổi → flyTo trực tiếp nếu có tọa độ lat/lng
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const locationId = searchParams.get("location_id");
    const placeId = searchParams.get("place_id");
    const name = searchParams.get("name");
    const address = searchParams.get("address");
    const categoryName = searchParams.get("category_name");
    const markerColor = searchParams.get("marker_color");
    const iconMarker = searchParams.get("icon_marker");

    if (lat && lng) {
      const target = {
        id: locationId ? Number(locationId) : null,
        placeId: placeId ? Number(placeId) : null,
        lat: Number(lat),
        lng: Number(lng),
        name: name || "Địa điểm",
        address: address || "",
        category: categoryName || "Quán ăn",
        markerColor: markerColor || null,
        iconMarker: iconMarker || null,
        _fromSearch: true,
      };

      if (selectLocationRef.current) {
        // Bản đồ đã sẵn sàng -> Gọi flyTo trực tiếp
        selectLocationRef.current(target);
      } else {
        // Bản đồ chưa sẵn sàng -> Lưu vào ref để chờ
        pendingLocationRef.current = target;
      }
    }
  }, [location.search]);

  // Dọn dẹp kết quả tìm kiếm khi thay đổi filter bộ lọc category
  useEffect(() => {
    setSearchResults(null);
  }, [activeFilter]);

  // Khi user click vào kết quả search → gọi selectLocation của Map
  const handleSelectFromSearch = useCallback((locationItem) => {
    selectLocationRef.current?.(locationItem);
  }, []);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden">
      <Map
        activeFilter={activeFilter}
        onSelectFromSearch={handleRegisterSelectLocation}
        onLocationsCountChange={setLocationsCount}
        searchResults={searchResults}
        hoveredLocation={hoveredLocation}
      />

      {/* Mobile Top Controls */}
      <div className="md:hidden absolute top-3 right-3 z-[1500] flex items-center gap-2 pointer-events-auto">
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
          ${showFiltersMobile
            ? "top-[60px] right-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl pointer-events-auto flex flex-col gap-3"
            : "hidden md:flex top-3 left-3 right-3 flex-row items-center gap-3 pointer-events-none"
          }
        `}
      >
        <div className={`shrink-0 pointer-events-auto ${showFiltersMobile ? "w-full" : ""}`}>
          <SearchBar
            onSelectLocation={handleSelectFromSearch}
            onSearchSubmit={(results) => setSearchResults(results)}
            onSearchClear={() => setSearchResults(null)}
            initialValue={urlQuery}
            onHoverLocation={setHoveredLocation}
          />
        </div>
        <div
          className={`flex-1 overflow-hidden pointer-events-auto ${showFiltersMobile ? "w-full overflow-x-auto pb-1" : "pr-3"
            }`}
        >
          <FilterChips
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>
        {!showFiltersMobile && (
          <div className="shrink-0 pointer-events-auto hidden md:flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all hover:bg-muted text-foreground">
              <MapPin size={13.5} className="text-[var(--brand-primary)]" />
              <span>{t('map.totalLocations', { count: displayCount })}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
