import { useMemo, useState, useEffect } from "react";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import {
  FOOD_REGION_FILTERS,
  FOOD_REGION_LABELS,
} from "@/constants/cultureFood";
import { getCuisines, getCuisineDetail } from "@/api/cultureApi";
import CulturePageHeader from "@/components/user/culture/CulturePageHeader";
import CultureFilters from "@/components/user/culture/CultureFilters";
import CultureCard from "@/components/user/culture/CultureCard";
import CultureDetailModal from "@/components/user/culture/CultureDetailModal";

function mapDBCuisineToUI(item) {
  let region = "south";
  const originLower = String(item.origin || "").toLowerCase();
  if (
    originLower.includes("hà nội") || 
    originLower.includes("bắc") || 
    originLower.includes("ninh bình") || 
    originLower.includes("phú thọ") ||
    originLower.includes("quốc")
  ) {
    region = "north";
  } else if (
    originLower.includes("huế") || 
    originLower.includes("quảng") || 
    originLower.includes("đà nẵng")
  ) {
    region = "central";
  } else if (
    originLower.includes("tây nguyên") || 
    originLower.includes("đắk") || 
    originLower.includes("gia lai") || 
    originLower.includes("kon tum") || 
    originLower.includes("lâm đồng")
  ) {
    region = "highland";
  }

  const ingredients = item.ingredients ? item.ingredients.split(", ") : [];

  return {
    id: item.id,
    title: item.name,
    summary: item.description ? item.description.substring(0, 120) + "..." : "",
    image: item.image_url,
    region: region,
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

  const handleCardClick = async (item) => {
    try {
      const detail = await getCuisineDetail(item.id);
      const restaurants = detail.cuisine_places ? detail.cuisine_places.map(cp => ({
        name: cp.place?.name || "",
        address: cp.place?.locations?.[0]?.address || cp.place?.description || "",
        price: cp.notes ? cp.notes.replace("Giá trung bình: ", "").replace("Mức giá gợi ý: ", "") : ""
      })) : [];

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

  const filtered = useMemo(() => {
    if (activeFilter === "all") return cuisines;
    return cuisines.filter((item) => item.region === activeFilter);
  }, [activeFilter, cuisines]);

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

          <CultureFilters
            filters={FOOD_REGION_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-400 mt-4 mb-5">
                {filtered.length} món
                {activeFilter !== "all"
                  ? ` · ${FOOD_REGION_LABELS[activeFilter]}`
                  : ""}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((item) => (
                  <CultureCard
                    key={item.id}
                    item={item}
                    badge={FOOD_REGION_LABELS[item.region]}
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
          badge={FOOD_REGION_LABELS[selected.region]}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
