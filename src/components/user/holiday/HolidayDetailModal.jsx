import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Calendar, MapPin, Utensils, CheckSquare, Bookmark } from "lucide-react";
import { HOLIDAY_IMAGES } from "@/pages/user/holiday/HolidaysPage";

export default function HolidayDetailModal({ item, onClose }) {
  const navigate = useNavigate();

  const handleDestinationClick = (locationObj) => {
    if (!locationObj || !locationObj.lat || !locationObj.lng) return;
    onClose();
    
    const placeName = locationObj.place?.name || "Địa điểm gợi ý";
    const categoryName = locationObj.place?.category?.name || "";
    const markerColor = locationObj.place?.category?.color || "";
    const iconMarker = locationObj.place?.category?.icon_marker || "";

    navigate(`/?lat=${locationObj.lat}&lng=${locationObj.lng}&location_id=${locationObj.id}&place_id=${locationObj.place_id || ""}&name=${encodeURIComponent(placeName)}&category_name=${encodeURIComponent(categoryName)}&marker_color=${encodeURIComponent(markerColor)}&icon_marker=${encodeURIComponent(iconMarker)}`);
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!item) return null;

  const imageSrc = HOLIDAY_IMAGES[item.image_url] || item.image_url;
  const activities = Array.isArray(item.activities) ? item.activities : JSON.parse(item.activities || "[]");
  const foods = Array.isArray(item.foods) ? item.foods : JSON.parse(item.foods || "[]");

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer border-none outline-none"
        onClick={onClose}
        aria-label="Đóng"
      />

      {/* Modal Content container */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform scale-100">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer border-none outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {/* Banner Image */}
        <div className="relative h-44 sm:h-52 shrink-0 bg-slate-200">
          <img
            src={imageSrc}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Date Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-md">
            <Calendar size={13} />
            <span>{item.date_label}</span>
          </div>
        </div>

        {/* Scrollable details area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Title & History */}
          <div>
            <h2 
              className="text-2xl font-bold text-slate-800 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.name}
            </h2>
            <p className="mt-1 text-xs text-amber-600 font-semibold tracking-wider uppercase">
              Ngày lễ & kỷ niệm Việt Nam
            </p>
            {item.history ? (
              <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100/80">
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Bookmark size={13} className="text-amber-600" />
                  Ý nghĩa & Lịch sử
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {item.history}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
            )}
          </div>

          {/* Core Activities */}
          {activities?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <CheckSquare size={14} className="text-slate-500" />
                Hoạt động tiêu biểu
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {activities.map((act, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-sm text-slate-600"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-550 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-semibold">
                      ✓
                    </span>
                    <span className="leading-snug">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Location Links */}
          {item.locations?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <MapPin size={14} className="text-amber-500" />
                Địa điểm gợi ý
              </h3>
              <div className="grid gap-3">
                {item.locations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => handleDestinationClick(loc)}
                    className="flex flex-col sm:flex-row gap-3 p-3.5 rounded-xl border border-slate-100 bg-white cursor-pointer hover:border-amber-400 hover:bg-amber-50/10 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="sm:w-1/2 shrink-0 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                        📍
                      </span>
                      <div className="flex flex-col min-w-0">
                        <h4 className="font-semibold text-sm text-amber-900 hover:underline truncate">
                          {loc.place?.name || "Địa điểm liên kết"}
                        </h4>
                        <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5 mt-0.5">
                          <MapPin size={10} /> Xem trên bản đồ
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex items-center">
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed truncate" title={loc.address}>
                        {loc.address || "Nhấp để định vị địa điểm này trực tiếp trên bản đồ."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food Suggestions */}
          {foods?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Utensils size={14} className="text-rose-500" />
                Ẩm thực đặc trưng & gợi ý
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {foods.map((food, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-rose-50/20 hover:border-rose-100 transition-all duration-200 flex flex-col justify-between"
                  >
                    <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      {food.name}
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed flex-1">
                      {food.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
