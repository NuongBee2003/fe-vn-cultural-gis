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

import { ALL_LOCATIONS, CATEGORY_STYLES } from "@/constants/mapLocations";
import { createCustomIcon } from "@/utils/icons";
import { useCategories } from "@/api/useLocationQuery";
import {
  fetchDrivingRoute,
  formatDistance,
  formatDuration,
  haversineKm,
} from "@/utils/osrmRoute";
import FitRouteBounds from "@/components/user/map/FitRouteBounds";
import FlyToSelected from "@/components/user/map/FlyToSelected";
import LocationDetailPanel from "@/components/user/map/LocationDetailPanel";

import Food_SVG from "@/assets/icons/food-dinner-svgrepo-com.svg?raw";
import Coffee_SVG from "@/assets/icons/coffee-svgrepo.svg?raw";
import DiTich_SVG from "@/assets/icons/ditich-svgrepo-com.svg?raw";
import Default_Location_SVG from "@/assets/icons/map-point-search-svgrepo-com.svg?raw";
import HoiQuan_SVG from "@/assets/icons/hoiquan-svgrepo-com.svg?raw";
import BaoTang_SVG from "@/assets/icons/museum-svgrepo-com.svg?raw";
import NhaHat_SVG from "@/assets/icons/nhahat-svgrepo-com.svg?raw";
import Chua_SVG from "@/assets/icons/pagoda-china-svgrepo-com.svg?raw";
import Dinh_SVG from "@/assets/icons/Dinh-svgrepo-com.svg?raw";
import Lang_SVG from "@/assets/icons/ho-chi-ming-mausoleum-svgrepo-com.svg?raw";
import Den_SVG from "@/assets/icons/temple-structure-svgrepo-com.svg?raw";

function getCategorySvg(cat) {
  switch (cat) {
    case "Quán ăn":
      return Food_SVG;
    case "Quán cafe":
      return Coffee_SVG;
    case "Di tích":
      return DiTich_SVG;
    case "Hội quán":
      return HoiQuan_SVG;
    case "Bảo tàng":
      return BaoTang_SVG;
    case "Nhà hát":
      return NhaHat_SVG;
    case "Chùa":
      return Chua_SVG;
    case "Đình":
      return Dinh_SVG;
    case "Lăng":
      return Lang_SVG;
    case "Đền":
      return Den_SVG;
    default:
      return Default_Location_SVG;
  }
}

function locationKey(location, index) {
  return `${location.name}-${index}`;
}

export default function Map({ activeFilter = "all", search = "" }) {
  const { data: categories = [] } = useCategories();

  const { iconByCategory, activeIconByCategory } = useMemo(() => {
    /** @type {Record<string, L.DivIcon>} */
    const normal = {};
    /** @type {Record<string, L.DivIcon>} */
    const active = {};

    // 1. Initialize icons from the dynamic categories list loaded from API
    for (const c of categories) {
      const catName = c.name;
      const style = CATEGORY_STYLES[catName];
      const markerColor = style?.markerColor || "#3b82f6";
      const inner = c.icon_marker || getCategorySvg(catName);

      normal[catName] = createCustomIcon(markerColor, inner);
      active[catName] = createCustomIcon(markerColor, inner, { active: true });
    }

    // 2. Pre-fill hardcoded CATEGORY_STYLES if API doesn't have them yet (fallback/development)
    for (const catName of Object.keys(CATEGORY_STYLES)) {
      if (!normal[catName]) {
        const style = CATEGORY_STYLES[catName];
        const inner = getCategorySvg(catName);
        normal[catName] = createCustomIcon(style.markerColor, inner);
        active[catName] = createCustomIcon(style.markerColor, inner, { active: true });
      }
    }

    return { iconByCategory: normal, activeIconByCategory: active };
  }, [categories]);

  const filtered = ALL_LOCATIONS.filter((loc) => {
    const matchFilter = activeFilter === "all" || loc.category === activeFilter;
    const matchSearch = loc.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

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
            icon={createCustomIcon("#2563eb", Default_Location_SVG)}
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
              icon={
                isActive
                  ? activeIconByCategory[location.category] || createCustomIcon("#3b82f6", getCategorySvg(location.category), { active: true })
                  : iconByCategory[location.category] || createCustomIcon("#3b82f6", getCategorySvg(location.category))
              }
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
    </div>
  );
}
