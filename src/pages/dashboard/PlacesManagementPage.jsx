import { useMemo, useState, useRef, useEffect } from "react";
import { useAllLocations, useAllLocationsByCategory, useCategories } from "@/api/useLocationQuery";
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
import ImageMasonryGallery from "@/components/user/map/ImageMasonryGallery";
import { ImageOff, Filter, X } from "lucide-react";

const PAGE_SIZES = [5, 10, 15, 20];

const DEFAULT_CATEGORY = { id: null, name: "all" };

export default function PlacesManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState(DEFAULT_CATEGORY);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // ── API ───────────────────────────────────────────────
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const isFiltering = categoryFilter.name !== "all";

  // Cả hai query đều nhận page + pageSize để phân trang hoạt động đúng
  const allQuery = useAllLocations(page, pageSize);
  const byCategoryQuery = useAllLocationsByCategory(
    page,
    pageSize,
    categoryFilter.id,
    { enabled: isFiltering } // chỉ fetch khi đang filter, tránh request thừa
  );

  const { data: apiData, isLoading, error } = isFiltering ? byCategoryQuery : allQuery;

  const locations = apiData?.data || [];
  const meta = apiData?.meta || { total: 0, page: 1, limit: pageSize, totalPages: 0 };

  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();

  // ── Client-side search (chỉ lọc trên trang hiện tại) ──
  const isClientSearching = search.trim().length > 0;

  const filteredLocations = useMemo(() => {
    if (!isClientSearching) return locations;
    const query = search.trim().toLowerCase();
    return locations.filter((loc) =>
      (loc.name || "").toLowerCase().includes(query)
    );
  }, [locations, search, isClientSearching]);

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

  const handleViewImages = (location) => {
    if (!location.images || location.images.length === 0) return;
    setGalleryImages(location.images);
    setGalleryTitle(location.name);
    setGalleryInitialIndex(0);
    setIsGalleryOpen(true);
  };

  const handleCategorySelect = (cat) => {
    setCategoryFilter(cat === "all" ? DEFAULT_CATEGORY : { id: cat.id, name: cat.name });
    setIsFilterOpen(false);
    setPage(1); // reset về trang 1 khi đổi category
    setSearch(""); // optional: clear search khi đổi category
  };

  const handleClearCategory = (e) => {
    e.stopPropagation();
    setCategoryFilter(DEFAULT_CATEGORY);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // Không reset page vì search là client-side trên trang hiện tại
    // Nếu muốn search toàn bộ thì cần chuyển sang server-side search
  };

  // Close dropdown khi click ngoài
  const filterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // Tính totalPages an toàn
  const totalPages = meta.totalPages || Math.ceil(meta.total / pageSize) || 1;

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
          <div className="grid gap-3 sm:grid-cols-[minmax(200px,1fr)_auto_auto]">
            {/* Search */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Tìm kiếm</span>
              <Input
                placeholder="Nhập tên địa điểm"
                value={search}
                onChange={handleSearchChange}
              />
            </label>

            {/* Category Filter Dropdown */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Danh mục</span>
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`h-9 rounded-lg border bg-background px-3 text-sm flex items-center gap-2 min-w-[140px] justify-between transition-colors
                    ${isFilterOpen ? "border-ring ring-3 ring-ring/50" : "border-input hover:border-ring/50"}`}
                >
                  <span className="flex items-center gap-2">
                    <Filter size={14} />
                    <span className="truncate">
                      {categoryFilter.name === "all" ? "Tất cả" : categoryFilter.name}
                    </span>
                  </span>
                  {isFiltering && (
                    <X
                      size={14}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={handleClearCategory}
                    />
                  )}
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-input rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    {isLoadingCategories ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        Đang tải...
                      </div>
                    ) : (
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => handleCategorySelect("all")}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2
                            ${!isFiltering ? "bg-secondary font-medium" : ""}`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            {!isFiltering && (
                              <div className="w-2 h-2 rounded-full bg-[#B8922E]" />
                            )}
                          </div>
                          Tất cả
                        </button>

                        {categories.map((cat) => {
                          const isSelected = categoryFilter.id === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => handleCategorySelect(cat)}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2
                                ${isSelected ? "bg-secondary font-medium" : ""}`}
                            >
                              <div className="w-5 h-5 flex items-center justify-center">
                                {isSelected ? (
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: cat.color || "#B8922E" }}
                                  />
                                ) : cat.icon_marker ? (
                                  <img
                                    src={cat.icon_marker}
                                    alt=""
                                    className="w-4 h-4 object-contain opacity-70"
                                  />
                                ) : null}
                              </div>
                              <span className="truncate">{cat.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </label>

            {/* Page Size */}
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
                <TableHead>Mô tả</TableHead>
                <TableHead>Hình ảnh</TableHead>
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

                    <TableCell className="text-sm text-muted-foreground max-w-[240px]">
                      <span className="line-clamp-2 text-center">{location.description || "—"}</span>
                    </TableCell>

                    <TableCell>
                      {location.images && location.images.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => handleViewImages(location)}
                          className="group relative block w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#B8922E] transition-all hover:shadow-lg"
                          title={`Xem ${location.images.length} ảnh`}
                        >
                          <img
                            src={location.images[0]}
                            alt={location.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {location.images.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                              {location.images.length} ảnh
                            </div>
                          )}
                        </button>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-linear-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300">
                          <ImageOff size={20} className="text-gray-400 mb-1" />
                          <span className="text-[9px] text-gray-500 font-medium text-center px-1">Chưa có ảnh</span>
                        </div>
                      )}
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
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    {isClientSearching
                      ? `Không tìm thấy địa điểm nào khớp với "${search}" trên trang này`
                      : isFiltering
                      ? `Không có địa điểm nào trong danh mục "${categoryFilter.name}"`
                      : "Chưa có dữ liệu địa điểm"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Hiển thị đúng số lượng tùy theo trạng thái */}
                    <div className="text-sm text-muted-foreground">
                      {isClientSearching ? (
                        <>
                          Tìm thấy{" "}
                          <span className="font-medium text-foreground">
                            {filteredLocations.length}
                          </span>{" "}
                          trên trang này
                          {isFiltering && (
                            <span> · Danh mục: <span className="font-medium text-foreground">{categoryFilter.name}</span></span>
                          )}
                        </>
                      ) : (
                        <>
                          Hiển thị{" "}
                          <span className="font-medium text-foreground">
                            {locations.length}
                          </span>{" "}
                          trên tổng{" "}
                          <span className="font-medium text-foreground">
                            {meta.total}
                          </span>{" "}
                          địa điểm
                          {isFiltering && (
                            <span> trong danh mục <span className="font-medium text-foreground">{categoryFilter.name}</span></span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Pagination — luôn hoạt động dù đang filter hay không */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      >
                        Trang trước
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

      {/* ── Image Gallery Modal ───────────────────────────── */}
      <ImageMasonryGallery
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        title={galleryTitle}
        initialIndex={galleryInitialIndex}
      />
    </main>
  );
}