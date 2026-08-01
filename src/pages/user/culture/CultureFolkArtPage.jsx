import { useState, useEffect } from "react";
import { Palette, Loader2 } from "lucide-react";
import { getFolkArts, getFolkArtDetail } from "@/api/user/cultureApi";
import CulturePageHeader from "@/components/user/culture/CulturePageHeader";
import CultureCard from "@/components/user/culture/CultureCard";
import CultureDetailModal from "@/components/user/culture/CultureDetailModal";

function mapDBFolkArtToUI(item) {
  const nameLower = String(item.name || "").toLowerCase();
  const folkType = nameLower.includes("làng") ? "village" : "art";
  const highlights = item.history ? item.history.split(", ") : [];

  return {
    id: item.id,
    title: item.name,
    summary: item.description ? item.description.substring(0, 120) + "..." : "",
    image: item.image_url,
    folkType: folkType,
    province: item.instruments || (folkType === "village" ? "Làng nghề" : "Nghệ thuật"),
    tags: ["Di sản", folkType === "village" ? "Làng nghề" : "Nghệ thuật"],
    detail: {
      description: item.description,
      highlights: highlights,
      province: item.instruments || (folkType === "village" ? "Làng nghề" : "Nghệ thuật")
    }
  };
}

export default function CultureFolkArtPage() {
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

  const artItems = folkArts.filter((i) => i.folkType === "art");
  const villageItems = folkArts.filter((i) => i.folkType === "village");

  const renderGrid = (items) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <CultureCard
          key={item.id}
          item={item}
          badge={item.province}
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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-400 mt-6 mb-6">
                {folkArts.length} di sản · Loại hình nghệ thuật + Làng nghề
              </p>

              {artItems.length > 0 && (
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
              )}

              {villageItems.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-amber-650 rounded-full" />
                    Làng nghề truyền thống
                    <span className="text-sm font-normal text-stone-400">
                      ({villageItems.length})
                    </span>
                  </h2>
                  {renderGrid(villageItems)}
                </section>
              )}
            </>
          )}
        </div>
      </div>

      {selected && (
        <CultureDetailModal
          item={selected}
          badge={selected.province}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
