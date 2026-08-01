import { useState } from "react";
import { useAllLocations, useAssetsByLocationId } from "@/api/user/useLocationQuery";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { X } from "lucide-react";
import ReviewsManagementModal from "@/components/dashboard/ReviewsManagementModal";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-data/table";

const PAGE_SIZES = [5, 10, 15, 20];

function ImageGalleryModal({ isOpen, onClose, locationId, placeName }) {
  const { data: assets = [], isLoading } = useAssetsByLocationId(locationId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Hình ảnh - {placeName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Đang tải hình ảnh...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                  <line x1="3" y1="3" x2="21" y2="21"></line>
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Địa điểm chưa được cập nhật hình ảnh</p>
              <p className="text-sm text-gray-400 mt-1">Vui lòng thêm hình ảnh cho địa điểm này</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="relative aspect-square overflow-hidden rounded-lg border"
                >
                  <img
                    src={asset.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {asset.is_primary === 1 && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Ảnh chính
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LocationsManagementPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  // Gọi API với pagination
  const { data: apiData, isLoading, error } = useAllLocations(page, pageSize);

  const locations = apiData?.data || [];
  const meta = apiData?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 };

  // Lọc theo search text (client-side trên dữ liệu đã fetch từ API)
  const filteredLocations = locations.filter((location) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      location.name.toLowerCase().includes(query) ||
      location.category.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query)
    );
  });

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1); // Reset về trang 1 khi thay đổi page size
  };

  const handleViewImages = (location) => {
    setSelectedLocation(location);
    setShowImages(true);
  };

  const handleCloseImages = () => {
    setShowImages(false);
    setSelectedLocation(null);
  };

  const handleViewReviews = (location) => {
    setSelectedLocation(location);
    setShowReviews(true);
  };

  const handleCloseReviews = () => {
    setShowReviews(false);
    setSelectedLocation(null);
  };

  return (
    <main className="px-6 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý các vị trí</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Xem danh sách tất cả các vị trí (locations) trong hệ thống.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] md:w-[520px]">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Tìm kiếm</span>
            <Input
              placeholder="Tên, thể loại hoặc địa chỉ..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Số hàng / trang</span>
            <select
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={pageSize}
              onChange={(event) => handlePageSizeChange(Number(event.target.value))}
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

      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-red-500">Lỗi khi tải dữ liệu: {error.message}</p>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Tên địa điểm</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Thể loại</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Vĩ / Kinh độ</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location, index) => (
                  <TableRow key={`${location.id}-${index}`}>
                    <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {location.description || "Chưa có mô tả"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                        {location.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {location.address}
                    </TableCell>
                    <TableCell className="text-sm">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleViewImages(location)}
                        >
                          Xem ảnh
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleViewReviews(location)}
                        >
                          Đánh giá
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy vị trí nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Hiển thị {filteredLocations.length} trên tổng {meta.total} vị trí
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
                        {page} / {meta.totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page === meta.totalPages}
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

      {selectedLocation && (
        <ImageGalleryModal
          isOpen={showImages}
          onClose={handleCloseImages}
          locationId={selectedLocation.id}
          placeName={selectedLocation.name}
        />
      )}

      {selectedLocation && (
        <ReviewsManagementModal
          isOpen={showReviews}
          onClose={handleCloseReviews}
          placeId={selectedLocation.placeId}
          placeName={selectedLocation.name}
          locationId={selectedLocation.id}
        />
      )}
    </main>
  );
}
