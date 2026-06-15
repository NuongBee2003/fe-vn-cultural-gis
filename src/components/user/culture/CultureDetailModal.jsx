import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, MapPin, ListOrdered, Store, Loader2 } from "lucide-react";

export default function CultureDetailModal({
  item,
  onClose,
  badge,
  extraTags = [],
}) {
  const navigate = useNavigate();
  const [geocodingId, setGeocodingId] = useState(null);

  const handleRestaurantClick = async (res, index) => {
    if (geocodingId !== null) return; // đang xử lý

    // Nếu đã có tọa độ → navigate luôn
    if (res.lat && res.lng) {
      onClose();
      navigate(`/?lat=${res.lat}&lng=${res.lng}&location_id=${res.id || ""}&place_id=${res.placeId || ""}&name=${encodeURIComponent(res.name)}&category_name=${encodeURIComponent(res.categoryName || "")}&marker_color=${encodeURIComponent(res.markerColor || "")}&icon_marker=${encodeURIComponent(res.iconMarker || "")}`);
      return;
    }

    // Chưa có tọa độ → thử geocode qua Nominatim với cơ chế fallback thông minh
    setGeocodingId(index);
    try {
      const address = res.address || "";
      
      // Tạo danh sách các query tìm kiếm từ chi tiết đến rút gọn
      const queries = [address];
      
      // 1. Bỏ số nhà/số hẻm ở đầu (ví dụ: "78 Tôn Thất Tùng" -> "Tôn Thất Tùng")
      const addressWithoutNumber = address.replace(/^([Hh]ẻm\s+)?\d+[a-zA-Z]?(\/\d+)*(-[0-9a-zA-Z]+)?\s+/, "");
      if (addressWithoutNumber !== address) {
        queries.push(addressWithoutNumber);
      }
      
      // 2. Tên đường + Quận + Tỉnh/TP (bỏ số nhà và tên phường để Nominatim dễ nhận biết hơn)
      const parts = address.split(",").map(p => p.trim());
      if (parts.length >= 3) {
        const streetPart = parts[0].replace(/^([Hh]ẻm\s+)?\d+[a-zA-Z]?(\/\d+)*(-[0-9a-zA-Z]+)?\s+/, "");
        const districtPart = parts.find(p => p.toLowerCase().includes("quận") || p.toLowerCase().includes("q."));
        const cityPart = parts.find(p => p.toLowerCase().includes("hồ chí minh") || p.toLowerCase().includes("tp") || p.toLowerCase().includes("hà nội") || p.toLowerCase().includes("đà nẵng") || p.toLowerCase().includes("thành phố"));
        
        if (streetPart && districtPart && cityPart) {
          queries.push(`${streetPart}, ${districtPart}, ${cityPart}`);
        } else if (streetPart && districtPart) {
          queries.push(`${streetPart}, ${districtPart}, Vietnam`);
        }
      }
      
      // 3. Tên đường + Tỉnh/TP
      if (parts.length >= 2) {
        const streetPart = parts[0].replace(/^([Hh]ẻm\s+)?\d+[a-zA-Z]?(\/\d+)*(-[0-9a-zA-Z]+)?\s+/, "");
        const cityPart = parts[parts.length - 1];
        queries.push(`${streetPart}, ${cityPart}`);
      }

      // Loại bỏ trùng lặp và rỗng
      const uniqueQueries = Array.from(new Set(queries.filter(Boolean)));
      
      let lat = null;
      let lon = null;

      // Thử gọi API Nominatim lần lượt cho các query
      for (const q of uniqueQueries) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
          const resp = await fetch(url, { headers: { "Accept-Language": "vi" } });
          const results = await resp.json();
          if (results && results.length > 0) {
            lat = results[0].lat;
            lon = results[0].lon;
            break; // Tìm thấy tọa độ → thoát vòng lặp
          }
        } catch (e) {
          // Bỏ qua lỗi kết nối của query này, thử query tiếp theo
        }
      }

      if (lat && lon) {
        onClose();
        navigate(`/?lat=${lat}&lng=${lon}&location_id=${res.id || ""}&place_id=${res.placeId || ""}&name=${encodeURIComponent(res.name)}&address=${encodeURIComponent(res.address || "")}&category_name=${encodeURIComponent(res.categoryName || "")}&marker_color=${encodeURIComponent(res.markerColor || "")}&icon_marker=${encodeURIComponent(res.iconMarker || "")}`);
      } else {
        // Hoàn toàn không geocode được → navigate với tên để search
        onClose();
        navigate(`/?q=${encodeURIComponent(res.name)}`);
      }
    } catch {
      // Lỗi mạng hoặc lỗi khác → navigate với tên để search
      onClose();
      navigate(`/?q=${encodeURIComponent(res.name)}`);
    } finally {
      setGeocodingId(null);
    }
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

  const { detail } = item;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/75 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-label="Đóng"
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        <div className="h-48 sm:h-56 shrink-0 bg-stone-900">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {badge && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              {badge}
            </span>
          )}

          <h2
            className="text-2xl font-semibold text-stone-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.title}
          </h2>

          <p className="mt-1 text-sm text-stone-500">{item.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.province && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-stone-100 text-stone-600 border border-stone-200">
                <MapPin size={12} />
                {item.province}
              </span>
            )}
            {extraTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-stone-100 text-stone-600 border border-stone-200"
              >
                {tag}
              </span>
            ))}
            {item.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-amber-50 text-amber-800 border border-amber-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-stone-600">
            {detail.description}
          </p>

          {detail.highlights?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Điểm nổi bật
              </h3>
              <ul className="space-y-1.5">
                {detail.highlights.map((point) => (
                  <li
                    key={point}
                    className="text-sm text-stone-600 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.ingredients?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Nguyên liệu chính
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {detail.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-2.5 py-1 rounded-lg text-xs bg-stone-50 border border-stone-200 text-stone-700"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {detail.steps?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                <ListOrdered size={14} />
                Các bước / nghi thức
              </h3>
              <ol className="space-y-2">
                {detail.steps.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 text-sm text-stone-600"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {detail.restaurants?.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                <Store size={14} className="text-amber-600" />
                Địa chỉ thưởng thức gợi ý
              </h3>
              <div className="space-y-2.5">
                {detail.restaurants.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => handleRestaurantClick(res, i)}
                    className={`p-3.5 rounded-xl border border-stone-100 bg-stone-50/50 transition-colors flex justify-between items-start gap-3 cursor-pointer hover:bg-amber-50/30 hover:border-amber-200 ${
                      geocodingId === i ? "opacity-60 pointer-events-none" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-stone-800 leading-snug flex items-center gap-2">
                        {res.name}
                        {geocodingId === i && (
                          <Loader2 size={13} className="animate-spin text-amber-500 shrink-0" />
                        )}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 flex items-start gap-1">
                        <MapPin size={11} className="shrink-0 mt-0.5 text-stone-400" />
                        <span className="leading-relaxed">{res.address}</span>
                      </p>
                    </div>
                    {res.price && (
                      <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-100 rounded-md">
                        {res.price}
                      </span>
                    )}
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
