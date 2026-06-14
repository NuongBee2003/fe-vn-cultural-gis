import { useMemo, useState, useEffect } from "react";
import { Palette, Loader2 } from "lucide-react";
import {
  FOLK_TYPE_FILTERS,
  FOLK_CATEGORY_LABELS,
} from "@/constants/cultureFolkArt";
import { getFolkArts, getFolkArtDetail } from "@/api/cultureApi";
import CulturePageHeader from "@/components/user/culture/CulturePageHeader";
import CultureFilters from "@/components/user/culture/CultureFilters";
import CultureCard from "@/components/user/culture/CultureCard";
import CultureDetailModal from "@/components/user/culture/CultureDetailModal";

const FOLK_TYPE_LABELS = {
  art: "Loại hình",
  village: "Làng nghề",
};

function mapDBFolkArtToUI(item) {
  let category = "craft";
  const nameLower = String(item.name || "").toLowerCase();
  
  if (nameLower.includes("tranh")) {
    category = "painting";
  } else if (nameLower.includes("múa")) {
    category = "dance";
  } else if (nameLower.includes("chèo")) {
    category = "theater";
  } else if (nameLower.includes("ca trù") || nameLower.includes("xẩm") || nameLower.includes("hát")) {
    category = "music";
  } else if (nameLower.includes("chầu văn") || nameLower.includes("hầu đồng")) {
    category = "ritual";
  }

  const folkType = nameLower.includes("làng") ? "village" : "art";
  const highlights = item.history ? item.history.split(", ") : [];

  return {
    id: item.id,
    title: item.name,
    summary: item.description ? item.description.substring(0, 120) + "..." : "",
    image: item.image_url,
    folkType: folkType,
    category: category,
    province: item.instruments || "Toàn quốc",
    tags: ["Di sản", folkType === "village" ? "Làng nghề" : "Nghệ thuật"],
    detail: {
      description: item.description,
      highlights: highlights,
      province: item.instruments || "Toàn quốc"
    }
  };
}

export default function CultureFolkArtPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [folkArts, setFolkArts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getFolkArts();
        setFolkArts(data.map(mapDBFolkArtToUI));
      } catch (err) {
        console.error("Lỗi khi tải nghệ thuật dân gian:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCardClick = async (item) => {
    try {
      const detail = await getFolkArtDetail(item.id);
      const highlights = detail.history ? detail.history.split(", ") : [];

      const mappedSelected = {
        ...item,
        detail: {
          ...item.detail,
          description: detail.description,
          highlights: highlights
        }
      };

      setSelected(mappedSelected);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết nghệ thuật dân gian:", err);
      setSelected(item);
    }
  };

  const filtered = useMemo(() => {
    if (activeFilter === "all") return folkArts;
    return folkArts.filter((item) => item.folkType === activeFilter);
  }, [activeFilter, folkArts]);

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
          onClick={handleCardClick}
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
            description="Tìm hiểu các di sản văn hóa phi vật thể nghệ thuật truyền thống và làng nghề ngàn năm tuổi."
          />

          <CultureFilters
            filters={FOLK_TYPE_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-400 mt-4 mb-6">
                {filtered.length} mục
                {activeFilter !== "all"
                  ? ` · ${FOLK_TYPE_LABELS[activeFilter]}`
                  : " · Loại hình nghệ thuật + Làng nghề"}
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
            </>
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
