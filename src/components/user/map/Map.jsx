import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotify } from "@/context/NotifyContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  LayersControl,
  ZoomControl,
} from "react-leaflet";
import { LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { createCustomIcon } from "@/utils/icons";
import { useCategories, useLocationsByGeo, useLocationsByCategory, useFeaturedLocations } from "@/api/useLocationQuery";
import {
  fetchDrivingRoute,
  formatDistance,
  formatDuration,
  haversineKm,
} from "@/utils/osrmRoute";
import FitRouteBounds from "@/components/user/map/FitRouteBounds";
import FlyToSelected from "@/components/user/map/FlyToSelected";
import LocationDetailPanel from "@/components/user/map/LocationDetailPanel";

// Utility: Tính bbox từ map bounds dạng "minLng,minLat,maxLng,maxLat"
function getBboxFromBounds(bounds) {
  if (!bounds) return null;
  const { _southWest, _northEast } = bounds;
  return `${_southWest.lng},${_southWest.lat},${_northEast.lng},${_northEast.lat}`;
}

export default function Map({ activeFilter = "all", onSelectFromSearch, onLocationsCountChange, searchResults = null, hoveredLocation = null }) {
  const notify = useNotify();
  const { data: categories = [] } = useCategories();
  const [bbox, setBbox] = useState(null);
  
  // Tìm category ID từ activeFilter
  const selectedCategoryId = useMemo(() => {
    if (activeFilter === "all" || activeFilter === "featured") return null;
    const cat = categories.find((c) => c.name === activeFilter);
    return cat?.id || null;
  }, [activeFilter, categories]);

  // Gọi API theo filter: 
  // - Nếu "all" → gọi getLocationsByGeo (theo bbox)
  // - Nếu "featured" → gọi getFeaturedLocations
  // - Nếu có category → gọi getLocationsByCategory
  const {
    data: geoLocations = [],
    isLoading: isLoadingGeo,
    isFetching: isFetchingGeo,
  } = useLocationsByGeo(activeFilter === "all" ? bbox : null, 100);

  const {
    data: categoryLocations = [],
    isLoading: isLoadingCategory,
    isFetching: isFetchingCategory,
  } = useLocationsByCategory(selectedCategoryId);

  const {
    data: featuredLocations = [],
    isLoading: isLoadingFeatured,
    isFetching: isFetchingFeatured,
  } = useFeaturedLocations({ enabled: activeFilter === "featured" });

  // Chọn data tùy theo filter
  const apiLocations = useMemo(() => {
    if (activeFilter === "all") return geoLocations;
    if (activeFilter === "featured") return featuredLocations;
    return categoryLocations;
  }, [activeFilter, geoLocations, featuredLocations, categoryLocations]);

  // isLoading: true ở lần tải đầu tiên (chưa có cache)
  const isLoadingLocations = useMemo(() => {
    if (activeFilter === "all") return isLoadingGeo;
    if (activeFilter === "featured") return isLoadingFeatured;
    return isLoadingCategory;
  }, [activeFilter, isLoadingGeo, isLoadingFeatured, isLoadingCategory]);

  // isFetching: true mỗi lần gọi API kể cả background refetch
  const isFetchingLocations = useMemo(() => {
    if (activeFilter === "all") return isFetchingGeo;
    if (activeFilter === "featured") return isFetchingFeatured;
    return isFetchingCategory;
  }, [activeFilter, isFetchingGeo, isFetchingFeatured, isFetchingCategory]);

  // Location được pin từ search (có thể nằm ngoài bbox hiện tại)
  const [pinnedLocation, setPinnedLocation] = useState(null);

  // Merge: nếu có kết quả tìm kiếm thì hiển thị kết quả tìm kiếm. Ngược lại hiển thị theo viewport/category.
  const filtered = useMemo(() => {
    if (searchResults !== null) {
      return searchResults;
    }
    if (!pinnedLocation) return apiLocations;
    const alreadyLoaded = apiLocations.some((loc) => loc.id === pinnedLocation.id);
    if (alreadyLoaded) return apiLocations; // đã có trong viewport, bỏ pin
    // Chưa load được → gửi thêm vào đầu list để render marker
    return [pinnedLocation, ...apiLocations];
  }, [apiLocations, pinnedLocation, searchResults]);

  // Báo cáo số lượng địa điểm hiện tại trên bản đồ lên component cha
  useEffect(() => {
    const timer = setTimeout(() => {
      onLocationsCountChange?.(filtered.length);
    }, 0);
    return () => clearTimeout(timer);
  }, [filtered.length, onLocationsCountChange]);

  const [mapInstance, setMapInstance] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [routePositions, setRoutePositions] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [selected, setSelected] = useState(
    /** @type {{ location: object } | null} */ (null)
  );

  const clearRoute = useCallback(() => {
    setRoutePositions(null);
    setRouteInfo(null);
    setRouteDestination(null);
  }, []);

  const closePanel = useCallback(() => {
    setSelected(null);
  }, []);

  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Trình duyệt không hỗ trợ định vị."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const latlng = [latitude, longitude];
          setUserPosition(latlng);
          resolve({ lat: latitude, lng: longitude });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });
  }, []);

  const showRouteTo = useCallback(
    async (location) => {
      setRouteLoading(true);
      clearRoute();
      setRouteDestination(location);

      try {
        let start;
        if (userPosition) {
          start = { lat: userPosition[0], lng: userPosition[1] };
        } else {
          start = await getCurrentPosition();
        }

        const end = { lat: location.lat, lng: location.lng };
        const { positions, distanceMeters, durationSeconds } =
          await fetchDrivingRoute(start, end);

        setRoutePositions(positions);
        setRouteInfo({
          distanceText: formatDistance(distanceMeters),
          durationText: formatDuration(durationSeconds),
          straightKm: haversineKm(start, end).toFixed(1),
        });
      } catch (err) {
        console.error(err);
        notify.error(
          err instanceof Error
            ? err.message
            : "Không thể tính tuyến đường. Hãy bật quyền vị trí và thử lại.",
          "Lỗi tuyến đường"
        );
        setRouteDestination(null);
      } finally {
        setRouteLoading(false);
      }
    },
    [userPosition, getCurrentPosition, clearRoute]
  );

  const selectLocation = useCallback((location) => {
    setSelected({ location });
  }, []);

  // Expose selectLocation cho SearchBar (qua HomePage ref pattern)
  // Khi search chọn 1 kết quả: pin marker + fly + cập nhật bbox vùng đó
  const selectFromSearch = useCallback((location) => {
    if (!location?.lat || !location?.lng) return;

    // Hủy các cập nhật bbox do bản đồ di chuyển trước đó (debounce 500ms) để không ghi đè bbox hẹp
    if (bboxTimerRef.current) {
      clearTimeout(bboxTimerRef.current);
    }

    // Tự động tìm thêm markerColor và iconMarker từ Category nếu địa điểm ghim chưa có
    let markerColor = location.markerColor;
    let iconMarker = location.iconMarker;
    
    if (!markerColor || !iconMarker) {
      const catName = location.category || "Quán ăn";
      const cat = categories.find((c) => c.name === catName);
      if (cat) {
        markerColor = markerColor || cat.color;
        iconMarker = iconMarker || cat.icon_marker;
      }
    }

    // Đánh dấu để không bị effect filter ép close
    const pinned = { 
      ...location, 
      markerColor: markerColor || "#3b82f6",
      iconMarker: iconMarker || "",
      _fromSearch: true 
    };
    setPinnedLocation(pinned);
    setSelected({ location: pinned });

    // Cập nhật bbox xung quanh vị trí được chọn → trigger load markers mới
    const delta = 0.01; // ~1km
    const newBbox = `${location.lng - delta},${location.lat - delta},${location.lng + delta},${location.lat + delta}`;
    setBbox(newBbox);
  }, [categories]);

  useEffect(() => {
    onSelectFromSearch?.(selectFromSearch);
  }, [onSelectFromSearch, selectFromSearch]);

  // Tự động fit bounds hoặc flyTo khi có kết quả tìm kiếm mới
  useEffect(() => {
    if (!mapInstance || !searchResults) return;

    if (searchResults.length > 1) {
      const coordinates = searchResults
        .filter((loc) => loc.lat && loc.lng)
        .map((loc) => [loc.lat, loc.lng]);

      if (coordinates.length > 0) {
        const bounds = L.latLngBounds(coordinates);
        mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    } else if (searchResults.length === 1) {
      const singleLoc = searchResults[0];
      if (singleLoc.lat && singleLoc.lng) {
        mapInstance.flyTo([singleLoc.lat, singleLoc.lng], 15, { duration: 0.75 });
        setSelected({ location: singleLoc });
      }
    }
  }, [mapInstance, searchResults]);

  // Dọn dẹp pinnedLocation khi thay đổi bộ lọc category
  useEffect(() => {
    setPinnedLocation(null);
  }, [activeFilter]);

  // Dọn pin khi location đã có trong apiLocations (bbox đã load xong vùng mới)
  useEffect(() => {
    if (!pinnedLocation) return;
    const loaded = apiLocations.some((loc) => loc.id === pinnedLocation.id);
    if (loaded) {
      setPinnedLocation(null);
      // Cập nhật selected để dùng object mới từ apiLocations (không có _fromSearch)
      const fresh = apiLocations.find((loc) => loc.id === pinnedLocation.id);
      if (fresh) setSelected({ location: fresh });
    }
  }, [apiLocations, pinnedLocation]);

  // Đóng panel nếu filter category thay đổi và địa điểm đang chọn không khớp với category đó
  useEffect(() => {
    if (!selected) return;
    const { location } = selected;
    if (location._fromSearch) return; // đang pin, không đóng

    if (activeFilter === "featured") {
      if (!location.isFeatured) {
        setSelected(null);
        clearRoute();
      }
    } else if (activeFilter !== "all" && location.category !== activeFilter) {
      setSelected(null);
      clearRoute();
    }
  }, [activeFilter, selected, clearRoute]);

  const selectedFlyPosition = useMemo(() => {
    return selected ? [selected.location.lat, selected.location.lng] : null;
  }, [selected]);

  const isRouteForSelected =
    selected &&
    routeDestination &&
    routeDestination.name === selected.location.name &&
    routeDestination.lat === selected.location.lat &&
    routeDestination.lng === selected.location.lng;

  const locateUser = () => {
    if (!mapInstance) return;
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = [latitude, longitude];
        setUserPosition(latlng);
        mapInstance.flyTo(latlng, 14);
        setLoadingLocation(false);
      },
      (err) => {
        console.error(err);
        notify.error("Không thể lấy vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Lắng nghe sự kiện di chuyển/zoom bản đồ để cập nhật bbox
  // Debounce 500ms: tránh gọi API liên tục khi pan/zoom → giảm flicker
  const bboxTimerRef = useRef(null);

  useEffect(() => {
    if (!mapInstance) return;
    const initialBounds = mapInstance.getBounds();
    const initialBbox = getBboxFromBounds(initialBounds);
    if (initialBbox) setBbox(initialBbox);
  }, [mapInstance]);

  useEffect(() => {
    if (!mapInstance) return;

    const handleMapMoveStart = () => {
      if (bboxTimerRef.current) clearTimeout(bboxTimerRef.current);
    };

    const handleMapMove = () => {
      if (bboxTimerRef.current) clearTimeout(bboxTimerRef.current);
      bboxTimerRef.current = setTimeout(() => {
        const bounds = mapInstance.getBounds();
        const newBbox = getBboxFromBounds(bounds);
        if (newBbox) setBbox(newBbox);
      }, 500); // chờ 500ms sau khi dừng pan/zoom mới gọi API
    };

    mapInstance.on("movestart", handleMapMoveStart);
    mapInstance.on("zoomstart", handleMapMoveStart);
    mapInstance.on("moveend", handleMapMove);
    mapInstance.on("zoomend", handleMapMove);

    return () => {
      mapInstance.off("movestart", handleMapMoveStart);
      mapInstance.off("zoomstart", handleMapMoveStart);
      mapInstance.off("moveend", handleMapMove);
      mapInstance.off("zoomend", handleMapMove);
      if (bboxTimerRef.current) clearTimeout(bboxTimerRef.current);
    };
  }, [mapInstance]);

  // ── Lock / unlock mọi tương tác của bản đồ khi đang fetch ──
  useEffect(() => {
    if (!mapInstance) return;
    const handlers = [
      mapInstance.dragging,
      mapInstance.scrollWheelZoom,
      mapInstance.doubleClickZoom,
      mapInstance.touchZoom,
      mapInstance.boxZoom,
      mapInstance.keyboard,
    ];
    if (isFetchingLocations) {
      handlers.forEach((h) => h?.disable());
    } else {
      handlers.forEach((h) => h?.enable());
    }
  }, [mapInstance, isFetchingLocations]);

  return (
    <div className="relative h-full w-full" style={{ cursor: isLoadingLocations ? "wait" : "unset" }}>
      {/* ── Pointer blocker & overlay: ngăn mọi touch/click xuống Leaflet khi đang tải lần đầu và hiển thị nền xám ── */}
      {isLoadingLocations && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 998,
            cursor: "wait",
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(2px)",
            transition: "all 0.3s ease",
          }}
        />
      )}

      <MapContainer
        center={[10.79, 106.68]}
        zoom={12}
        zoomControl={false}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        ref={setMapInstance}
      >
        <ZoomControl position="bottomleft" />
        <LayersControl position="bottomright">
          <LayersControl.BaseLayer checked name="Bản đồ Đường phố">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Bản đồ Vệ tinh">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <FlyToSelected position={selectedFlyPosition} />

        {userPosition && (
          <Marker
            position={userPosition}
            icon={createCustomIcon("#2563eb", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>')}
          />
        )}

        {routePositions && (
          <>
            <Polyline
              positions={routePositions}
              pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.85 }}
            />
            <FitRouteBounds positions={routePositions} />
          </>
        )}

        {filtered.map((location) => {
          const key = location.id || `temp-${location.lat}-${location.lng}-${location.name}`;
          const isActive =
            selected &&
            (selected.location.id && location.id
              ? selected.location.id === location.id
              : selected.location.lat === location.lat && selected.location.lng === location.lng);

          const isHovered =
            hoveredLocation &&
            (hoveredLocation.id && location.id
              ? hoveredLocation.id === location.id
              : hoveredLocation.lat === location.lat && hoveredLocation.lng === location.lng);

          return (
            <Marker
              key={key}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(location.markerColor || "#3b82f6", location.iconMarker || "", { active: isActive || isHovered })}
              zIndexOffset={isActive || isHovered ? 1000 : 0}
              eventHandlers={{
                click: () => selectLocation(location),
              }}
            />
          );
        })}
      </MapContainer>

      {selected && (
        <>
          <button
            type="button"
            aria-label="Đóng chi tiết"
            className="absolute inset-0 z-[1000] bg-black/20 md:bg-transparent"
            onClick={closePanel}
          />
          <LocationDetailPanel
            location={selected.location}
            onClose={closePanel}
            onDirections={() => showRouteTo(selected.location)}
            routeLoading={routeLoading}
            routeInfo={isRouteForSelected ? routeInfo : null}
            isRouteActive={Boolean(isRouteForSelected && routeInfo)}
            onClearRoute={clearRoute}
          />
        </>
      )}

      <div className="absolute bottom-[100px] right-[10px] z-[1000]">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            locateUser();
          }}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-colors hover:bg-gray-50"
          title="Vị trí của tôi"
        >
          <LocateFixed
            className={`text-blue-600 ${loadingLocation ? "animate-pulse" : ""}`}
            size={24}
          />
        </button>
      </div>

      {/* ── Skeleton loading overlay — hiện khi isFetching (cả lần đầu lẫn background refetch) ── */}
      {isFetchingLocations && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(36, 18, 9, 0.82)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(201,168,76,0.35)",
            borderRadius: 14,
            padding: "9px 16px 9px 12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.28), 0 0 0 1px rgba(201,168,76,0.12)",
            minWidth: 210,
            pointerEvents: "none",
          }}
        >
          {/* Spinner vòng tròn */}
          <svg
            width={20} height={20} viewBox="0 0 24 24" fill="none"
            style={{ flexShrink: 0, animation: "_map_spin 0.85s linear infinite" }}
          >
            <circle cx="12" cy="12" r="9" stroke="rgba(201,168,76,0.2)" strokeWidth="3" />
            <path d="M12 3a9 9 0 0 1 9 9" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" />
          </svg>

          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ height: 3, borderRadius: 99, background: "rgba(201,168,76,0.15)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: "55%",
                  borderRadius: 99,
                  background: "linear-gradient(90deg, transparent, #c9a84c, #f0d98a, #c9a84c, transparent)",
                  backgroundSize: "300% 100%",
                  animation: "_map_shimmer 1.6s ease-in-out infinite",
                }}
              />
            </div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#f5edd6", whiteSpace: "nowrap" }}>
              Đang tải địa điểm…
            </p>
          </div>

          <style>{`
            @keyframes _map_spin   { to { transform: rotate(360deg); } }
            @keyframes _map_shimmer {
              0%   { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
