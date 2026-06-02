import { useMemo, useState } from "react";
import { useAllLocations } from "@/api/useLocationQuery";
import { useCreateLocation, useUpdateLocation, useDeleteLocation } from "@/api/locationAdminApi";
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
import LocationFormModal from "@/components/dashboard/LocationFormModal";

const PAGE_SIZES = [5, 10, 15, 20];

export default function PlacesManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null); // null = tạo mới

  // API Data
  const { data: apiData, isLoading, error } = useAllLocations(page, pageSize);
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  const locations = apiData?.data || [];
  const meta = apiData?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 };

  // Lọc client-side
  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return locations;
    return locations.filter(
      (loc) =>
        (loc.name || "").toLowerCase().includes(query) ||
        (loc.category || "").toLowerCase().includes(query) ||
        (loc.address || "").toLowerCase().includes(query)
    );
  }, [locations, search]);

  // ── Handlers ──────────────────────────────────────────
  const handleCreate = () => {
    setSelectedPlace(null);
    setIsModalOpen(true);
  };

  const handleEdit = (location) => {
    setSelectedPlace(location);
    setIsModalOpen(true);
  };

  const handleDelete = (location) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa địa điểm "${location.name}"?\nHành động này không thể hoàn tác.`
      )
    ) {
      deleteMutation.mutate(location.id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  const handleModalSubmit = async (formData) => {
    if (selectedPlace) {
      await updateMutation.mutateAsync({ id: selectedPlace.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <main className="px-6 py-5">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý địa điểm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tạo mới, chỉnh sửa và quản lý toàn bộ địa điểm trong hệ thống.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {/* Search + Page Size */}
          <div className="grid gap-3 sm:grid-cols-[minmax(200px,1fr)_auto]">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Tìm kiếm</span>
              <Input
                placeholder="Tên, thể loại hoặc địa chỉ..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Hàng / trang</span>
              <select
                className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreate}
            className="bg-[#B8922E] hover:bg-[#a67d22] h-9 whitespace-nowrap"
            disabled={isMutating}
          >
            + Tạo địa điểm
          </Button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────── */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8922E]" />
              <p className="text-sm">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-red-500 text-sm">Lỗi khi tải dữ liệu: {error.message}</p>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Tên địa điểm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Vĩ / Kinh độ</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location, index) => (
                  <TableRow key={`${location.id}-${index}`}>
                    <TableCell className="text-muted-foreground text-xs">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>

                    <TableCell className="font-medium max-w-[200px]">
                      <span className="line-clamp-2">{location.name}</span>
                    </TableCell>

                    <TableCell>
                      <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                        {location.category || "—"}
                      </span>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground max-w-[240px]">
                      <span className="line-clamp-2">{location.address || "—"}</span>
                    </TableCell>

                    <TableCell className="text-xs font-mono whitespace-nowrap">
                      {location.lat != null && location.lng != null
                        ? `${Number(location.lat).toFixed(5)}, ${Number(location.lng).toFixed(5)}`
                        : "—"}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => handleEdit(location)}
                        disabled={isMutating}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleDelete(location)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? "..." : "Xóa"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    {search
                      ? `Không tìm thấy địa điểm nào khớp với "${search}"`
                      : "Chưa có dữ liệu địa điểm"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Hiển thị {filteredLocations.length} trên tổng {meta.total} địa điểm
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      >
                        Trang trước
                      </Button>
                      <span className="text-sm text-foreground">
                        {page} / {meta.totalPages || 1}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page === meta.totalPages || meta.totalPages === 0}
                        onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                      >
                        Trang sau
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>

      {/* ── Form Modal (Create / Update) ─────────────────── */}
      <LocationFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={selectedPlace}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </main>
  );
}
