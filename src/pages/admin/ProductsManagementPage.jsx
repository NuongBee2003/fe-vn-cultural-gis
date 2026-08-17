import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, RefreshCw, X, PackageOpen, Search } from "lucide-react";
import { productApi } from "@/api/business/productApi";
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
import { uploadImageToSupabase, deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS } from "@/constants/supabaseConfig";

const PAGE_SIZES = [5, 10, 15, 20];

export default function ProductsManagementPage() {
  const notify = useNotify();
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Pagination & Search States
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    affiliate_url: "",
    category: "custom",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch products from database
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all products (passing null for userId to fetch all)
      const res = await productApi.getAll(search, page, pageSize, null);
      setProducts(res.data || []);
      if (res.meta) {
        setTotalCount(res.meta.total || 0);
      } else {
        setTotalCount(res.data?.length || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err);
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize]);

  // Debounced/Triggered search handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setSelectedFile(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      affiliate_url: "",
      category: "custom",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setSelectedFile(null);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ? Math.round(Number(product.price)).toString() : "",
      image_url: product.image_url || "",
      affiliate_url: product.affiliate_url || "",
      category: product.category || "custom",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name, imageUrl) => {
    const ok = await notify.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`, {
      title: "Xóa sản phẩm",
      confirmLabel: "Xóa",
    });
    if (!ok) return;
    try {
      if (imageUrl && imageUrl.includes("supabase.co")) {
        try {
          await deleteImageFromSupabase(imageUrl, SUPABASE_BUCKETS.PRODUCT_IMAGES);
        } catch (imgErr) {
          console.error("Lỗi khi xóa ảnh sản phẩm trên Supabase:", imgErr);
        }
      }
      await productApi.delete(id);
      notify.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      notify.error(err.message || "Xóa sản phẩm thất bại");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Định dạng file không hỗ trợ. Hãy chọn ảnh JPEG, PNG, WEBP hoặc SVG.");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Kích thước file vượt quá giới hạn 5MB.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      notify.error("Vui lòng điền tên và giá sản phẩm!");
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        setUploadingImage(true);
        imageUrl = await uploadImageToSupabase(selectedFile, SUPABASE_BUCKETS.PRODUCT_IMAGES);
        setUploadingImage(false);
      }

      // Delete old image on Supabase if new image is uploaded/different
      if (
        editingProduct &&
        editingProduct.image_url &&
        editingProduct.image_url !== imageUrl &&
        editingProduct.image_url.includes("supabase.co")
      ) {
        try {
          await deleteImageFromSupabase(editingProduct.image_url, SUPABASE_BUCKETS.PRODUCT_IMAGES);
        } catch (imgErr) {
          console.error("Lỗi khi xóa ảnh cũ trên Supabase:", imgErr);
        }
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        image_url: imageUrl,
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, payload);
        notify.success("Cập nhật sản phẩm thành công!");
      } else {
        await productApi.create(payload);
        notify.success("Đăng sản phẩm thành công!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      notify.error(err.message || "Lưu sản phẩm thất bại");
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const activePage = Math.min(page, totalPages);

  return (
    <main className="px-6 py-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý sản phẩm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách tất cả sản phẩm di sản, thủ công mỹ nghệ hiển thị trên cửa hàng.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 items-end">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Tìm kiếm</span>
              <div className="relative">
                <Input
                  placeholder="Tên sản phẩm..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Search size={16} />
                </button>
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Số hàng / trang</span>
              <select
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </form>

          <Button
            onClick={openAddModal}
            className="bg-[#B8922E] hover:bg-[#a67d22] text-white h-8"
          >
            <Plus size={16} className="mr-1.5" /> Tạo sản phẩm
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-900/30 bg-red-950/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Product List Table */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-background shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-[#B8922E]" />
            <span className="ml-2 text-sm text-muted-foreground">Đang tải danh sách sản phẩm...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <PackageOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-sm font-semibold">Chưa có sản phẩm nào</h3>
            <p className="mt-1 text-sm text-muted-foreground">Hãy tạo sản phẩm mới đầu tiên của bạn.</p>
          </div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-20">Hình ảnh</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="max-w-xs">Mô tả</TableHead>
                <TableHead>Giá (VNĐ)</TableHead>
                <TableHead>Liên kết mua</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{(activePage - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>
                    <div className="relative aspect-square w-12 h-12 overflow-hidden rounded-md border bg-muted">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <PackageOpen size={16} />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#B8922E]/10 text-[#B8922E]">
                      {product.category === 'combo' ? 'Combo nghệ thuật' :
                       product.category === 'hat' ? 'Nón nghệ thuật' :
                       product.category === 'bag' ? 'Túi cỏ bàng' :
                       product.category === 'artwork' ? 'Tranh nghệ thuật' :
                       product.category === 'accessory' ? 'Phụ kiện' : 'Doanh nghiệp'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs whitespace-normal line-clamp-2" title={product.description}>
                      {product.description || "—"}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-amber-700">
                    {Number(product.price).toLocaleString("vi-VN")} ₫
                  </TableCell>
                  <TableCell>
                    {product.affiliate_url ? (
                      <a
                        href={product.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-amber-600 hover:underline"
                      >
                        Link mua <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Không có</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(product)}
                      disabled={submitting}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id, product.name, product.image_url)}
                      disabled={submitting}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Hiển thị {products.length} trên tổng số {totalCount} sản phẩm
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={activePage === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      >
                        Trang trước
                      </Button>
                      <span className="text-sm text-foreground font-medium">
                        {activePage} / {totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={activePage === totalPages}
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border bg-background shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-foreground">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-bold">
                {editingProduct ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Tên sản phẩm *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Nón lá thêu tay nghệ thuật"
                  required
                  disabled={submitting || uploadingImage}
                  className="bg-transparent border-input placeholder:text-muted-foreground focus-visible:border-[#B8922E] focus-visible:ring-[#B8922E]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Mô tả sản phẩm</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả tóm tắt về sản phẩm..."
                  disabled={submitting || uploadingImage}
                  className="w-full min-h-[80px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-[#B8922E] focus-visible:ring-3 focus-visible:ring-[#B8922E]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Giá sản phẩm (VNĐ) *</label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 250000"
                  required
                  disabled={submitting || uploadingImage}
                  className="bg-transparent border-input placeholder:text-muted-foreground focus-visible:border-[#B8922E] focus-visible:ring-[#B8922E]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Phân loại sản phẩm *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={submitting || uploadingImage}
                  className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-[#B8922E] focus-visible:ring-3 focus-visible:ring-[#B8922E]/20"
                >
                  <option value="custom" className="bg-background">Sản phẩm doanh nghiệp (Doanh nghiệp)</option>
                  <option value="combo" className="bg-background">Combo nghệ thuật</option>
                  <option value="hat" className="bg-background">Nón nghệ thuật</option>
                  <option value="bag" className="bg-background">Túi cỏ bàng</option>
                  <option value="artwork" className="bg-background">Tranh nghệ thuật</option>
                  <option value="accessory" className="bg-background">Phụ kiện</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Ảnh sản phẩm</label>
                <div className="mb-2.5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={submitting || uploadingImage}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-1.5 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-[#B8922E]/10 file:text-[#B8922E]
                      hover:file:bg-[#B8922E]/20
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {formData.image_url && (
                  <div className="mb-2.5">
                    <img
                      src={formData.image_url}
                      alt="preview"
                      className="h-24 w-24 object-cover rounded-lg border bg-muted"
                    />
                  </div>
                )}

                <Input
                  name="image_url"
                  value={formData.image_url.startsWith("data:") ? "" : formData.image_url}
                  onChange={handleInputChange}
                  placeholder="Hoặc dán URL ảnh trực tiếp"
                  disabled={submitting || uploadingImage}
                  className="bg-transparent border-input placeholder:text-muted-foreground focus-visible:border-[#B8922E] focus-visible:ring-[#B8922E]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Link mua Affiliate (Shopee, Lazada,...)</label>
                <Input
                  name="affiliate_url"
                  value={formData.affiliate_url}
                  onChange={handleInputChange}
                  placeholder="https://shopee.vn/..."
                  disabled={submitting || uploadingImage}
                  className="bg-transparent border-input placeholder:text-muted-foreground focus-visible:border-[#B8922E] focus-visible:ring-[#B8922E]/20"
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Khi người dùng click mua sắm, họ sẽ được dẫn đến link liên kết này.
                </span>
              </div>

              {/* Form Buttons */}
              <div className="mt-6 border-t pt-4 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting || uploadingImage}
                  className="border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="bg-[#B8922E] hover:bg-[#a67d22] text-white px-5"
                >
                  {uploadingImage ? "Đang tải ảnh..." : submitting ? "Đang lưu..." : "Lưu lại"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
