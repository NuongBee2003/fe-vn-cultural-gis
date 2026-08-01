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
import { ImageOff, Loader2, Search, Edit2, Trash2, Plus, X } from "lucide-react";
import {
  getFolkArts,
  createFolkArt,
  updateFolkArt,
  deleteFolkArt,
} from "@/api/user/cultureApi";
import { uploadImageToSupabase, deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS, IMAGE_UPLOAD_CONFIG } from "@/constants/supabaseConfig";

export default function FolkArtManagementPage() {
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
    history: "",
    instruments: "",
    image_url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});

  async function loadData() {
    try {
      setLoading(true);
      const data = await getFolkArts();
      setItems(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nghệ thuật dân gian:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filter & Search
  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name?.toLowerCase().includes(q) ||
      item.history?.toLowerCase().includes(q) ||
      item.instruments?.toLowerCase().includes(q) ||
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
      history: "",
      instruments: "",
      image_url: "",
    });
    setSelectedFile(null);
    setErrors({});
    setIsOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      history: item.history || "",
      instruments: item.instruments || "",
      image_url: item.image_url || "",
    });
    setSelectedFile(null);
    setErrors({});
    setIsOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nghệ thuật dân gian "${item.name}" không?`)) {
      try {
        setIsMutating(true);
        if (item.image_url && item.image_url.includes("supabase.co")) {
          try {
            await deleteImageFromSupabase(item.image_url, SUPABASE_BUCKETS.FOLK_ART_IMAGES);
          } catch (imgErr) {
            console.error("Lỗi khi xóa ảnh trên Supabase:", imgErr);
          }
        }
        await deleteFolkArt(item.id);
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
    if (!formData.name.trim()) errs.name = "Tên nghệ thuật không được để trống";
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
        imageUrl = await uploadImageToSupabase(selectedFile, SUPABASE_BUCKETS.FOLK_ART_IMAGES);
        setUploadingImage(false);
      }

      // Xóa ảnh cũ trên Supabase nếu ảnh mới khác ảnh cũ
      if (selectedItem && selectedItem.image_url && selectedItem.image_url !== imageUrl && selectedItem.image_url.includes("supabase.co")) {
        try {
          await deleteImageFromSupabase(selectedItem.image_url, SUPABASE_BUCKETS.FOLK_ART_IMAGES);
        } catch (imgErr) {
          console.error("Lỗi khi xóa ảnh cũ trên Supabase:", imgErr);
        }
      }

      const payload = {
        ...formData,
        image_url: imageUrl,
      };

      if (selectedItem) {
        await updateFolkArt(selectedItem.id, payload);
      } else {
        await createFolkArt(payload);
      }

      setIsOpen(false);
      loadData();
    } catch (err) {
      alert("Lỗi khi lưu nghệ thuật dân gian: " + err.message);
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
          <h1 className="text-xl font-semibold">Quản lý nghệ thuật dân gian</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách nghệ thuật dân gian, di sản phi vật thể và làng nghề thủ công của Việt Nam.
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
                  placeholder="Tìm kiếm nghệ thuật..."
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
            Thêm nghệ thuật
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="animate-spin h-8 w-8 text-[#B8922E]" />
              <p className="text-sm">Đang tải danh sách nghệ thuật...</p>
            </div>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="w-32">Hình ảnh</TableHead>
                <TableHead className="w-48">Tên nghệ thuật / Làng nghề</TableHead>
                <TableHead className="w-48">Nhạc cụ / Đạo cụ / Địa phương</TableHead>
                <TableHead className="w-48">Lịch sử</TableHead>
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
                        <div className="w-20 h-20 rounded-lg overflow-hidden border">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-slate-100 border border-dashed">
                          <ImageOff size={16} className="text-gray-400 mb-1" />
                          <span className="text-[9px] text-gray-500">No image</span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-semibold text-foreground">
                      {item.name}
                    </TableCell>

                    <TableCell className="text-xs">
                      <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-medium border border-emerald-100">
                        {item.instruments || "—"}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate" title={item.history}>
                      {item.history || "—"}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate" title={item.description}>
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
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy nghệ thuật nào khớp với từ khóa tìm kiếm.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium text-foreground">{pagedItems.length}</span> trên tổng số{" "}
                    <span className="font-medium text-foreground">{filteredItems.length}</span> nghệ thuật/làng nghề.
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
              {selectedItem ? "Cập nhật nghệ thuật dân gian" : "Thêm nghệ thuật mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tên nghệ thuật */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Tên nghệ thuật / Làng nghề *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Nghệ thuật Đờn ca tài tử, Làng tranh Đông Hồ..."
                  disabled={isMutating}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Nhạc cụ / đạo cụ / địa phương */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Nhạc cụ / Đạo cụ / Địa phương</label>
                <Input
                  name="instruments"
                  value={formData.instruments}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Đàn tranh, Đàn bầu, Giấy điệp, Tỉnh Bắc Ninh..."
                  disabled={isMutating}
                />
              </div>

              {/* Lịch sử */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Lịch sử hình thành</label>
                <textarea
                  name="history"
                  value={formData.history}
                  onChange={handleInputChange}
                  rows={3}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Nguồn gốc lịch sử, sự phát triển qua các thời kỳ..."
                  disabled={isMutating}
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Mô tả ngắn</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Đặc điểm nổi bật, ý nghĩa văn hóa phi vật thể..."
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
