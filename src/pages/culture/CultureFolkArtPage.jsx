import { useMemo, useState } from "react";
import { Palette } from "lucide-react";
import {
  CULTURE_FOLK_ART_ITEMS,
  FOLK_TYPE_FILTERS,
  FOLK_CATEGORY_LABELS,
} from "@/constants/cultureFolkArt";
import CulturePageHeader from "@/components/user/culture/CulturePageHeader";
import CultureFilters from "@/components/user/culture/CultureFilters";
import CultureCard from "@/components/user/culture/CultureCard";
import CultureDetailModal from "@/components/user/culture/CultureDetailModal";

const FOLK_TYPE_LABELS = {
  art: "Loại hình",
  village: "Làng nghề",
};

export default function CultureFolkArtPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return CULTURE_FOLK_ART_ITEMS;
    return CULTURE_FOLK_ART_ITEMS.filter(
      (item) => item.folkType === activeFilter,
    );
  }, [activeFilter]);

  const artItems = filtered.filter((i) => i.folkType === "art");
  const villageItems = filtered.filter((i) => i.folkType === "village");

  const showSections = activeFilter === "all";

  const renderGrid = (items) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <CultureCard
          key={item.id}
          item={item}
          badge={
            item.folkType === "village"
              ? "Làng nghề"
              : FOLK_CATEGORY_LABELS[item.category]
          }
          onClick={setSelected}
        />
      ))}
    </div>
  );

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-stone-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <CulturePageHeader
            icon={Palette}
            eyebrow="Văn hóa — Nghệ thuật dân gian"
            title="Di sản nghệ thuật & làng nghề"
            description="8 loại hình nghệ thuật dân gian và 3 làng nghề tiêu biểu — dữ liệu minh họa."
          />

          <CultureFilters
            filters={FOLK_TYPE_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <p className="text-xs text-stone-400 mt-4 mb-6">
            {filtered.length} mục
            {activeFilter !== "all"
              ? ` · ${FOLK_TYPE_LABELS[activeFilter]}`
              : " · 8 loại hình + 3 làng nghề"}
          </p>

          {showSections ? (
            <>
              <section className="mb-10">
                <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded-full" />
                  Loại hình nghệ thuật
                  <span className="text-sm font-normal text-stone-400">
                    ({artItems.length})
                  </span>
                </h2>
                {renderGrid(artItems)}
              </section>

              <section>
                <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-600 rounded-full" />
                  Làng nghề truyền thống
                  <span className="text-sm font-normal text-stone-400">
                    ({villageItems.length})
                  </span>
                </h2>
                {renderGrid(villageItems)}
              </section>
            </>
          ) : (
            renderGrid(filtered)
          )}
        </div>
      </div>

      {selected && (
        <CultureDetailModal
          item={selected}
          badge={
            selected.folkType === "village"
              ? "Làng nghề"
              : FOLK_CATEGORY_LABELS[selected.category]
          }
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
