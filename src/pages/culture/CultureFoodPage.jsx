import { useMemo, useState, useEffect } from "react";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import {
  FOOD_REGION_FILTERS,
  FOOD_REGION_LABELS,
} from "@/constants/cultureFood";
import { getCuisines, getCuisineDetail } from "@/api/cultureApi";
import { getRegionByProvince } from "@/constants/provinces";
import CulturePageHeader from "@/components/user/culture/CulturePageHeader";
import CultureFilters from "@/components/user/culture/CultureFilters";
import CultureCard from "@/components/user/culture/CultureCard";
import CultureDetailModal from "@/components/user/culture/CultureDetailModal";

function mapDBCuisineToUI(item) {
  // Parse origin thành danh sách tỉnh thành
  const provinces = item.origin 
    ? item.origin.split(",").map(s => s.trim()).filter(Boolean) 
    : [];

  // Ánh xạ các tỉnh thành sang vùng miền tương ứng
  const regionsSet = new Set();
  provinces.forEach(p => {
    regionsSet.add(getRegionByProvince(p));
  });
  
  // Nếu không có tỉnh nào hoặc không map được vùng nào, mặc định là 'south'
  if (regionsSet.size === 0) {
    regionsSet.add("south");
  }
  
  const regions = Array.from(regionsSet);
  const ingredients = item.ingredients ? item.ingredients.split(", ") : [];

  return {
    id: item.id,
    title: item.name,
    summary: item.description ? item.description.substring(0, 120) + "..." : "",
    image: item.image_url,
    regions: regions,
    region: regions[0], // Giữ lại trường region đơn lẻ để đảm bảo tương thích ngược nếu cần
    provinces: provinces,
    province: item.origin || "Toàn quốc",
    tags: ["Ẩm thực", "Đặc sản"],
    detail: {
      description: item.description,
      highlights: ingredients,
      ingredients: ingredients,
      restaurants: []
    }
  };
}

export default function CultureFoodPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selected, setSelected] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getCuisines();
        setCuisines(data.map(mapDBCuisineToUI));
      } catch (err) {
        console.error("Lỗi khi tải ẩm thực:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Lấy danh sách các tỉnh thành thực tế đang có món ăn để hiển thị ở bộ lọc
  const availableProvinces = useMemo(() => {
    const provSet = new Set();
    cuisines.forEach(item => {
      item.provinces.forEach(p => provSet.add(p));
    });
    return Array.from(provSet).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [cuisines]);

  const handleCardClick = async (item) => {
    try {
      const detail = await getCuisineDetail(item.id);
      
      const restaurants = [];
      if (detail.cuisine_places) {
        detail.cuisine_places.forEach(cp => {
          const place = cp.place;
          const locations = place?.locations || [];
          const price = cp.notes ? cp.notes.replace("Giá trung bình: ", "").replace("Mức giá gợi ý: ", "") : "";
          
          if (locations.length > 0) {
            locations.forEach(loc => {
              restaurants.push({
                id: loc.id,
                placeId: place.id,
                lat: loc.lat ? Number(loc.lat) : null,
                lng: loc.lng ? Number(loc.lng) : null,
                name: place.name || "",
                address: loc.address || place.description || "",
                price: price,
                categoryName: place.category?.name || "Quán ăn",
                markerColor: place.category?.color || "#f97316",
                iconMarker: place.category?.icon_marker || ""
              });
            });
          } else {
            // Fallback nếu place không có location nào
            restaurants.push({
              id: null,
              placeId: place?.id || null,
              lat: null,
              lng: null,
              name: place?.name || "",
              address: place?.description || "",
              price: price,
              categoryName: place?.category?.name || "Quán ăn",
              markerColor: place?.category?.color || "#f97316",
              iconMarker: place?.category?.icon_marker || ""
            });
          }
        });
      }

      const mappedSelected = {
        ...item,
        detail: {
          ...item.detail,
          restaurants: restaurants
        }
      };

      setSelected(mappedSelected);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết món ăn:", err);
      setSelected(item);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setSelectedProvince("all"); // Reset lọc theo tỉnh khi đổi tab vùng miền
  };

  const handleProvinceChange = (e) => {
    const prov = e.target.value;
    setSelectedProvince(prov);
    if (prov !== "all") {
      setActiveFilter("all"); // Reset lọc vùng miền khi chọn tỉnh thành cụ thể
    }
  };

  const filtered = useMemo(() => {
    let result = cuisines;

    // Lọc theo Vùng miền
    if (activeFilter !== "all") {
      result = result.filter((item) => item.regions.includes(activeFilter));
    }

    // Lọc theo Tỉnh thành
    if (selectedProvince !== "all") {
      result = result.filter((item) => item.provinces.includes(selectedProvince));
    }

    return result;
  }, [activeFilter, selectedProvince, cuisines]);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-stone-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <CulturePageHeader
            icon={UtensilsCrossed}
            eyebrow="Văn hóa — Ẩm thực"
            title="Tinh hoa ẩm thực Việt Nam"
            description="Tìm kiếm và khám phá các món ăn đặc trưng bốn miền từ hệ thống bản đồ."
          />

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-stone-200 pb-5">
            <CultureFilters
              filters={FOOD_REGION_FILTERS}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />

            {/* Dropdown lọc theo Tỉnh thành */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs min-w-[240px] md:self-end">
              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">Lọc theo Tỉnh/TP:</span>
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full bg-transparent text-sm font-semibold outline-none text-stone-700 cursor-pointer"
              >
                <option value="all">Tất cả tỉnh thành</option>
                {availableProvinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-400 mt-4 mb-5">
                {filtered.length} món
                {selectedProvince !== "all"
                  ? ` · Tỉnh: ${selectedProvince}`
                  : activeFilter !== "all"
                  ? ` · ${FOOD_REGION_LABELS[activeFilter]}`
                  : ""}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((item) => (
                  <CultureCard
                    key={item.id}
                    item={item}
                    badge={item.provinces.length > 0 ? item.provinces.slice(0, 2).join(", ") + (item.provinces.length > 2 ? "..." : "") : FOOD_REGION_LABELS[item.region]}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selected && (
        <CultureDetailModal
          item={selected}
          badge={selected.provinces.length > 0 ? selected.provinces.join(", ") : FOOD_REGION_LABELS[selected.region]}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
