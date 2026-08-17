import { useEffect, useState } from "react";
import { getAdminUsers, updateUserStatus } from "@/api/admin/userAdminApi";
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
import { Search, Crown, User, Shield, RefreshCw } from "lucide-react";

const PAGE_SIZES = [5, 10, 15, 20];

function getRoleBadge(role) {
  const r = String(role || "").toLowerCase();
  if (r === "admin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
        <Crown size={11} />
        Quản trị viên
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
      <User size={11} />
      Người dùng
    </span>
  );
}

function getInitials(name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "").toUpperCase();
}

function formatDateTime(isoString) {
  if (!isoString) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const notify = useNotify();

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi khi load users:", err);
      setError("Không thể tải danh sách tài khoản từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUpdatingId(userId);
      await updateUserStatus(userId, newStatus);
      notify.success("Cập nhật trạng thái thành công!");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      notify.error(err.message || "Cập nhật trạng thái thất bại!");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter
  const filteredUsers = users.filter((u) => {
    const query = search.trim().toLowerCase();
    const matchSearch =
      !query ||
      u.username?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      String(u.id).includes(query);
    const matchRole =
      roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginated = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  // Tổng kết
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalRegular = users.filter((u) => u.role !== "admin").length;

  return (
    <main className="px-6 py-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý tài khoản</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách tất cả tài khoản người dùng trong hệ thống cùng quyền hạn của từng tài khoản.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadUsers}
          disabled={loading}
          className="shrink-0 gap-1.5"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Làm mới
        </Button>
      </div>

      {/* ── Summary Cards ───────────────────────────────── */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
              <Shield size={18} className="text-slate-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs text-muted-foreground">Tổng tài khoản</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Crown size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{totalAdmins}</p>
              <p className="text-xs text-muted-foreground">Quản trị viên</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-background p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <User size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalRegular}</p>
              <p className="text-xs text-muted-foreground">Người dùng</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────── */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto_auto]">
          {/* Search */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-muted-foreground">Tìm kiếm</span>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tên, email, ID..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8"
              />
            </div>
          </label>

          {/* Role Filter */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-muted-foreground">Quyền</span>
            <select
              className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            >
              <option value="all">Tất cả</option>
              <option value="admin">Quản trị viên</option>
              <option value="business">Doanh nghiệp</option>
              <option value="user">Người dùng</option>
            </select>
          </label>

          {/* Page Size */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-muted-foreground">Hàng / trang</span>
            <select
              className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div className="mt-5 overflow-hidden rounded-xl border bg-background shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8922E]" />
              <p className="text-sm">Đang tải danh sách tài khoản...</p>
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
                <TableHead>Tài khoản</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Ngày tạo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length > 0 ? (
                paginated.map((user, index) => (
                  <TableRow key={user.id}>
                    {/* STT */}
                    <TableCell className="text-muted-foreground text-xs">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>

                    {/* Tài khoản */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(user.username)
                          )}
                        </div>
                        <span className="font-semibold text-sm">{user.username || "—"}</span>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <div className="max-w-[220px] truncate text-sm text-muted-foreground">
                        {user.email || "—"}
                      </div>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <select
                        value={user.status || "active"}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className={`h-8 w-[120px] rounded-md border bg-transparent px-2 text-xs font-semibold outline-none focus-visible:ring-2 disabled:opacity-50 ${
                          user.status === 'banned' 
                            ? 'border-red-200 text-red-700 bg-red-50' 
                            : 'border-emerald-200 text-emerald-700 bg-emerald-50'
                        }`}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="banned">Bị khóa</option>
                      </select>
                    </TableCell>

                    {/* ID */}
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      #{user.id}
                    </TableCell>

                    {/* Ngày tạo */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(user.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy tài khoản nào phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Hiển thị{" "}
                      <span className="font-medium text-foreground">{paginated.length}</span>{" "}
                      trên tổng số{" "}
                      <span className="font-medium text-foreground">{totalItems}</span> tài khoản
                    </div>

                    {totalPages > 1 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
                          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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
