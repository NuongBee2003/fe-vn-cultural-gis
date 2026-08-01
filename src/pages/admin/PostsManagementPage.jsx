import { useEffect, useState } from "react";
import { getAdminPosts, reviewPost, deletePost } from "@/api/user/postApi";
import { useNotify } from "@/context/NotifyContext";
import { deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS } from "@/constants/supabaseConfig";
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
import { Check, X, Trash2, Search, SlidersHorizontal } from "lucide-react";

const PAGE_SIZES = [5, 10, 15, 20];

export default function PostsManagementPage() {
  const notify = useNotify();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch posts from API
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Gọi API getAdminPosts dành riêng cho admin
      const data = await getAdminPosts(statusFilter === "all" ? undefined : statusFilter);
      setPosts(data);
    } catch (err) {
      console.error("Lỗi khi load posts:", err);
      setError("Không thể tải danh sách bài viết từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [statusFilter]);

  // Handle Approve/Reject
  const handleReview = async (id, status) => {
    const actionText = status === "accepted" ? "duyệt" : "từ chối";
    const ok = await notify.confirm(`Bạn có chắc chắn muốn ${actionText} bài viết này?`, {
      title: "Xác nhận thao tác",
      confirmLabel: actionText.charAt(0).toUpperCase() + actionText.slice(1),
    });
    if (!ok) return;

    try {
      await reviewPost(id, status);
      loadPosts();
    } catch (err) {
      notify.error(`Lỗi khi ${actionText} bài viết: ${err.message}`);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const ok = await notify.confirm("Bạn có chắc chắn muốn xóa bài viết này?", {
      title: "Xóa bài viết",
      confirmLabel: "Xóa",
    });
    if (!ok) return;

    try {
      const post = posts.find((p) => p.id === id);
      if (post && post.images && post.images.length > 0) {
        for (const imgUrl of post.images) {
          if (imgUrl && imgUrl.includes("supabase.co")) {
            try {
              await deleteImageFromSupabase(imgUrl, SUPABASE_BUCKETS.POST_IMAGES);
            } catch (err) {
              console.error("Lỗi xóa ảnh bài viết trên Supabase:", err);
            }
          }
        }
      }
      await deletePost(id);
      loadPosts();
    } catch (err) {
      notify.error(`Lỗi khi xóa bài viết: ${err.message}`);
    }
  };

  // Local filtering by search query
  const filteredPosts = posts.filter((post) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    const authorName = post.user?.username || "";
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      authorName.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Đã duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            Từ chối
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            Chờ duyệt
          </span>
        );
    }
  };

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

  return (
    <main className="px-6 py-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý bài viết cộng đồng</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Phê duyệt, từ chối hoặc xóa các bài viết chia sẻ trải nghiệm văn hóa từ cộng đồng.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid gap-3 sm:grid-cols-[minmax(200px,1fr)_auto_auto]">
            {/* Search */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Tìm kiếm</span>
              <Input
                placeholder="Tìm tiêu đề, nội dung, tác giả..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </label>

            {/* Status Filter */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Trạng thái</span>
              <select
                className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="accepted">Đã duyệt</option>
                <option value="rejected">Bị từ chối</option>
              </select>
            </label>

            {/* Page Size */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Hàng / trang</span>
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
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────── */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8922E]" />
              <p className="text-sm">Đang tải dữ liệu bài viết...</p>
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
                <TableHead>Tác giả</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post, index) => (
                  <TableRow key={post.id}>
                    <TableCell className="text-muted-foreground text-xs">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>

                    <TableCell className="font-semibold max-w-[120px] truncate">
                      {post.user?.username || "(Ẩn danh)"}
                    </TableCell>

                    <TableCell className="font-medium max-w-[180px]">
                      <span className="line-clamp-2">{post.title}</span>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground max-w-[280px]">
                      <span className="line-clamp-2">{post.content}</span>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground max-w-[180px]">
                      <span className="line-clamp-2">
                        {post.location?.place?.name || post.location?.address || "—"}
                      </span>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(post.status)}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(post.created_at)}
                    </TableCell>

                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      {/* Chỉ hiện các nút phê duyệt khi bài viết chưa được duyệt */}
                      {post.status !== "accepted" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => handleReview(post.id, "accepted")}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border-emerald-200"
                          >
                            <Check size={14} className="mr-1" /> Duyệt
                          </Button>
                          
                          {post.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() => handleReview(post.id, "rejected")}
                              className="bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border-rose-200"
                            >
                              <X size={14} className="mr-1" /> Từ chối
                            </Button>
                          )}
                        </>
                      )}
                      
                      {/* Delete button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy bài viết nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Hiển thị <span className="font-medium text-foreground">{paginatedPosts.length}</span> trên tổng số <span className="font-medium text-foreground">{totalItems}</span> bài viết
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
