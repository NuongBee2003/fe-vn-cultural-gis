import { useMemo, useState, useEffect } from "react";
import { HeartHandshake, Loader2 } from "lucide-react";
import {
  CUSTOM_GROUP_FILTERS,
  CUSTOM_GROUP_LABELS,
} from "@/constants/cultureCustoms";
import { getCustoms, getCustomDetail } from "@/api/cultureApi";
import CulturePageHeader from "@/components/user/culture/CulturePageHeader";
import CultureFilters from "@/components/user/culture/CultureFilters";
import CultureCard from "@/components/user/culture/CultureCard";
import CultureDetailModal from "@/components/user/culture/CultureDetailModal";

function mapDBCustomToUI(item) {
  let group = "belief";
  const nameLower = String(item.name || "").toLowerCase();
  const descLower = String(item.description || "").toLowerCase();
  
  if (nameLower.includes("hỏi") || nameLower.includes("rước dâu") || nameLower.includes("cưới") || descLower.includes("đám cưới")) {
    group = "wedding";
  } else if (nameLower.includes("tang") || descLower.includes("tang lễ")) {
    group = "funeral";
  } else if (nameLower.includes("hái lộc") || nameLower.includes("giỗ tổ") || nameLower.includes("tết") || nameLower.includes("cỗ")) {
    group = "festival";
  } else if (nameLower.includes("chào hỏi") || nameLower.includes("giỗ")) {
    group = "daily";
  }

  const steps = item.rituals ? item.rituals.split(" -> ") : [];

  return {
    id: item.id,
    title: item.name,
    summary: item.description ? item.description.substring(0, 120) + "..." : "",
    image: item.image_url,
    group: group,
    province: item.time_period || "Toàn quốc",
    tags: ["Phong tục", "Lễ nghi"],
    detail: {
      description: item.description,
      highlights: [item.time_period || "Toàn quốc"],
      steps: steps
    }
  };
}

export default function CultureCustomsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [customs, setCustoms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getCustoms();
        setCustoms(data.map(mapDBCustomToUI));
      } catch (err) {
        console.error("Lỗi khi tải phong tục:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCardClick = async (item) => {
    try {
      const detail = await getCustomDetail(item.id);
      const steps = detail.rituals ? detail.rituals.split(" -> ") : [];

      const mappedSelected = {
        ...item,
        detail: {
          ...item.detail,
          description: detail.description,
          steps: steps
        }
      };

      setSelected(mappedSelected);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết phong tục:", err);
      setSelected(item);
    }
  };

  const filtered = useMemo(() => {
    if (activeFilter === "all") return customs;
    return customs.filter((item) => item.group === activeFilter);
  }, [activeFilter, customs]);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-stone-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <CulturePageHeader
            icon={HeartHandshake}
            eyebrow="Văn hóa — Phong tục tập quán"
            title="Nghi thức & phong tục Việt"
            description="Tìm hiểu về các nghi thức tế lễ, phong tục tập quán lâu đời của Việt Nam."
          />

          <CultureFilters
            filters={CUSTOM_GROUP_FILTERS}
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
          badge={CUSTOM_GROUP_LABELS[selected.group]}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
