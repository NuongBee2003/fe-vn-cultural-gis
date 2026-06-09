import { useMemo, useState } from "react";
import { Images } from "lucide-react";
import {
  EXHIBITION_FILTERS,
  EXHIBITION_ITEMS,
  EXHIBITION_SORT_OPTIONS,
} from "@/constants/exhibition";
import ExhibitionFilters from "@/components/user/exhibition/ExhibitionFilters";
import ExhibitionCard from "@/components/user/exhibition/ExhibitionCard";
import ExhibitionLightbox from "@/components/user/exhibition/ExhibitionLightbox";

export default function ExhibitionPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = useMemo(() => {
    let items =
      activeFilter === "all"
        ? [...EXHIBITION_ITEMS]
        : EXHIBITION_ITEMS.filter((item) => item.category === activeFilter);

    if (sortBy === "likes") {
      items = [...items].sort((a, b) => b.likes - a.likes);
    } else {
      items = [...items].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return items;
  }, [activeFilter, sortBy]);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-stone-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
              <Images size={14} />
              Trải nghiệm — Triển lãm ảo
            </p>
            <h1
              className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Không gian văn hóa số
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-500 max-w-2xl">
              Khám phá tác phẩm từ cộng đồng — ảnh minh họa dữ liệu
              mẫu, sẽ kết nối API sau.
            </p>
          </header>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <ExhibitionFilters
              filters={EXHIBITION_FILTERS}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-stone-500">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {EXHIBITION_SORT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-stone-400 mb-4">
            {filteredItems.length} tác phẩm
            {activeFilter !== "all"
              ? ` · ${EXHIBITION_FILTERS.find((f) => f.key === activeFilter)?.label}`
              : ""}
          </p>

          {filteredItems.length === 0 ? (
            <div className="py-20 text-center text-stone-500">
              <p className="text-lg font-medium">Chưa có tác phẩm</p>
              <p className="text-sm mt-1">Thử chọn bộ lọc khác nhé.</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
              {filteredItems.map((item) => (
                <ExhibitionCard
                  key={item.id}
                  item={item}
                  onClick={setSelectedItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <ExhibitionLightbox
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
