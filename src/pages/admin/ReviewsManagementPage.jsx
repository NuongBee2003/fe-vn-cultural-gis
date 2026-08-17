import { useEffect, useState } from "react";
import { reviewApi } from "@/api/user/reviewApi";
import { useNotify } from "@/context/NotifyContext";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-data/table";
import { Trash2, Star, Utensils, MapPin } from "lucide-react";

const PAGE_SIZES = [10, 20, 50];

export default function ReviewsManagementPage() {
  const notify = useNotify();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ categoryStats: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Search
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reviewApi.getAllReviewsAdmin({
        page,
        limit: pageSize,
        query: search,
      });
      setReviews(res.data?.reviews || []);
      setStats(res.data?.stats || { categoryStats: [] });
      setTotalItems(res.meta?.total || 0);
    } catch (err) {
      console.error("Lỗi khi load đánh giá:", err);
      setError("Không thể tải danh sách đánh giá từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only debounce search, or just load immediately since it's simple
    const timer = setTimeout(() => {
      loadReviews();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, pageSize, search]);

  const handleDelete = async (id) => {
    const ok = await notify.confirm("Bạn có chắc chắn muốn xóa đánh giá này?", {
      title: "Xóa đánh giá",
      confirmLabel: "Xóa",
    });
    if (!ok) return;

    try {
      await reviewApi.deleteReview(id);
      notify.success("Xóa đánh giá thành công");
      loadReviews();
    } catch (err) {
      notify.error(`Lỗi khi xóa đánh giá: ${err.message}`);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={
            i <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"
          }
        />
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  return (
    <main className="px-6 py-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold">Quản lý đánh giá</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý và theo dõi các đánh giá, bình luận của người dùng về địa điểm du lịch và ẩm thực.
          </p>
        </div>
      </div>

      {/* ── Thống kê (Stats Cards) ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {stats.categoryStats?.map((cat, index) => {
          // Add some dynamic colors based on index
          const colors = [
            "bg-orange-50 text-orange-600",
            "bg-emerald-50 text-emerald-600",
            "bg-blue-50 text-blue-600",
            "bg-purple-50 text-purple-600",
            "bg-pink-50 text-pink-600",
            "bg-indigo-50 text-indigo-600",
          ];
          const colorClass = colors[index % colors.length];

          // Use Utensils for food, MapPin for everything else for now
          const IconComponent = cat.name.toLowerCase().includes("ẩm thực") ? Utensils : MapPin;

          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-full ${colorClass}`}>
                <IconComponent size={28} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider line-clamp-1" title={cat.name}>
                  {cat.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-3xl font-bold text-gray-800">{cat.averageRating || 0}</h2>
                  <Star className="fill-amber-400 text-amber-400" size={22} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Từ {cat.count} đánh giá
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end mb-4 justify-between">
        <div className="grid gap-3 sm:grid-cols-[minmax(250px,1fr)_auto]">
          {/* Search */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-muted-foreground">Tìm kiếm nội dung</span>
            <Input
              placeholder="Nhập nội dung đánh giá cần tìm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
        </div>

        {/* Page Size */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-muted-foreground">Hiển thị</span>
          <select
            className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} hàng/trang
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ── Table ────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        {loading && reviews.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8922E]" />
              <p className="text-sm">Đang tải dữ liệu đánh giá...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">STT</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <TableRow key={review.id}>
                    <TableCell className="text-muted-foreground text-xs">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold max-w-[120px] truncate">
                        {review.user?.username || "(Ẩn danh)"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium max-w-[200px] whitespace-normal line-clamp-2">
                        {review.location?.place?.name || review.location?.address || "—"}
                      </div>
                    </TableCell>

                    <TableCell>
                      {renderStars(review.rating)}
                    </TableCell>

                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-[280px] whitespace-normal line-clamp-2" title={review.comment}>
                        {review.comment || <span className="italic text-gray-400">Không có bình luận</span>}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(review.created_at)}
                    </TableCell>

                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy đánh giá nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Hiển thị <span className="font-medium text-foreground">{reviews.length}</span> trên tổng số <span className="font-medium text-foreground">{totalItems}</span> đánh giá
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={page <= 1}
                          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        >
                          Trước
                        </Button>
                        <span className="text-sm text-foreground min-w-[60px] text-center">
                          {page} / {totalPages}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={page >= totalPages}
                          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        >
                          Sau
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </main>
  );
}
