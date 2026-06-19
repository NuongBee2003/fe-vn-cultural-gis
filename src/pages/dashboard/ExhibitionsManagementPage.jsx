import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button/button";
import Pagination from "@/components/ui/pagination/Pagination";
import { Input } from "@/components/ui/input/input";
import { useNotify } from "@/context/NotifyContext";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table-data/table";
import {
  ImageOff,
  Loader2,
  Search,
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  MapPin,
  Eye,
} from "lucide-react";
import {
  getAdminExhibitions,
  createExhibition,
  updateExhibition,
  deleteExhibition,
  reviewExhibition,
} from "@/api/exhibitionApi";
import { uploadImageToSupabase, deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS, IMAGE_UPLOAD_CONFIG } from "@/constants/supabaseConfig";
import { ALL_PROVINCES } from "@/constants/provinces";

export default function ExhibitionsManagementPage() {
  const notify = useNotify();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isMutating, setIsMutating] = useState(false);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "place",
    style_tag: "",
    place_name: "",
    province: "Hà Nội",
    image_url: "",
    status: "pending",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});

  async function loadData() {
    try {
      setLoading(true);
      const data = await getAdminExhibitions(statusFilter === "all" ? undefined : statusFilter);
      setItems(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách triển lãm:", error);
      notify.error("Không thể tải danh sách triển lãm ảo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  // Handle Review (Approve/Reject)
  const handleReview = async (id, status) => {
    const actionText = status === "accepted" ? "duyệt" : "từ chối";
    const ok = await notify.confirm(`Bạn có chắc chắn muốn ${actionText} tác phẩm này?`, {
      title: "Xác nhận thao tác",
      confirmLabel: actionText.charAt(0).toUpperCase() + actionText.slice(1),
    });
    if (!ok) return;

    try {
      setIsMutating(true);
      await reviewExhibition(id, status);
      notify.success(`Đã ${actionText} tác phẩm triển lãm!`);
      loadData();
    } catch (err) {
      notify.error(`Lỗi khi ${actionText} triển lãm: ${err.message}`);
    } finally {
      setIsMutating(false);
    }
  };

  // Handle Delete
  const handleDelete = async (item) => {
    const ok = await notify.confirm(`Bạn có chắc chắn muốn xóa tác phẩm "${item.title}" không?`, {
      title: "Xóa tác phẩm",
      confirmLabel: "Xóa",
    });
    if (!ok) return;

    try {
      setIsMutating(true);
      if (item.image_url && item.image_url.includes("supabase.co")) {
        try {
          await deleteImageFromSupabase(item.image_url, SUPABASE_BUCKETS.EXHIBITION_IMAGES);
        } catch (imgErr) {
          console.error("Lỗi khi xóa ảnh trên Supabase:", imgErr);
        }
      }
      await deleteExhibition(item.id);
      notify.success("Đã xóa tác phẩm triển lãm.");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (error) {
      notify.error("Xóa thất bại: " + error.message);
    } finally {
      setIsMutating(false);
    }
  };

  // Filter & Search
  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const authorName = item.user?.username || "";
    return (
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.province?.toLowerCase().includes(q) ||
      item.place_name?.toLowerCase().includes(q) ||
      authorName.toLowerCase().includes(q)
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
      title: "",
      description: "",
      category: "place",
      style_tag: "",
      place_name: "",
      province: ALL_PROVINCES[0] || "Hà Nội",
      image_url: "",
      status: "accepted", // Admin thêm trực tiếp thì mặc định accepted
    });
    setSelectedFile(null);
    setErrors({});
    setIsOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "place",
      style_tag: item.style_tag || "",
      place_name: item.place_name || "",
      province: item.province || "Hà Nội",
      image_url: item.image_url || "",
      status: item.status || "pending",
    });
    setSelectedFile(null);
    setErrors({});
    setIsOpen(true);
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
      notify.error(err.message);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Tiêu đề không được để trống";
    if (!formData.description.trim()) errs.description = "Mô tả không được để trống";
    if (!formData.province.trim()) errs.province = "Tỉnh thành không được để trống";
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
        imageUrl = await uploadImageToSupabase(selectedFile, SUPABASE_BUCKETS.EXHIBITION_IMAGES);
        setUploadingImage(false);
      }

      if (!imageUrl) {
        notify.error("Vui lòng tải lên ảnh minh họa hoặc nhập đường dẫn ảnh.");
        setIsMutating(false);
        return;
      }

      // Xóa ảnh cũ trên Supabase nếu ảnh mới khác ảnh cũ
      if (selectedItem && selectedItem.image_url && selectedItem.image_url !== imageUrl && selectedItem.image_url.includes("supabase.co")) {
        try {
          await deleteImageFromSupabase(selectedItem.image_url, SUPABASE_BUCKETS.EXHIBITION_IMAGES);
        } catch (imgErr) {
          console.error("Lỗi khi xóa ảnh cũ trên Supabase:", imgErr);
        }
      }

      const payload = {
        ...formData,
        image_url: imageUrl,
      };

      if (selectedItem) {
        await updateExhibition(selectedItem.id, payload);
        notify.success("Cập nhật triển lãm thành công!");
      } else {
        await createExhibition(payload);
        notify.success("Thêm triển lãm thành công!");
      }

      setIsOpen(false);
      loadData();
    } catch (err) {
      notify.error("Lỗi khi lưu triển lãm: " + err.message);
    } finally {
      setIsMutating(false);
      setUploadingImage(false);
    }
  };

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

  const getCategoryLabel = (category) => {
    switch (category) {
      case "place": return "Địa điểm";
      case "food": return "Ẩm thực";
      case "festival": return "Lễ hội";
      default: return category;
    }
  };

  return (
    <main className="px-6 py-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý triển lãm ảo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản trị các tác phẩm triển lãm văn hóa kỹ thuật số của người dùng và hệ thống.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="grid gap-3 sm:grid-cols-[minmax(200px,1fr)_auto_auto]">
            {/* Tìm kiếm */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Tìm kiếm</span>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm tiêu đề, địa danh, tỉnh thành..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-9"
                />
              </div>
            </label>

            {/* Trạng thái */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Trạng thái</span>
              <select
                className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer"
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

            {/* Hàng / Trang */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Hàng / trang</span>
              <select
                className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer"
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
            Thêm triển lãm
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="animate-spin h-8 w-8 text-[#B8922E]" />
              <p className="text-sm">Đang tải danh sách triển lãm...</p>
            </div>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead className="w-20">Hình ảnh</TableHead>
                <TableHead className="w-48">Tiêu đề</TableHead>
                <TableHead className="w-24">Người đăng</TableHead>
                <TableHead className="w-28">Danh mục</TableHead>
                <TableHead className="w-28">Địa điểm / Tỉnh</TableHead>
                <TableHead className="w-24">Trạng thái</TableHead>
                <TableHead>Mô tả ngắn</TableHead>
                <TableHead className="text-right w-44">Hành động</TableHead>
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
                        <div className="w-12 h-12 rounded-lg overflow-hidden border">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-100 border border-dashed">
                          <ImageOff size={14} className="text-gray-400" />
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-semibold text-foreground">
                      {item.title}
                      {item.style_tag && (
                        <span className="block text-[10px] font-normal text-muted-foreground">
                          Style: {item.style_tag}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-sm">
                      {item.user?.username || "Hệ thống"}
                    </TableCell>

                    <TableCell className="text-xs font-medium">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 border">
                        {getCategoryLabel(item.category)}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="flex flex-col gap-0.5">
                        {item.place_name && (
                          <span className="font-medium text-slate-700 flex items-center gap-0.5">
                            <MapPin size={10} className="shrink-0 text-slate-400" />
                            {item.place_name}
                          </span>
                        )}
                        <span className="text-muted-foreground">{item.province}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate" title={item.description}>
                      {item.description}
                    </TableCell>

                    <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                      {item.status !== "accepted" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                          onClick={() => handleReview(item.id, "accepted")}
                          disabled={isMutating}
                        >
                          <Check size={12} className="mr-0.5" /> Duyệt
                        </Button>
                      )}
                      {item.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200"
                          onClick={() => handleReview(item.id, "rejected")}
                          disabled={isMutating}
                        >
                          <X size={12} className="mr-0.5" /> Từ chối
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                        disabled={isMutating}
                      >
                        <Edit2 size={12} className="mr-0.5" /> Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        disabled={isMutating}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy tác phẩm triển lãm nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium text-foreground">{pagedItems.length}</span> trên tổng số{" "}
                    <span className="font-medium text-foreground">{filteredItems.length}</span> tác phẩm triển lãm.
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
              {selectedItem ? "Cập nhật triển lãm ảo" : "Thêm triển lãm ảo mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Tiêu đề tác phẩm *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Đêm phố cổ Hội An, Bánh mì kẹp truyền thống..."
                  disabled={isMutating}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Danh mục *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer"
                    disabled={isMutating}
                  >
                    <option value="place">Địa điểm</option>
                    <option value="food">Ẩm thực</option>
                    <option value="festival">Lễ hội</option>
                  </select>
                </div>

                {/* Tỉnh thành */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Tỉnh thành *</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer max-h-48"
                    disabled={isMutating}
                  >
                    {ALL_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Tên địa danh */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Tên địa danh (nếu có)</label>
                  <Input
                    name="place_name"
                    value={formData.place_name}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Hồ Hoàn Kiếm, Chùa Cầu..."
                    disabled={isMutating}
                  />
                </div>

                {/* Style tag */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Nhãn phong cách (tag)</label>
                  <Input
                    name="style_tag"
                    value={formData.style_tag}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Di tích quốc gia, Phố cổ..."
                    disabled={isMutating}
                  />
                </div>
              </div>

              {/* Trạng thái duyệt - chỉ admin tạo/sửa mới đổi được */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Trạng thái duyệt *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer"
                  disabled={isMutating}
                >
                  <option value="pending">Chờ duyệt (Pending)</option>
                  <option value="accepted">Đã duyệt (Accepted)</option>
                  <option value="rejected">Bị từ chối (Rejected)</option>
                </select>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Mô tả tác phẩm *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Mô tả chi tiết và ý nghĩa văn hóa của tác phẩm..."
                  disabled={isMutating}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              {/* Ảnh */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Ảnh minh họa *</label>
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
