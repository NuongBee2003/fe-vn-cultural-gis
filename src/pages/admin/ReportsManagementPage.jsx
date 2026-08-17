import { useEffect, useState } from "react";
import { reportApi } from "@/api/user/reportApi";
import { useNotify } from "@/context/NotifyContext";
import { Button } from "@/components/ui/button/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-data/table";
import { Check, X, Trash2, MapPin, MessageSquare, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";

const PAGE_SIZES = [10, 20, 50];

export default function ReportsManagementPage() {
  const notify = useNotify();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // "" | "location" | "comment"
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    rejected: 0,
  });

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportApi.getAllReports({
        page,
        limit: pageSize,
        status: statusFilter || undefined,
      });

      const rawRows = res.data || [];
      
      // Client filter for type if selected
      let filteredRows = rawRows;
      if (typeFilter === "location") {
        filteredRows = rawRows.filter((r) => r.location_id !== null);
      } else if (typeFilter === "comment") {
        filteredRows = rawRows.filter((r) => r.comment_id !== null);
      } else if (typeFilter === "review") {
        filteredRows = rawRows.filter((r) => r.review_id !== null);
      }

      setReports(filteredRows);
      setTotalItems(res.meta?.total || filteredRows.length);

      // Compute quick stats
      setStats({
        total: res.meta?.total || rawRows.length,
        pending: rawRows.filter((r) => r.status === "pending").length,
        resolved: rawRows.filter((r) => r.status === "resolved").length,
        rejected: rawRows.filter((r) => r.status === "rejected").length,
      });
    } catch (err) {
      console.error("Lỗi khi load danh sách báo cáo:", err);
      setError("Không thể tải danh sách báo cáo từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [page, pageSize, statusFilter, typeFilter]);

  const handleAccept = async (report) => {
    const targetText = report.location_id
      ? "đóng cửa chi nhánh địa điểm bị báo cáo"
      : report.review_id
      ? "xóa đánh giá địa điểm bị báo cáo"
      : "xóa bình luận bị báo cáo";
    const ok = await notify.confirm(
      `Duyệt báo cáo #${report.id}? Hệ thống sẽ tự động ${targetText}.`,
      {
        title: "Duyệt báo cáo",
        confirmLabel: "Duyệt & Xử lý",
      }
    );
    if (!ok) return;

    try {
      const res = await reportApi.acceptReport(report.id);
      notify.success(res.message || "Đã duyệt và xử lý báo cáo thành công.");
      loadReports();
    } catch (err) {
      notify.error(`Lỗi khi duyệt báo cáo: ${err.message}`);
    }
  };

  const handleReject = async (reportId) => {
    const ok = await notify.confirm("Bạn có chắc chắn muốn từ chối báo cáo này?", {
      title: "Từ chối báo cáo",
      confirmLabel: "Từ chối",
    });
    if (!ok) return;

    try {
      await reportApi.rejectReport(reportId);
      notify.success("Đã từ chối báo cáo.");
      loadReports();
    } catch (err) {
      notify.error(`Lỗi khi từ chối báo cáo: ${err.message}`);
    }
  };

  const handleDelete = async (reportId) => {
    const ok = await notify.confirm("Bạn có chắc chắn muốn xóa lịch sử báo cáo này?", {
      title: "Xóa báo cáo",
      confirmLabel: "Xóa",
    });
    if (!ok) return;

    try {
      await reportApi.deleteReport(reportId);
      notify.success("Đã xóa báo cáo.");
      loadReports();
    } catch (err) {
      notify.error(`Lỗi khi xóa báo cáo: ${err.message}`);
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

  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
            <Clock size={12} /> Chờ xử lý
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2 size={12} /> Đã duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            <XCircle size={12} /> Từ chối
          </span>
        );
      default:
        return <span className="text-xs text-muted-foreground">{status}</span>;
    }
  };

  return (
    <main className="px-6 py-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold">Quản lý báo cáo vi phạm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi, kiểm duyệt và xử lý các báo cáo từ người dùng về địa điểm sai vị trí hoặc bình luận vi phạm.
          </p>
        </div>
      </div>

      {/* ── Thống kê (Stats Cards) ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-full bg-blue-50 text-blue-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tổng báo cáo</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-0.5">{stats.total}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-full bg-amber-50 text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Chờ xử lý</p>
            <h2 className="text-2xl font-bold text-amber-600 mt-0.5">{stats.pending}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Đã duyệt</p>
            <h2 className="text-2xl font-bold text-emerald-600 mt-0.5">{stats.resolved}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-full bg-slate-100 text-slate-600">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Đã từ chối</p>
            <h2 className="text-2xl font-bold text-slate-700 mt-0.5">{stats.rejected}</h2>
          </div>
        </div>
      </div>

      {/* ── Bộ lọc (Filters) ───────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end mb-4 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">Trạng thái</span>
            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="resolved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </label>

          {/* Type filter */}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">Đối tượng báo cáo</span>
            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả loại báo cáo</option>
              <option value="location">Báo cáo Địa điểm</option>
              <option value="comment">Báo cáo Bình luận bài viết</option>
              <option value="review">Báo cáo Đánh giá địa điểm</option>
            </select>
          </label>
        </div>

        {/* Page Size */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Hiển thị</span>
          <select
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs outline-none focus:ring-2 focus:ring-ring"
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

      {/* ── Bảng dữ liệu (Table) ───────────────────────────── */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        {loading && reports.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8922E]" />
              <p className="text-sm">Đang tải danh sách báo cáo...</p>
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
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Đối tượng báo cáo</TableHead>
                <TableHead>Lý do & Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report, index) => (
                  <TableRow key={report.id}>
                    <TableCell className="text-muted-foreground text-xs">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>

                    {/* Người báo cáo */}
                    <TableCell>
                      <div className="max-w-[150px]">
                        {report.user ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-slate-800">
                            {report.user.username}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {report.user.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">(Ẩn danh)</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Đối tượng báo cáo */}
                    <TableCell>
                      <div className="max-w-[220px] whitespace-normal">
                        {report.location ? (
                        <div className="flex items-start gap-1.5 text-xs text-slate-800">
                          <MapPin size={14} className="mt-0.5 shrink-0 text-rose-500" />
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="font-semibold text-rose-900 line-clamp-1">
                                {report.location.place?.name || `Chi nhánh #${report.location.id}`}
                              </p>
                              {report.location.status === "closed" ? (
                                <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                                  🔴 Đã đóng cửa
                                </span>
                              ) : (
                                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                  🟢 Hoạt động
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              ID Chi nhánh: {report.location.id}
                            </p>
                          </div>
                        </div>
                      ) : report.review ? (
                        <div className="flex items-start gap-1.5 text-xs text-slate-800">
                          <MessageSquare size={14} className="mt-0.5 shrink-0 text-amber-500" />
                          <div>
                            <p className="font-semibold text-amber-900">
                              Đánh giá #{report.review.id} ({report.review.rating} ⭐)
                            </p>
                            <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                              "{report.review.comment || 'Không có nhận xét'}"
                            </p>
                          </div>
                        </div>
                      ) : report.comment ? (
                        <div className="flex items-start gap-1.5 text-xs text-slate-800">
                          <MessageSquare size={14} className="mt-0.5 shrink-0 text-blue-500" />
                          <div>
                            <p className="font-semibold text-blue-900">
                              Bình luận #{report.comment.id}
                            </p>
                            <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                              "{report.comment.content}"
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Lý do & Mô tả (Gộp 1 ô) */}
                    <TableCell>
                      <div className="max-w-[280px] whitespace-normal">
                        <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-slate-800">
                          {report.report_type}
                        </span>
                        {report.description && report.description !== report.report_type && (
                          <span className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            Mô tả: {report.description}
                          </span>
                        )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell className="whitespace-nowrap">
                      {renderStatusBadge(report.status)}
                    </TableCell>

                    {/* Ngày tạo */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(report.created_at)}
                    </TableCell>

                    {/* Hành động */}
                    <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                      {report.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            type="button"
                            onClick={() => handleAccept(report)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-2.5"
                            title="Duyệt báo cáo và tự động xử lý"
                          >
                            <Check size={14} className="mr-1" /> Duyệt
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => handleReject(report.id)}
                            className="text-slate-600 hover:bg-slate-100 text-xs h-8 px-2.5"
                            title="Từ chối báo cáo"
                          >
                            <X size={14} className="mr-1" /> Từ chối
                          </Button>
                        </>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleDelete(report.id)}
                        className="h-8 w-8 p-0 inline-flex items-center justify-center"
                        title="Xóa bản ghi báo cáo"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy báo cáo nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-muted-foreground">
                      Hiển thị <span className="font-medium text-foreground">{reports.length}</span> trên tổng số <span className="font-medium text-foreground">{totalItems}</span> báo cáo
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
                        <span className="text-xs text-foreground min-w-[60px] text-center">
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
