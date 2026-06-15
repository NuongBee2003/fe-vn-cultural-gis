import { useState } from "react";
import { MapPin, Navigation, Route, X, ImageOff } from "lucide-react";
import { CATEGORY_STYLES } from "@/constants/mapLocations";
import ImageMasonryGallery from "@/components/user/map/ImageMasonryGallery";
import ReviewSection from "@/components/user/map/ReviewSection";
import { useAssetsByPlaceId } from "@/api/useLocationQuery";

export default function LocationDetailPanel({
  location,
  onClose,
  onDirections,
  routeLoading = false,
  routeInfo = null,
  isRouteActive = false,
  onClearRoute,
}) {
  const style = CATEGORY_STYLES[location.category] ?? { bg: "rgba(100,100,100,0.75)", color: "#fff" };
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Lấy danh sách hình ảnh từ API theo place_id
  const { data: assets = [], isLoading: isLoadingAssets } = useAssetsByPlaceId(location.placeId);
  
  // Chuyển đổi assets thành array URL
  const galleryImages = assets.length > 0 ? assets.map(asset => asset.url) : [];
  const hasImages = galleryImages.length > 0;

  const openGallery = (index = 0) => {
    if (!hasImages) return;
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  return (
    <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-[1001] flex max-h-[min(72vh,520px)] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.18)] md:bottom-6 md:left-6 md:right-auto md:max-h-[min(80vh,600px)] md:w-[min(400px,calc(100%-3rem))] md:rounded-2xl md:shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
      <div className="flex shrink-0 items-center justify-center py-2 md:hidden">
        <div className="h-1 w-10 rounded-full bg-gray-300" />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md hover:bg-white hover:text-gray-900"
        aria-label="Đóng"
      >
        <X size={18} />
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div
          className="relative h-[140px] w-full shrink-0 md:h-[160px]"
        >
          {isLoadingAssets ? (
            <div className="h-full w-full bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-sm text-gray-400">Đang tải...</span>
            </div>
          ) : hasImages ? (
            <button
              type="button"
              onClick={() => openGallery(0)}
              className="h-full w-full cursor-pointer"
              aria-label="Xem tất cả hình ảnh"
            >
              <img
                src={galleryImages[0]}
                alt={location.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                {galleryImages.length} ảnh
              </span>
            </button>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-2">
              <ImageOff size={32} className="text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Địa điểm chưa được cập nhật hình ảnh</span>
            </div>
          )}
          <div
            className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md"
            style={{ background: style.bg, color: style.color }}
          >
            {location.category}
          </div>
        </div>

        <div className="p-4 pt-3">
          <h3 className="m-0 pr-8 text-[17px] font-bold leading-tight text-gray-900">
            {location.name}
          </h3>


          {location.address && (
            <div className="mt-3 flex items-start gap-1.5 text-[12px] text-gray-600">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
              <span className="leading-relaxed">{location.address}</span>
            </div>
          )}

          {isRouteActive && routeInfo && (
            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700">
                  <Route size={14} />
                  Tuyến đường (bám đường phố)
                </div>
                {onClearRoute && (
                  <button
                    type="button"
                    onClick={onClearRoute}
                    className="text-[11px] font-medium text-blue-600 hover:underline"
                  >
                    Xóa tuyến
                  </button>
                )}
              </div>
              <p className="mt-1 text-[13px] text-gray-700">
                <span className="font-semibold text-gray-900">
                  {routeInfo.distanceText}
                </span>
                {" · "}
                {routeInfo.durationText}
                <span className="text-gray-500">
                  {" "}
                  (chim bay ~{routeInfo.straightKm} km)
                </span>
              </p>
            </div>
          )}

          <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
            {location.description ? location.description : "Chưa có mô tả"}
          </p>

          {hasImages && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {galleryImages.slice(1, 5).map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => openGallery(idx + 1)}
                  className="shrink-0 overflow-hidden rounded-xl ring-2 ring-transparent transition hover:ring-blue-400 focus:outline-none focus:ring-blue-500"
                  aria-label={`Xem ảnh ${idx + 2}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-[64px] w-[64px] object-cover"
                  />
                </button>
              ))}
              {galleryImages.length > 5 && (
                <button
                  type="button"
                  onClick={() => openGallery(0)}
                  className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-xl bg-gray-100 text-[12px] font-semibold text-gray-600 hover:bg-gray-200"
                >
                  +{galleryImages.length - 5}
                </button>
              )}
            </div>
          )}

          <ReviewSection placeId={location.placeId} />

          <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-400">
            <MapPin size={11} />
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-100 bg-white p-4 pt-3">
        <button
          type="button"
          disabled={routeLoading}
          onClick={onDirections}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-[14px] font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Navigation size={18} />
          {routeLoading ? "Đang tính tuyến..." : "Chỉ đường tới đây"}
        </button>
      </div>

      {hasImages && (
        <ImageMasonryGallery
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          images={galleryImages}
          title={location.name}
          initialIndex={galleryIndex}
        />
      )}
    </div>
  );
}
