import { useMemo, useState } from "react";
import { HeartHandshake } from "lucide-react";
import {
  CULTURE_CUSTOMS_ITEMS,
  CUSTOM_GROUP_FILTERS,
  CUSTOM_GROUP_LABELS,
} from "@/constants/cultureCustoms";
import CulturePageHeader from "@/components/user/culture/CulturePageHeader";
import CultureFilters from "@/components/user/culture/CultureFilters";
import CultureCard from "@/components/user/culture/CultureCard";
import CultureDetailModal from "@/components/user/culture/CultureDetailModal";

export default function CultureCustomsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return CULTURE_CUSTOMS_ITEMS;
    return CULTURE_CUSTOMS_ITEMS.filter((item) => item.group === activeFilter);
  }, [activeFilter]);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-stone-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <CulturePageHeader
            icon={HeartHandshake}
            eyebrow="Văn hóa — Phong tục tập quán"
            title="Nghi thức & phong tục Việt"
            description="10 nghi thức theo 5 nhóm dịp — bổ sung cho Lịch lễ và Hành trình lịch sử."
          />

          <CultureFilters
            filters={CUSTOM_GROUP_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <p className="text-xs text-stone-400 mt-4 mb-5">
            {filtered.length} nghi thức
            {activeFilter !== "all"
              ? ` · ${CUSTOM_GROUP_LABELS[activeFilter]}`
              : ""}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <CultureCard
                key={item.id}
                item={item}
                badge={CUSTOM_GROUP_LABELS[item.group]}
                onClick={setSelected}
              />
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <CultureDetailModal
          item={selected}
          badge={CUSTOM_GROUP_LABELS[selected.group]}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
