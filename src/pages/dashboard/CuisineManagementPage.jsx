import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { ImageOff, Loader2, Search, Edit2, Trash2, Plus, X, MapPin } from "lucide-react";
import {
  getCuisines,
  createCuisine,
  updateCuisine,
  deleteCuisine,
} from "@/api/cultureApi";
import { searchPlaceLocationsByDB } from "@/api/locationApi";
import { uploadImageToSupabase, deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS, IMAGE_UPLOAD_CONFIG } from "@/constants/supabaseConfig";

export default function CuisineManagementPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isMutating, setIsMutating] = useState(false);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    origin: "",
    ingredients: "",
    image_url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});

  // Recommended places states
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getCuisines();
      setItems(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ẩm thực:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Debounce search location
  useEffect(() => {
    if (locationQuery.trim().length < 2) {
      setLocationResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const results = await searchPlaceLocationsByDB(locationQuery.trim());
        setLocationResults(results || []);
      } catch (err) {
        console.error("Lỗi tìm kiếm địa điểm:", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  // Filter & Search (local search matching name, origin, ingredients, description)
  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name?.toLowerCase().includes(q) ||
      item.origin?.toLowerCase().includes(q) ||
      item.ingredients?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setFormData({
      name: "",
      description: "",
      origin: "",
      ingredients: "",
      image_url: "",
    });
    setSelectedLocations([]);
    setLocationQuery("");
    setLocationResults([]);
    setSelectedFile(null);
    setErrors({});
    setIsOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      origin: item.origin || "",
      ingredients: item.ingredients || "",
      image_url: item.image_url || "",
    });
    
    // Extract selected locations from nested cuisine_places
    const places = item.cuisine_places 
      ? item.cuisine_places.map((cp) => cp.place).filter(Boolean) 
      : [];
    setSelectedLocations(places);
    setLocationQuery("");
    setLocationResults([]);
    
    setSelectedFile(null);
    setErrors({});
    setIsOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa món ẩm thực "${item.name}" không?`)) {
      try {
        setIsMutating(true);
        if (item.image_url && item.image_url.includes("supabase.co")) {
          try {
            await deleteImageFromSupabase(item.image_url, SUPABASE_BUCKETS.CUISINE_IMAGES);
          } catch (imgErr) {
            console.error("Lỗi khi xóa ảnh trên Supabase:", imgErr);
          }
        }
        await deleteCuisine(item.id);
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } catch (error) {
        alert("Xóa thất bại: " + error.message);
      } finally {
        setIsMutating(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (!IMAGE_UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        throw new Error("Định dạng file không hỗ trợ. Hãy chọn ảnh JPEG, PNG, WEBP hoặc SVG.");
      }
      if (file.size > IMAGE_UPLOAD_CONFIG.MAX_SIZE_BYTES) {
        throw new Error(`Kích thước file vượt quá giới hạn ${IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB}MB.`);
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, image_url: event.target.result }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert(err.message);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Tên món ăn không được để trống";
    if (!formData.origin.trim()) errs.origin = "Vui lòng nhập nguồn gốc vùng miền";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsMutating(true);
      let imageUrl = formData.image_url;

      if (selectedFile) {
        setUploadingImage(true);
        imageUrl = await uploadImageToSupabase(selectedFile, SUPABASE_BUCKETS.CUISINE_IMAGES);
        setUploadingImage(false);
      }

      // Xóa ảnh cũ trên Supabase nếu ảnh mới khác ảnh cũ
      if (selectedItem && selectedItem.image_url && selectedItem.image_url !== imageUrl && selectedItem.image_url.includes("supabase.co")) {
        try {
          await deleteImageFromSupabase(selectedItem.image_url, SUPABASE_BUCKETS.CUISINE_IMAGES);
        } catch (imgErr) {
          console.error("Lỗi khi xóa ảnh cũ trên Supabase:", imgErr);
        }
      }

      const payload = {
        ...formData,
        image_url: imageUrl,
        place_ids: selectedLocations.map((l) => l.id),
      };

      if (selectedItem) {
        await updateCuisine(selectedItem.id, payload);
      } else {
        await createCuisine(payload);
      }

      setIsOpen(false);
      loadData();
    } catch (err) {
      alert("Lỗi khi lưu ẩm thực: " + err.message);
    } finally {
      setIsMutating(false);
      setUploadingImage(false);
    }
  };

  return (
    <main className="px-6 py-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý ẩm thực</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách đặc sản, món ngon vùng miền và địa điểm gợi ý thưởng thức.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid gap-3 sm:grid-cols-[minmax(200px,1fr)_auto]">
            {/* Tìm kiếm */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">{t("common.search")}</span>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm ẩm thực..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
            </label>

            {/* Số hàng/trang */}
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
                {[5, 10, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Button
            onClick={handleOpenCreate}
            className="bg-[#B8922E] hover:bg-[#a67d22] h-9 whitespace-nowrap gap-1.5"
            disabled={loading || isMutating}
          >
            <Plus size={16} />
            Thêm ẩm thực
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="animate-spin h-8 w-8 text-[#B8922E]" />
              <p className="text-sm">Đang tải danh sách ẩm thực...</p>
            </div>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="w-24">Hình ảnh</TableHead>
                <TableHead className="w-40">Tên món ngon</TableHead>
                <TableHead className="w-28">Nguồn gốc</TableHead>
                <TableHead className="w-40">Nguyên liệu</TableHead>
                <TableHead className="w-52">Địa điểm gợi ý</TableHead>
                <TableHead>Mô tả ngắn</TableHead>
                <TableHead className="text-right w-32">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedItems.length > 0 ? (
                pagedItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-muted-foreground text-xs">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>

                    <TableCell>
                      {item.image_url ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-slate-100 border border-dashed">
                          <ImageOff size={16} className="text-gray-400 mb-1" />
                          <span className="text-[9px] text-gray-500">No image</span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-semibold text-foreground">
                      {item.name}
                    </TableCell>

                    <TableCell>
                      <span className="inline-block rounded-full bg-stone-100 text-stone-700 px-2 py-0.5 text-xs font-medium border">
                        {item.origin || "—"}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={item.ingredients}>
                      {item.ingredients || "—"}
                    </TableCell>

                    {/* Địa điểm gợi ý */}
                    <TableCell className="text-xs max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {item.cuisine_places && item.cuisine_places.length > 0 ? (
                          item.cuisine_places.map((cp) => (
                            <span
                              key={cp.id}
                              className="inline-flex items-center gap-0.5 rounded bg-indigo-50 border border-indigo-150 text-indigo-750 px-2 py-0.5 text-[11px] font-medium"
                            >
                              <MapPin size={10} className="text-indigo-650 shrink-0" />
                              {cp.place?.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate" title={item.description}>
                      {item.description || "—"}
                    </TableCell>

                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                        disabled={isMutating}
                      >
                        <Edit2 size={14} className="mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        disabled={isMutating}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy món ăn nào khớp với từ khóa tìm kiếm.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium text-foreground">{pagedItems.length}</span> trên tổng số{" "}
                    <span className="font-medium text-foreground">{filteredItems.length}</span> đặc sản.
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-2xl relative border overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground rounded-lg p-1 hover:bg-muted"
            >
              <X size={20} />
            </button>

            <h2 className="mb-4 text-lg font-semibold pr-8">
              {selectedItem ? "Cập nhật thông tin ẩm thực" : "Thêm ẩm thực mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tên món ăn */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Tên món ăn *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Bún chả Hà Nội, Bánh mì Hội An..."
                  disabled={isMutating}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Nguồn gốc */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Nguồn gốc vùng miền *</label>
                <Input
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Hà Nội, Quảng Nam, Nam Bộ..."
                  disabled={isMutating}
                />
                {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
              </div>

              {/* Nguyên liệu */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Nguyên liệu đặc trưng</label>
                <Input
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="Ngăn cách bằng dấu phẩy, ví dụ: Thịt ba chỉ, đu đủ, rau thơm..."
                  disabled={isMutating}
                />
              </div>

              {/* Địa điểm gợi ý thưởng thức (Recommendations) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Địa điểm gợi ý thưởng thức (Đã chọn: {selectedLocations.length})
                </label>

                {/* List địa điểm đã chọn */}
                {selectedLocations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-dashed rounded-lg mb-2">
                    {selectedLocations.map((loc) => (
                      <div
                        key={loc.id}
                        className="flex items-center gap-1.5 rounded bg-indigo-50 border border-indigo-150 px-2 py-1 text-xs text-indigo-750 font-medium"
                      >
                        <MapPin size={12} className="text-indigo-650 shrink-0" />
                        <span className="truncate max-w-[120px]" title={loc.name}>
                          {loc.name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedLocations((prev) => prev.filter((l) => l.id !== loc.id))
                          }
                          className="rounded-full hover:bg-indigo-100 text-indigo-500 hover:text-indigo-750 p-0.5 shrink-0"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ô tìm kiếm địa điểm */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search size={14} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Tìm địa điểm để đề xuất..."
                    className="w-full h-9 rounded-lg border border-input pl-9 pr-8 text-sm bg-transparent outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />

                  {isSearchingLocation && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <Loader2 size={14} className="animate-spin text-slate-400" />
                    </div>
                  )}

                  {/* Dropdown kết quả tìm kiếm */}
                  {locationResults.length > 0 && (
                    <div className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-lg border border-input bg-background py-1 shadow-lg">
                      {locationResults.map((loc) => {
                        const isAlreadySelected = selectedLocations.some((l) => l.id === loc.id);
                        return (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => {
                              if (!isAlreadySelected) {
                                setSelectedLocations((prev) => [...prev, loc]);
                              }
                              setLocationQuery("");
                              setLocationResults([]);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-secondary transition-colors flex flex-col gap-0.5"
                            disabled={isAlreadySelected}
                          >
                            <span
                              className={`text-xs font-semibold ${
                                isAlreadySelected ? "text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {loc.name} {isAlreadySelected && "(Đã chọn)"}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                              {loc.address}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Mô tả chi tiết</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Mô tả về cách chế biến, hương vị đặc sản..."
                  disabled={isMutating}
                />
              </div>

              {/* Ảnh */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Ảnh minh họa</label>
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isMutating || uploadingImage}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-1.5 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#B8922E] file:text-white
                      hover:file:bg-[#a67d22]
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {formData.image_url && (
                  <div className="mb-3">
                    <img
                      src={formData.image_url}
                      alt="preview"
                      className="h-28 w-28 object-cover rounded-lg border"
                    />
                  </div>
                )}

                <Input
                  name="image_url"
                  value={formData.image_url.startsWith("data:") ? "" : formData.image_url}
                  onChange={handleInputChange}
                  placeholder="Hoặc dán URL ảnh trực tiếp"
                  disabled={isMutating || uploadingImage}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isMutating || uploadingImage}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isMutating || uploadingImage}
                  className="bg-[#B8922E] hover:bg-[#a67d22]"
                >
                  {uploadingImage
                    ? "Đang tải ảnh..."
                    : isMutating
                    ? "Đang lưu..."
                    : selectedItem
                    ? "Cập nhật"
                    : "Thêm mới"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
