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
  getCustoms,
  createCustom,
  updateCustom,
  deleteCustom,
} from "@/api/user/cultureApi";
import { uploadImageToSupabase, deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS, IMAGE_UPLOAD_CONFIG } from "@/constants/supabaseConfig";

export default function CustomManagementPage() {
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
    time_period: "",
    rituals: "",
    image_url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});

  async function loadData() {
    try {
      setLoading(true);
      const data = await getCustoms();
      setItems(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phong tục tập quán:", error);
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
      item.time_period?.toLowerCase().includes(q) ||
      item.rituals?.toLowerCase().includes(q) ||
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
      time_period: "",
      rituals: "",
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
      time_period: item.time_period || "",
      rituals: item.rituals || "",
      image_url: item.image_url || "",
    });
    setSelectedFile(null);
    setErrors({});
    setIsOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phong tục "${item.name}" không?`)) {
      try {
        setIsMutating(true);
        if (item.image_url && item.image_url.includes("supabase.co")) {
          try {
            await deleteImageFromSupabase(item.image_url, SUPABASE_BUCKETS.CUSTOM_IMAGES);
          } catch (imgErr) {
            console.error("Lỗi khi xóa ảnh trên Supabase:", imgErr);
          }
        }
        await deleteCustom(item.id);
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
    if (!formData.name.trim()) errs.name = "Tên phong tục không được để trống";
    if (!formData.time_period.trim()) errs.time_period = "Vui lòng nhập thời gian diễn ra";
    
    if (!formData.rituals || !formData.rituals.trim()) {
      errs.rituals = "Các nghi lễ không được để trống và phải phân tách bằng kí tự ' -> ' (Ví dụ: Chuẩn bị -> Làm lễ -> Thụ lộc)";
    } else if (!formData.rituals.includes(" -> ")) {
      errs.rituals = "Các nghi lễ phải được phân tách bằng kí tự ' -> ' (Ví dụ: Chuẩn bị -> Làm lễ -> Thụ lộc)";
    } else {
      const parts = formData.rituals.split(" -> ");
      if (parts.some((part) => !part.trim())) {
        errs.rituals = "Các bước nghi lễ không được để trống ở giữa các kí tự ' -> '";
      }
    }

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
        imageUrl = await uploadImageToSupabase(selectedFile, SUPABASE_BUCKETS.CUSTOM_IMAGES);
        setUploadingImage(false);
      }

      // Xóa ảnh cũ trên Supabase nếu ảnh mới khác ảnh cũ
      if (selectedItem && selectedItem.image_url && selectedItem.image_url !== imageUrl && selectedItem.image_url.includes("supabase.co")) {
        try {
          await deleteImageFromSupabase(selectedItem.image_url, SUPABASE_BUCKETS.CUSTOM_IMAGES);
        } catch (imgErr) {
          console.error("Lỗi khi xóa ảnh cũ trên Supabase:", imgErr);
        }
      }

      const payload = {
        ...formData,
        image_url: imageUrl,
      };

      if (selectedItem) {
        await updateCustom(selectedItem.id, payload);
      } else {
        await createCustom(payload);
      }

      setIsOpen(false);
      loadData();
    } catch (err) {
      alert("Lỗi khi lưu phong tục: " + err.message);
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
          <h1 className="text-xl font-semibold">Quản lý phong tục tập quán</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách phong tục, nghi lễ và tập quán truyền thống của Việt Nam.
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
                  placeholder="Tìm kiếm phong tục..."
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
            Thêm phong tục
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="animate-spin h-8 w-8 text-[#B8922E]" />
              <p className="text-sm">Đang tải danh sách phong tục...</p>
            </div>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="w-32">Hình ảnh</TableHead>
                <TableHead className="w-48">Tên phong tục</TableHead>
                <TableHead className="w-40">Thời gian</TableHead>
                <TableHead className="w-48">Nghi lễ & hoạt động</TableHead>
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

                    <TableCell>
                      <span className="inline-block rounded-full bg-[#B8922E]/10 text-[#B8922E] px-2.5 py-0.5 text-xs font-medium border border-[#B8922E]/20">
                        {item.time_period || "—"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-muted-foreground max-w-[200px] whitespace-normal line-clamp-2" title={item.rituals}>
                        {item.rituals || "—"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-[300px] whitespace-normal line-clamp-2" title={item.description}>
                        {item.description || "—"}
                      </div>
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
                    Không tìm thấy phong tục nào khớp với từ khóa tìm kiếm.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium text-foreground">{pagedItems.length}</span> trên tổng số{" "}
                    <span className="font-medium text-foreground">{filteredItems.length}</span> phong tục.
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
              {selectedItem ? "Cập nhật phong tục tập quán" : "Thêm phong tục mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tên phong tục */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Tên phong tục <span className="text-red-500">*</span></label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Rước nước đền Hùng, Gói bánh chưng ngày Tết..."
                  disabled={isMutating}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Thời gian */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Thời gian diễn ra <span className="text-red-500">*</span></label>
                <Input
                  name="time_period"
                  value={formData.time_period}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Tết Nguyên Đán, Tháng 3 âm lịch, Hằng năm..."
                  disabled={isMutating}
                />
                {errors.time_period && <p className="text-xs text-red-500 mt-1">{errors.time_period}</p>}
              </div>

              {/* Nghi lễ chính */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Các nghi lễ & hoạt động chính <span className="text-red-500">*</span></label>
                <Input
                  name="rituals"
                  value={formData.rituals}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Chuẩn bị lễ vật -> Làm lễ khấn -> Thụ lộc..."
                  disabled={isMutating}
                />
                {errors.rituals && <p className="text-xs text-red-500 mt-1">{errors.rituals}</p>}
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
                  placeholder="Ý nghĩa, nguồn gốc và lịch sử của phong tục tập quán này..."
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
