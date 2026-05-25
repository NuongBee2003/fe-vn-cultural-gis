import { useMemo, useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import {
  CULTURE_FOOD_ITEMS,
  FOOD_REGION_FILTERS,
  FOOD_REGION_LABELS,
} from "@/constants/cultureFood";
import CulturePageHeader from "@/components/user/culture/CulturePageHeader";
import CultureFilters from "@/components/user/culture/CultureFilters";
import CultureCard from "@/components/user/culture/CultureCard";
import CultureDetailModal from "@/components/user/culture/CultureDetailModal";

export default function CultureFoodPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return CULTURE_FOOD_ITEMS;
    return CULTURE_FOOD_ITEMS.filter((item) => item.region === activeFilter);
  }, [activeFilter]);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-stone-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <CulturePageHeader
            icon={UtensilsCrossed}
            eyebrow="Văn hóa — Ẩm thực"
            title="Tinh hoa ẩm thực Việt Nam"
            description="12 món đặc trưng bốn miền — dữ liệu minh họa, sẽ kết nối bản đồ quán ăn sau."
          />

          <CultureFilters
            filters={FOOD_REGION_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

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
                onClick={setSelected}
              />
            ))}
          </div>
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
