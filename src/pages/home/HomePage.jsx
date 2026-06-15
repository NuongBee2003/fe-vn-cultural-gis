import { useCallback, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Map from "@/components/user/map/Map";
import SearchBar from "@/components/user/map/SearchBar";
import FilterChips from "@/components/user/map/FilterChips";
import { SlidersHorizontal, X, MapPin } from "lucide-react";
import { useAllLocations } from "@/api/useLocationQuery";
import { searchPlaceLocationsByDB } from "@/api/locationApi";

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
  // Track khi Map đã đăng ký xong callback
  const [isMapReady, setIsMapReady] = useState(false);

  const location = useLocation();

  // Lưu pending navigation từ URL params để flyTo khi Map sẵn sàng
  const [pendingNavLocation, setPendingNavLocation] = useState(null);

  // Map expose hàm selectLocation ra ngoài qua callback này
  const handleRegisterSelectLocation = useCallback((fn) => {
    selectLocationRef.current = fn;
    setIsMapReady(true);
  }, []);

  // Đọc URL params khi location.search thay đổi → lưu vào pendingNavLocation
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
    const q = searchParams.get("q"); // tên địa điểm để search (khi không có lat/lng)

    if (lat && lng) {
      // Có tọa độ → flyTo trực tiếp
      setPendingNavLocation({
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
      });
    } else if (q) {
      // Không có tọa độ → search theo tên
      setPendingNavLocation({ _searchQuery: q });
    } else {
      setPendingNavLocation(null);
    }
  }, [location.search]);

  // Khi Map đã sẵn sàng VÀ có pendingNavLocation → gọi flyTo hoặc search
  useEffect(() => {
    if (!isMapReady || !pendingNavLocation || !selectLocationRef.current) return;

    const run = async () => {
      if (pendingNavLocation._searchQuery) {
        // Search theo tên trong DB, lấy kết quả đầu tiên có tọa độ
        try {
          const results = await searchPlaceLocationsByDB(pendingNavLocation._searchQuery, 1);
          if (results && results.length > 0 && results[0].lat && results[0].lng) {
            selectLocationRef.current(results[0]);
          }
        } catch {
          // bỏ qua lỗi tìm kiếm
        }
      } else {
        // flyTo trực tiếp bằng tọa độ
        selectLocationRef.current(pendingNavLocation);
      }
      setPendingNavLocation(null);
    };

    run();
  }, [isMapReady, pendingNavLocation]);

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
          <SearchBar onSelectLocation={handleSelectFromSearch} />
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
