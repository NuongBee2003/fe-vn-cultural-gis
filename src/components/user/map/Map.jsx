import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import { MapPin, LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";

import { ALL_LOCATIONS, CATEGORY_STYLES } from "@/constants/mapLocations";
import { createCustomIcon } from "@/utils/icons";

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

export default function Map({ activeFilter = "all", search = "" }) {
  const iconByCategory = useMemo(() => {
    /** @type {Record<string, any>} */
    const cache = {};

    for (const cat of Object.keys(CATEGORY_STYLES)) {
      const style = CATEGORY_STYLES[cat];
      const inner =
        cat === "Quán ăn"
          ? Food_SVG
          : cat === "Quán cafe"
            ? Coffee_SVG
            : cat === "Di tích"
              ? DiTich_SVG
              : cat === "Hội quán"
                ? HoiQuan_SVG
                : cat === "Bảo tàng"
                  ? BaoTang_SVG
                  : cat === "Nhà hát"
                    ? NhaHat_SVG
                    : cat === "Chùa"
                      ? Chua_SVG
                      : cat === "Đình"
                        ? Dinh_SVG
                        : cat === "Lăng"
                          ? Lang_SVG
                          : cat === "Đền"
                            ? Den_SVG
                            : Default_Location_SVG;
      cache[cat] = createCustomIcon(style.markerColor, inner);
    }

    return cache;
  }, []);

  const filtered = ALL_LOCATIONS.filter((loc) => {
    const matchFilter = activeFilter === "all" || loc.category === activeFilter;
    const matchSearch = loc.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const [mapInstance, setMapInstance] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

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
    <div className="relative w-full h-full">
      <MapContainer
        center={[10.79, 106.68]}
        zoom={12}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
        ref={setMapInstance}
      >
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

        {userPosition && (
          <Marker position={userPosition}>
            <Popup className="rounded-2xl">
              <div className="p-2 font-semibold text-center text-[13px] whitespace-nowrap">
                Vị trí hiện tại của bạn
              </div>
            </Popup>
          </Marker>
        )}
      {filtered.map((location, index) => {
        const style = CATEGORY_STYLES[location.category];
        return (
          <Marker
            key={`${location.name}-${index}`}
            position={[location.lat, location.lng]}
            icon={iconByCategory[location.category]}
          >
            <Popup maxWidth={320} className="rounded-2xl">
              <div className="w-[300px] overflow-hidden rounded-2xl bg-white">
                <div className="relative h-[150px] w-full">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {location.category}
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="m-0 text-[16px] font-bold text-gray-900 leading-tight">
                        {location.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-[12px] text-gray-500">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold text-gray-800">4.8</span>
                        <span>(128 reviews)</span>
                      </div>
                    </div>

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: style.bg }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="white"
                          opacity="0.2"
                        />
                      </svg>
                    </div>
                  </div>

                  {location.address && (
                    <div className="mt-3 flex items-start gap-1.5 text-[12px] text-gray-600">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                      <span className="leading-relaxed">{location.address}</span>
                    </div>
                  )}

                  <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
                    Không gian cực chill với view đẹp, thích hợp check-in cuối
                    tuần, đồ uống ngon và nhân viên thân thiện.
                  </p>

                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {[
                      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
                      "https://images.unsplash.com/photo-1521017432531-fbd92d768814",
                      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
                      "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
                    ].map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt=""
                        className="w-[68px] h-[68px] rounded-xl object-cover shrink-0"
                      />
                    ))}
                  </div>

                  <div className="mt-4 space-y-3">
                    {[
                      {
                        avatar: "https://i.pravatar.cc/40?img=12",
                        name: "Nguyễn Minh",
                        comment: "View siêu đẹp, rất đáng thử!",
                      },
                      {
                        avatar: "https://i.pravatar.cc/40?img=32",
                        name: "Hoàng Anh",
                        comment: "Decor đẹp kiểu Hàn, khá chill.",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2 ${idx === 0 ? "border-t border-gray-100 pt-3" : ""}`}
                      >
                        <img
                          src={item.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="m-0 text-[12px] font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="m-0 mt-0.5 text-[11px] text-gray-500">
                            "{item.comment}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3 flex items-center gap-1 text-[11px] text-gray-400">
                    <MapPin size={11} />
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>

      <div className="absolute bottom-[100px] right-[10px] z-[1000]">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            locateUser();
          }}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-gray-50 transition-colors cursor-pointer"
          title="Vị trí của tôi"
        >
          <LocateFixed className={`text-blue-600 ${loadingLocation ? 'animate-pulse' : ''}`} size={24} />
        </button>
      </div>
    </div>
  );
}
