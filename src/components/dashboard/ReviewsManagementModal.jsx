import { useState, useMemo, useEffect } from "react";
import { X, Star, Trash2, Loader2, UserCircle2, AlertTriangle, Search, ArrowUpDown, RefreshCw, MessageSquare } from "lucide-react";
import { usePlaceReviews } from "@/api/useLocationQuery";
import { useDeleteReview } from "@/api/locationAdminApi";

// ── Helpers ──────────────────────────────────────────────────────────────────

function StarRow({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= value ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

// ── ConfirmDelete Popover ─────────────────────────────────────────────────────

function ConfirmPopover({ onConfirm, onCancel, isPending }) {
  return (
    <div className="absolute right-0 top-8 z-20 w-56 rounded-xl border border-red-100 bg-white p-3.5 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-100">
      <div className="flex items-start gap-2 mb-3">
        <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
        <p className="text-[12px] text-gray-700 leading-snug font-medium">
          Xóa đánh giá này? Hành động này không thể khôi phục.
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-red-600 transition disabled:opacity-60"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Xóa ngay
        </button>
      </div>
    </div>
  );
}

// ── ReviewRow Component ────────────────────────────────────────────────────────

function ReviewRow({ review, placeId }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: deleteReview, isPending } = useDeleteReview();

  const handleDelete = () => {
    deleteReview(
      { placeId, reviewId: review.id },
      { onSuccess: () => setShowConfirm(false) }
    );
  };

  return (
    <div className="group relative flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-250">
      {/* Avatar */}
      {review.user?.avatar ? (
        <img
          src={review.user.avatar}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-gray-50"
        />
      ) : (
        <div className="h-9 w-9 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-xs ring-2 ring-gray-50">
          {(review.user?.username || "AD").substring(0, 2).toUpperCase()}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {review.user?.username || "Ẩn danh"}
            </span>
            {review.user?.email && (
              <span className="text-[10px] text-gray-400 hidden sm:inline-block max-w-[150px] truncate">
                ({review.user.email})
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">
            {timeAgo(review.created_at)}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <StarRow value={review.rating} />
          <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-sm">
            {review.rating}★
          </span>
        </div>

        {review.comment ? (
          <p className="mt-2 text-sm text-gray-600 leading-relaxed font-normal whitespace-pre-line">
            {review.comment}
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-400 italic">Không có nội dung đánh giá.</p>
        )}

        <div className="mt-2.5 flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            ID #{review.id}
          </span>
        </div>
      </div>

      {/* Delete Action button */}
      <div className="relative shrink-0 ml-2">
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          disabled={isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Xóa đánh giá"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>

        {showConfirm && (
          <ConfirmPopover
            onConfirm={handleDelete}
            onCancel={() => setShowConfirm(false)}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  );
}

// ── Main ReviewsManagementModal ───────────────────────────────────────────────

export default function ReviewsManagementModal({ isOpen, onClose, placeId, placeName }) {
  const [filterRating, setFilterRating] = useState(0); // 0 = tất cả
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, rating-desc, rating-asc
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isLoading } = usePlaceReviews(placeId);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRating, searchQuery, sortBy]);

  if (!isOpen) return null;

  const allReviews = data?.reviews ?? [];
  const ratingAvg = data?.rating_avg;
  const total = data?.total ?? 0;

  // 1. Phân phối sao (luôn tính trên tổng số reviews gốc)
  const starDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = allReviews.filter((r) => r.rating === rating).length;
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return { rating, count, percent };
  });

  // 2. Lọc & Tìm kiếm
  const filteredReviews = allReviews.filter((r) => {
    // Lọc theo số sao
    if (filterRating !== 0 && r.rating !== filterRating) return false;

    // Tìm kiếm theo comment hoặc username
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchComment = (r.comment || "").toLowerCase().includes(q);
      const matchUsername = (r.user?.username || "").toLowerCase().includes(q);
      return matchComment || matchUsername;
    }

    return true;
  });

  // 3. Sắp xếp
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === "rating-desc") return b.rating - a.rating;
    if (sortBy === "rating-asc") return a.rating - b.rating;
    return 0;
  });

  // 4. Phân trang
  const totalFiltered = sortedReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setFilterRating(0);
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-100 shrink-0 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="text-gray-500" size={18} />
              <h2 className="text-base font-bold text-gray-900">Quản lý đánh giá người dùng</h2>
            </div>
            <p className="text-[12px] text-gray-500 mt-1.5 font-medium truncate max-w-md">
              Địa điểm: <span className="text-gray-800 font-semibold">{placeName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:shadow-sm transition shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={32} className="animate-spin text-amber-500" />
            <p className="text-sm text-gray-500 font-medium">Đang tải đánh giá...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
            
            {/* Cột trái: Thống kê & Bộ lọc */}
            <div className="md:col-span-5 p-5 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 overflow-y-auto flex flex-col gap-5">
              
              {/* Tổng quan Điểm số */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Đánh giá trung bình</p>
                <div className="flex items-end gap-3 mt-1.5">
                  <span className="text-4xl font-extrabold text-gray-900 leading-none">
                    {ratingAvg !== null && ratingAvg !== undefined ? Number(ratingAvg).toFixed(1) : "0.0"}
                  </span>
                  <div>
                    <StarRow value={Math.round(ratingAvg ?? 0)} />
                    <p className="text-[11px] text-gray-400 mt-1 font-medium">Dựa trên {total} lượt đánh giá</p>
                  </div>
                </div>
              </div>

              {/* Phân bố sao (Click để lọc nhanh) */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Phân tích xếp hạng</h3>
                <div className="flex flex-col gap-2">
                  {starDistribution.map(({ rating, count, percent }) => {
                    const isSelected = filterRating === rating;
                    return (
                      <button
                        key={rating}
                        onClick={() => setFilterRating(isSelected ? 0 : rating)}
                        className={`flex items-center gap-3 text-left w-full p-1.5 rounded-lg transition hover:bg-gray-100/70 group ${
                          isSelected ? "bg-amber-50/80 hover:bg-amber-50 border border-amber-200/50" : "border border-transparent"
                        }`}
                        type="button"
                      >
                        <span className="text-xs font-semibold text-gray-600 w-6 group-hover:text-amber-500 transition">
                          {rating}★
                        </span>
                        
                        <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        
                        <span className="text-xs font-mono text-gray-400 w-10 text-right group-hover:text-gray-700">
                          {percent}%
                        </span>
                        <span className="text-[10px] text-gray-300 w-8 group-hover:text-gray-500">
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
                {filterRating > 0 && (
                  <p className="text-[11px] text-amber-600 font-medium mt-2 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Đang lọc đánh giá {filterRating} sao. Click lại hàng để bỏ lọc.
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 my-1" />

              {/* Bộ lọc & Tìm kiếm */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tìm kiếm & Sắp xếp</h3>
                
                {/* Ô tìm kiếm */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm nội dung, tên người dùng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-amber-400 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-[10px] text-gray-400 hover:text-gray-600 font-bold bg-gray-100 px-1 py-0.5 rounded"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                {/* Sắp xếp */}
                <div className="relative">
                  <ArrowUpDown size={12} className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-amber-400 transition bg-white appearance-none"
                  >
                    <option value="newest">Đánh giá mới nhất</option>
                    <option value="oldest">Đánh giá cũ nhất</option>
                    <option value="rating-desc">Điểm cao nhất trước</option>
                    <option value="rating-asc">Điểm thấp nhất trước</option>
                  </select>
                </div>

                {/* Nút reset nhanh bộ lọc */}
                {(filterRating !== 0 || searchQuery !== "" || sortBy !== "newest") && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center justify-center gap-1.5 w-full py-2 border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[11px] font-semibold text-gray-500 hover:text-gray-700 rounded-xl transition mt-1"
                  >
                    <RefreshCw size={11} />
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>
            </div>

            {/* Cột phải: Danh sách đánh giá & Phân trang */}
            <div className="md:col-span-7 flex flex-col p-5 overflow-hidden">
              
              {/* Header của danh sách */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 shrink-0">
                <span className="text-xs font-bold text-gray-500">
                  Danh sách đánh giá ({totalFiltered} / {total} kết quả)
                </span>
              </div>

              {/* Vùng cuộn chứa các review rows */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin">
                {paginatedReviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Star size={36} className="text-gray-200 mb-2.5 animate-pulse" />
                    <p className="text-xs text-gray-500 font-semibold">Không tìm thấy đánh giá nào</p>
                    <p className="text-[11px] text-gray-400 mt-1 max-w-[240px]">
                      Thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3.5 bg-gray-900 text-white text-xs px-3.5 py-1.5 rounded-lg hover:bg-gray-800 transition font-medium"
                    >
                      Đặt lại toàn bộ
                    </button>
                  </div>
                ) : (
                  paginatedReviews.map((review) => (
                    <ReviewRow key={review.id} review={review} placeId={placeId} />
                  ))
                )}
              </div>

              {/* Phân trang (Pagination) ở dưới cùng */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4 shrink-0">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
                  >
                    Trang trước
                  </button>
                  
                  <span className="text-xs font-medium text-gray-500">
                    Trang <span className="font-bold text-gray-800">{currentPage}</span> / <span className="font-semibold text-gray-700">{totalPages}</span>
                  </span>
                  
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 px-5 py-3.5 bg-gray-50/50 flex justify-between items-center text-[10px] text-gray-400 font-medium">
          <span>* Các đánh giá vi phạm tiêu chuẩn cộng đồng có thể bị xóa bởi admin</span>
          <span>Đang hiển thị tối đa {itemsPerPage} dòng mỗi trang</span>
        </div>

      </div>
    </div>
  );
}
