import { useState, useRef, useEffect } from "react";
import { useAllPlaces, useCategories } from "@/api/user/useLocationQuery";
import { useCreatePlace, useUpdatePlace, useDeletePlace } from "@/api/admin/locationAdminApi";
import { useTranslation } from "react-i18next";
import { authApi } from "@/api/user/authApi";
import { Button } from "@/components/ui/button/button";
import Pagination from "@/components/ui/pagination/Pagination";
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
import ReviewsManagementModal from "@/components/dashboard/ReviewsManagementModal";
import ExcelImportModal from "@/components/dashboard/ExcelImportModal";
import { ImageOff, Filter, X } from "lucide-react";

import { deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS } from "@/constants/supabaseConfig";

const PAGE_SIZES = [5, 10, 15, 20];

const DEFAULT_CATEGORY = { id: null, name: "all" };

export default function PlacesManagementPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState(DEFAULT_CATEGORY);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  const [showReviews, setShowReviews] = useState(false);
  const [selectedPlaceForReviews, setSelectedPlaceForReviews] = useState(null);

  // ── API ───────────────────────────────────────────────
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1); // reset trang khi search thay đổi
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const user = authApi.getUser();
  const isBusiness = user?.role !== "admin" || window.location.pathname.startsWith("/business");

  const { data: apiData, isLoading, error } = useAllPlaces(
    page,
    pageSize,
    categoryFilter.name !== "all" ? categoryFilter.id : null,
    debouncedSearch,
    isBusiness ? user?.id : null
  );

  const places = apiData?.data || [];
  const meta = apiData?.meta || { total: 0, page: 1, limit: pageSize, totalPages: 0 };

  const createMutation = useCreatePlace();
  const updateMutation = useUpdatePlace();
  const deleteMutation = useDeletePlace();

  // Kết quả hiển thị: dùng places trực tiếp từ API có phân trang
  const filteredPlaces = places;
  const isFiltering = categoryFilter.name !== "all";

  // ── Handlers ──────────────────────────────────────────
  const handleCreate = () => {
    setSelectedPlace(null);
    setIsModalOpen(true);
  };

  const handleEdit = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleDelete = async (place) => {
    if (
      window.confirm(
        t('dashboard.places.confirmDelete', { name: place.name })
      )
    ) {
      const placeImages = [];
      for (const loc of place.locations || []) {
        if (loc.assets) {
          placeImages.push(...loc.assets.map(a => a.url));
        } else if (loc.images) {
          placeImages.push(...loc.images);
        }
      }
      if (placeImages.length > 0) {
        for (const imgUrl of placeImages) {
          if (imgUrl && imgUrl.includes("supabase.co")) {
            try {
              await deleteImageFromSupabase(imgUrl, SUPABASE_BUCKETS.LOCATION_IMAGES);
            } catch (err) {
              console.error("Lỗi xóa ảnh địa điểm trên Supabase:", err);
            }
          }
        }
      }
      deleteMutation.mutate(place.id);
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

  const handleViewReviews = (location) => {
    setSelectedPlaceForReviews(location);
    setShowReviews(true);
  };

  const handleCloseReviews = () => {
    setShowReviews(false);
    setSelectedPlaceForReviews(null);
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
    setPage(1); // reset về trang 1 khi tìm kiếm mới
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
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('dashboard.places.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('dashboard.places.description')}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid gap-3 sm:grid-cols-[minmax(200px,1fr)_auto_auto]">
            {/* Search */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">{t('common.search')}</span>
              <Input
                placeholder={t('dashboard.places.searchPlaceholder')}
                value={search}
                onChange={handleSearchChange}
              />
            </label>

            {/* Category Filter Dropdown */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">{t('dashboard.places.categoryLabel')}</span>
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
                      {categoryFilter.name === "all" ? t('common.all') : categoryFilter.name}
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
                          {t('common.all')}
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
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            className="border-[#B8922E] text-[#B8922E] hover:bg-[#B8922E]/10 h-9 whitespace-nowrap"
            disabled={isMutating}
          >
            Import Excel
          </Button>

          <Button
            onClick={handleCreate}
            className="bg-[#B8922E] hover:bg-[#a67d22] h-9 whitespace-nowrap"
            disabled={isMutating}
          >
            {t('dashboard.places.createBtn')}
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
                <TableHead className="w-10">{t('dashboard.places.table.no')}</TableHead>
                <TableHead>{t('dashboard.places.table.name')}</TableHead>
                <TableHead>{t('dashboard.places.table.category')}</TableHead>
                <TableHead>{t('dashboard.places.table.address')}</TableHead>
                <TableHead>{t('dashboard.places.table.description')}</TableHead>
                <TableHead>{t('dashboard.places.table.images')}</TableHead>
                <TableHead>{t('dashboard.places.table.coordinates')}</TableHead>
                <TableHead className="text-right">{t('dashboard.places.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place, index) => {
                  const addresses = (place.locations || []).map(l => l.address).filter(Boolean);
                  const placeImages = [];
                  for (const loc of place.locations || []) {
                    if (loc.assets) {
                      placeImages.push(...loc.assets.map(a => a.url));
                    } else if (loc.images) {
                      placeImages.push(...loc.images);
                    }
                  }

                  return (
                    <TableRow key={`${place.id}-${index}`}>
                      <TableCell className="text-muted-foreground text-xs">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>

                      <TableCell className="font-medium max-w-[200px]">
                        <span className="line-clamp-2">{place.name}</span>
                      </TableCell>

                      <TableCell>
                        <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                          {place.category?.name || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground max-w-[240px]">
                        <div className="flex flex-col gap-1">
                          {addresses.length > 0 ? (
                            addresses.map((addr, idx) => (
                              <span key={idx} className="line-clamp-1 border-b border-muted/50 pb-0.5 last:border-0 last:pb-0" title={addr}>
                                {addr}
                              </span>
                            ))
                          ) : (
                            "—"
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground max-w-[240px]">
                        <span className="line-clamp-2 text-center">{place.description || "—"}</span>
                      </TableCell>

                      <TableCell>
                        {placeImages.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => handleViewImages({ name: place.name, images: placeImages })}
                            className="group relative block w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#B8922E] transition-all hover:shadow-lg"
                            title={`Xem ${placeImages.length} ảnh`}
                          >
                            <img
                              src={placeImages[0]}
                              alt={place.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {placeImages.length > 1 && (
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                                {placeImages.length} ảnh
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
                        <div className="flex flex-col gap-1">
                          {(place.locations || []).map((loc, idx) => (
                            <span key={idx} className="block">
                              {loc.lat != null && loc.lng != null
                                ? `${Number(loc.lat).toFixed(5)}, ${Number(loc.lng).toFixed(5)}`
                                : "—"}
                            </span>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleViewReviews(place)}
                        >
                          {t('map.reviews')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleEdit(place)}
                          disabled={isMutating}
                        >
                          {t('common.edit')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => handleDelete(place)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "..." : t('common.delete')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    {debouncedSearch
                      ? t('dashboard.places.noSearchResult', { query: debouncedSearch })
                      : categoryFilter.name !== "all"
                      ? t('dashboard.places.noPlaceInCategory', { category: categoryFilter.name })
                      : t('dashboard.places.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="text-sm text-muted-foreground">
                    {debouncedSearch ? (
                      <>
                        Hiển thị các kết quả tìm kiếm cho "{debouncedSearch}"
                      </>
                    ) : (
                      <>
                        {t('common.showing')}{" "}
                        <span className="font-medium text-foreground">
                          {places.length}
                        </span>{" "}
                        {t('common.of')}{" "}
                        <span className="font-medium text-foreground">
                          {meta.total}
                        </span>{" "}
                        địa điểm
                        {categoryFilter.name !== "all" && (
                          <span> {t('dashboard.places.showingInCategory', { category: categoryFilter.name })}</span>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>

      {/* ── Pagination ────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* ── Form Modal (Create / Update) ─────────────────── */}
      <LocationFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={selectedPlace}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* ── Excel Import Modal ────────────────────────────── */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        categories={categories}
        onSubmit={handleModalSubmit}
        isMutating={isMutating}
      />

      {/* ── Image Gallery Modal ───────────────────────────── */}
      <ImageMasonryGallery
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={galleryImages}
        title={galleryTitle}
        initialIndex={galleryInitialIndex}
      />

      {/* ── Reviews Management Modal ─────────────────────── */}
      {selectedPlaceForReviews && (
        <ReviewsManagementModal
          isOpen={showReviews}
          onClose={handleCloseReviews}
          placeId={selectedPlaceForReviews.id}
          placeName={selectedPlaceForReviews.name}
          locationId={null}
        />
      )}
    </main>
  );
}