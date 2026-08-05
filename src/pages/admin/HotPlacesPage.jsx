import { useState, useMemo } from "react";
import { useHotPlaces, useCategories } from "@/api/user/useLocationQuery";
import DashboardSectionPage from "./DashboardSectionPage";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import Pagination from "@/components/ui/pagination/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-data/table";
import ReviewsManagementModal from "@/components/dashboard/ReviewsManagementModal";
import { 
  Eye, 
  Star, 
  MapPin, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Search, 
  Filter, 
  X,
  FileBarChart2
} from "lucide-react";

const PAGE_SIZES = [5, 10, 25, 50];
const DEFAULT_CATEGORY = { id: null, name: "all" };

export default function HotPlacesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState(DEFAULT_CATEGORY);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedPlaceForReviews, setSelectedPlaceForReviews] = useState(null);

  // ── Load API Data ──
  const { data: rawPlaces = [], isLoading, error } = useHotPlaces();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  // ── Client-side Statistics (Calculated on raw places data) ──
  const stats = useMemo(() => {
    if (!rawPlaces || rawPlaces.length === 0) {
      return { totalPlaces: 0, totalViews: 0, avgViews: 0, topPlace: null };
    }

    const totalPlaces = rawPlaces.length;
    const totalViews = rawPlaces.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const avgViews = Math.round(totalViews / totalPlaces);
    
    // Find place with highest view count
    const topPlace = [...rawPlaces].sort((a, b) => (b.view_count || 0) - (a.view_count || 0))[0];

    return { totalPlaces, totalViews, avgViews, topPlace };
  }, [rawPlaces]);

  // ── Client-side Filtering & Sorting (Default sorting by view_count DESC) ──
  const processedPlaces = useMemo(() => {
    // 1. Filter
    let result = [...rawPlaces];
    
    if (categoryFilter.name !== "all") {
      result = result.filter(p => p.category_id === categoryFilter.id || p.category?.id === categoryFilter.id);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        (p.locations || []).some(l => l.address?.toLowerCase().includes(q))
      );
    }

    // 2. Sort from top view_count down to bottom
    result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));

    return result;
  }, [rawPlaces, categoryFilter, search]);

  // ── Pagination ──
  const totalFiltered = processedPlaces.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedPlaces = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedPlaces.slice(start, start + pageSize);
  }, [processedPlaces, page, pageSize]);

  // ── Handlers ──
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleCategorySelect = (cat) => {
    setCategoryFilter(cat === "all" ? DEFAULT_CATEGORY : { id: cat.id, name: cat.name });
    setIsFilterOpen(false);
    setPage(1);
  };

  const handleClearCategory = (e) => {
    e.stopPropagation();
    setCategoryFilter(DEFAULT_CATEGORY);
    setPage(1);
  };

  const handleViewReviews = (place) => {
    setSelectedPlaceForReviews(place);
    setShowReviews(true);
  };

  const handleCloseReviews = () => {
    setShowReviews(false);
    setSelectedPlaceForReviews(null);
  };

  return (
    <DashboardSectionPage
      title="Báo cáo địa điểm nổi bật"
      description="Thống kê lưu lượng truy cập, lượt xem của các địa điểm di sản văn hóa hot nhất hệ thống."
    >
      {/* ── Quick Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total hot places */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Tổng địa điểm nổi bật</p>
            <h2 className="text-xl font-bold text-gray-800 mt-0.5">
              {isLoading ? "..." : stats.totalPlaces}
            </h2>
          </div>
        </div>

        {/* Total views */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Tổng lượt xem</p>
            <h2 className="text-xl font-bold text-gray-850 mt-0.5">
              {isLoading ? "..." : stats.totalViews.toLocaleString("vi-VN")}
            </h2>
          </div>
        </div>

        {/* Avg views */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Lượt xem trung bình</p>
            <h2 className="text-xl font-bold text-emerald-700 mt-0.5">
              {isLoading ? "..." : stats.avgViews.toLocaleString("vi-VN")}
            </h2>
          </div>
        </div>

        {/* Top Place */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex items-center gap-4 col-span-1">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 shrink-0">
            <Award size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Xem nhiều nhất</p>
            <h2 className="text-sm font-bold text-slate-800 mt-1 truncate" title={stats.topPlace?.name}>
              {isLoading ? "..." : (stats.topPlace?.name || "Chưa có")}
            </h2>
            {stats.topPlace && (
              <p className="text-[10px] text-rose-600 font-bold mt-0.5">
                🔥 {stats.topPlace.view_count} lượt xem
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm, địa chỉ..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-400 transition bg-slate-50/50"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-2.5 text-[10px] text-gray-400 hover:text-gray-600 font-bold bg-slate-100 px-1 py-0.5 rounded"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-9 rounded-xl border px-3 text-xs flex items-center gap-2 min-w-[140px] justify-between transition-colors bg-white
                ${isFilterOpen ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200 hover:border-amber-300"}`}
            >
              <span className="flex items-center gap-2">
                <Filter size={13} className="text-slate-400" />
                <span className="truncate max-w-[100px]">
                  {categoryFilter.name === "all" ? "Tất cả danh mục" : categoryFilter.name}
                </span>
              </span>
              {categoryFilter.name !== "all" && (
                <X
                  size={12}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                  onClick={handleClearCategory}
                />
              )}
            </button>

            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto">
                {isLoadingCategories ? (
                  <div className="p-3 text-xs text-muted-foreground text-center">
                    Đang tải danh mục...
                  </div>
                ) : (
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => handleCategorySelect("all")}
                      className={`w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2
                        ${categoryFilter.name === "all" ? "bg-amber-50/50 font-bold text-amber-700" : "text-slate-700"}`}
                    >
                      Tất cả danh mục
                    </button>

                    {categories.map((cat) => {
                      const isSelected = categoryFilter.id === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategorySelect(cat)}
                          className={`w-full px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors flex items-center gap-2
                            ${isSelected ? "bg-amber-50/50 font-bold text-amber-700" : "text-slate-600"}`}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color || "#B8922E" }}
                          />
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page Size */}
        <label className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span>Hiển thị</span>
          <select
            className="h-8 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none focus:border-amber-400"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} dòng
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ── Table Layout ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
              <p className="text-xs font-semibold">Đang tổng hợp dữ liệu địa điểm hot...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-red-500 text-xs">Không thể tải dữ liệu báo cáo: {error.message}</p>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader className="bg-slate-50/70 border-b border-slate-100">
              <TableRow>
                <TableHead className="w-16 text-center">Hạng</TableHead>
                <TableHead>Địa điểm di sản</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="w-40 text-center">Tổng lượt xem</TableHead>
                <TableHead className="w-44">Đánh giá chung</TableHead>
                <TableHead>Địa chỉ chi nhánh</TableHead>
                <TableHead className="text-right w-36">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlaces.length > 0 ? (
                paginatedPlaces.map((place, index) => {
                  const actualRank = (page - 1) * pageSize + index + 1;
                  const ratingAvg = place.rating_avg !== null && place.rating_avg !== undefined ? Number(place.rating_avg) : 0;
                  const reviewCount = place.review_count ? Number(place.review_count) : 0;
                  const addresses = (place.locations || []).map(l => l.address).filter(Boolean);

                  // Rank Badge color style
                  let rankStyle = "bg-slate-100 text-slate-700";
                  if (actualRank === 1) rankStyle = "bg-amber-100 text-amber-800 font-extrabold border border-amber-200 ring-2 ring-amber-50";
                  else if (actualRank === 2) rankStyle = "bg-slate-200 text-slate-800 font-bold border border-slate-350";
                  else if (actualRank === 3) rankStyle = "bg-orange-100 text-orange-800 font-bold border border-orange-200";

                  return (
                    <TableRow key={place.id} className="hover:bg-slate-50/40 border-b border-slate-100 last:border-0">
                      {/* Rank badge column */}
                      <TableCell className="text-center font-bold">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono ${rankStyle}`}>
                          {actualRank}
                        </span>
                      </TableCell>

                      {/* Name & description */}
                      <TableCell className="max-w-[240px]">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-800 text-xs line-clamp-1">{place.name}</span>
                            {(place.is_featured === 1 || place.is_featured === '1' || place.is_featured === true) && (
                              <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-700 ring-1 ring-amber-200">
                                ⭐ Gói mua
                              </span>
                            )}
                          </div>
                          {place.description && (
                            <span className="text-[10.5px] text-slate-400 line-clamp-1" title={place.description}>
                              {place.description}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span 
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: place.category?.color || "#6b7280" }}
                        >
                          {place.category?.name || "Khác"}
                        </span>
                      </TableCell>

                      {/* View count */}
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/50 text-blue-700 rounded-full font-bold text-xs">
                          <Eye size={12} className="shrink-0" />
                          <span>{(place.view_count || 0).toLocaleString("vi-VN")}</span>
                        </div>
                      </TableCell>

                      {/* Stars & rating */}
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="fill-amber-400 text-amber-400 shrink-0" size={13} />
                            <span className="font-bold text-slate-800">
                              {ratingAvg > 0 ? ratingAvg.toFixed(1) : "0.0"}
                            </span>
                            <span className="text-[10px] text-slate-400">/ 5</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {reviewCount > 0 ? `${reviewCount} lượt nhận xét` : "Chưa có nhận xét"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Addresses of locations */}
                      <TableCell className="max-w-[280px] text-[11px] text-slate-500">
                        <div className="flex flex-col gap-1">
                          {addresses.length > 0 ? (
                            addresses.map((addr, idx) => (
                              <span key={idx} className="line-clamp-1 flex items-center gap-1" title={addr}>
                                <MapPin size={11} className="text-slate-400 shrink-0" />
                                <span className="truncate">{addr}</span>
                              </span>
                            ))
                          ) : (
                            <span className="italic text-slate-400">Chưa cập nhật chi nhánh</span>
                          )}
                        </div>
                      </TableCell>

                      {/* View Reviews list button */}
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleViewReviews(place)}
                          className="text-xs h-8 px-2.5 border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1 ml-auto"
                        >
                          <MessageSquare size={12} />
                          <span>Xem nhận xét</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    Không tìm thấy địa điểm nổi bật nào phù hợp bộ lọc.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter className="bg-slate-50/50">
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 font-medium">
                    <div>
                      {search ? (
                        <>Hiển thị kết quả tìm kiếm cho "{search}"</>
                      ) : (
                        <>
                          Đang hiển thị <span className="font-semibold text-slate-800">{processedPlaces.length}</span> trên tổng số <span className="font-semibold text-slate-800">{rawPlaces.length}</span> địa điểm nổi bật
                        </>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* ── Reviews Management Modal (Exposes same admin dashboard reviews modal) ── */}
      {selectedPlaceForReviews && (
        <ReviewsManagementModal
          isOpen={showReviews}
          onClose={handleCloseReviews}
          placeId={selectedPlaceForReviews.id}
          placeName={selectedPlaceForReviews.name}
          locationId={null}
        />
      )}
    </DashboardSectionPage>
  );
}
