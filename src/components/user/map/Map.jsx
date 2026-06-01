import { useCallback, useEffect, useMemo, useState } from "react";
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

import { createCustomIcon } from "@/utils/icons";
import { useCategories, useLocationsByGeo, useLocationsByCategory } from "@/api/useLocationQuery";
import {
  fetchDrivingRoute,
  formatDistance,
  formatDuration,
  haversineKm,
} from "@/utils/osrmRoute";
import FitRouteBounds from "@/components/user/map/FitRouteBounds";
import FlyToSelected from "@/components/user/map/FlyToSelected";
import LocationDetailPanel from "@/components/user/map/LocationDetailPanel";

function locationKey(location, index) {
  return `${location.id}-${index}`;
}

// Utility: Tính bbox từ map bounds dạng "minLng,minLat,maxLng,maxLat"
function getBboxFromBounds(bounds) {
  if (!bounds) return null;
  const { _southWest, _northEast } = bounds;
  return `${_southWest.lng},${_southWest.lat},${_northEast.lng},${_northEast.lat}`;
}

export default function Map({ activeFilter = "all", search = "" }) {
  const { data: categories = [] } = useCategories();
  const [bbox, setBbox] = useState("106.68,10.76,106.70,10.79");
  
  // Tìm category ID từ activeFilter
  const selectedCategoryId = useMemo(() => {
    if (activeFilter === "all") return null;
    const cat = categories.find((c) => c.name === activeFilter);
    return cat?.id || null;
  }, [activeFilter, categories]);

  // Gọi API theo filter: 
  // - Nếu "all" → gọi getLocationsByGeo (theo bbox)
  // - Nếu có category → gọi getLocationsByCategory
  const { data: geoLocations = [], isLoading: isLoadingGeo } = useLocationsByGeo(
    activeFilter === "all" ? bbox : null,
    50
  );
  const { data: categoryLocations = [], isLoading: isLoadingCategory } = useLocationsByCategory(
    selectedCategoryId
  );

  // Chọn data tùy theo filter
  const apiLocations = activeFilter === "all" ? geoLocations : categoryLocations;
  const isLoadingLocations = activeFilter === "all" ? isLoadingGeo : isLoadingCategory;

  // Lọc locations theo search text
  const filtered = useMemo(() => {
    return apiLocations.filter((loc) => {
      const matchSearch = loc.name.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [apiLocations, search]);

  const [mapInstance, setMapInstance] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [routePositions, setRoutePositions] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [selected, setSelected] = useState(
    /** @type {{ location: typeof ALL_LOCATIONS[0]; index: number } | null} */ (null)
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
        alert(
          err instanceof Error
            ? err.message
            : "Không thể tính tuyến đường. Hãy bật quyền vị trí và thử lại."
        );
        setRouteDestination(null);
      } finally {
        setRouteLoading(false);
      }
    },
    [userPosition, getCurrentPosition, clearRoute]
  );

  const selectLocation = useCallback((location, index) => {
    setSelected({ location, index });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const { location } = selected;
    const stillVisible = filtered.some(
      (loc) =>
        loc.name === location.name &&
        loc.lat === location.lat &&
        loc.lng === location.lng
    );
    if (!stillVisible) {
      setSelected(null);
      clearRoute();
    }
  }, [filtered, selected, clearRoute]);

  const selectedFlyPosition = selected
    ? [selected.location.lat, selected.location.lng]
    : null;

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
        alert("Không thể lấy vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Lắng nghe sự kiện di chuyển/zoom bản đồ để cập nhật bbox
  useEffect(() => {
    if (!mapInstance) return;

    const handleMapMove = () => {
      const bounds = mapInstance.getBounds();
      const newBbox = getBboxFromBounds(bounds);
      if (newBbox) {
        setBbox(newBbox);
      }
    };

    mapInstance.on("moveend", handleMapMove);
    mapInstance.on("zoomend", handleMapMove);

    return () => {
      mapInstance.off("moveend", handleMapMove);
      mapInstance.off("zoomend", handleMapMove);
    };
  }, [mapInstance]);

  return (
    <div className="relative h-full w-full">
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

        {filtered.map((location, index) => {
          const key = locationKey(location, index);
          const isActive =
            selected &&
            locationKey(selected.location, selected.index) === key;

          return (
            <Marker
              key={key}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(location.markerColor || "#3b82f6", location.iconMarker || "", { active: isActive })}
              zIndexOffset={isActive ? 1000 : 0}
              eventHandlers={{
                click: () => selectLocation(location, index),
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

      {/* Loading indicator */}
      {isLoadingLocations && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-lg shadow-md text-sm text-gray-600">
          Đang tải markers...
        </div>
      )}
    </div>
  );
}
