import { useState, useEffect } from "react";
import { HeartHandshake, Loader2 } from "lucide-react";
import { getCustoms, getCustomDetail } from "@/api/user/cultureApi";
import CulturePageHeader from "@/components/user/culture/CulturePageHeader";
import CultureCard from "@/components/user/culture/CultureCard";
import CultureDetailModal from "@/components/user/culture/CultureDetailModal";

function mapDBCustomToUI(item) {
  const steps = item.rituals ? item.rituals.split(" -> ") : [];

  return {
    id: item.id,
    title: item.name,
    summary: item.description ? item.description.substring(0, 120) + "..." : "",
    image: item.image_url,
    timePeriod: item.time_period || "Toàn quốc",
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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-400 mt-6 mb-5">
                {customs.length} nghi thức
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {customs.map((item) => (
                  <CultureCard
                    key={item.id}
                    item={item}
                    badge={item.timePeriod}
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
          badge={selected.timePeriod}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
