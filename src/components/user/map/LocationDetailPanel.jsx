import { useState } from "react";
import { MapPin, Navigation, Route, X } from "lucide-react";
import { CATEGORY_STYLES } from "@/constants/mapLocations";
import ImageMasonryGallery from "@/components/user/map/ImageMasonryGallery";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=750&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=650&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=850&auto=format&fit=crop",
];

export default function LocationDetailPanel({
  location,
  onClose,
  onDirections,
  routeLoading = false,
  routeInfo = null,
  isRouteActive = false,
  onClearRoute,
}) {
  const style = CATEGORY_STYLES[location.category];
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index = 0) => {
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
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="relative h-[140px] w-full shrink-0 cursor-pointer md:h-[160px]"
          aria-label="Xem tất cả hình ảnh"
        >
          <img
            src={GALLERY_IMAGES[0]}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {GALLERY_IMAGES.length} ảnh
          </span>
          <div
            className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md"
            style={{ background: style.bg, color: style.color }}
          >
            {location.category}
          </div>
        </button>

        <div className="p-4 pt-3">
          <h3 className="m-0 pr-8 text-[17px] font-bold leading-tight text-gray-900">
            {location.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-[12px] text-gray-500">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold text-gray-800">4.8</span>
            <span>(128 reviews)</span>
          </div>

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
            Không gian cực chill với view đẹp, thích hợp check-in cuối tuần, đồ
            uống ngon và nhân viên thân thiện.
          </p>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {GALLERY_IMAGES.slice(1, 5).map((img, idx) => (
              <button
                key={img}
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
            {GALLERY_IMAGES.length > 5 && (
              <button
                type="button"
                onClick={() => openGallery(0)}
                className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-xl bg-gray-100 text-[12px] font-semibold text-gray-600 hover:bg-gray-200"
              >
                +{GALLERY_IMAGES.length - 5}
              </button>
            )}
          </div>

          <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
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
              <div key={idx} className="flex gap-2">
                <img
                  src={item.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="m-0 text-[12px] font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="m-0 mt-0.5 text-[11px] text-gray-500">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>

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

      <ImageMasonryGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={GALLERY_IMAGES}
        title={location.name}
        initialIndex={galleryIndex}
      />
    </div>
  );
}
