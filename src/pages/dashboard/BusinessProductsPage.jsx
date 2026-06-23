import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, RefreshCw, X } from "lucide-react";
import { productApi } from "@/api/productApi";
import { subscriptionApi } from "@/api/subscriptionApi";
import { authApi } from "@/api/authApi";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";

export default function BusinessProductsPage() {
  const [products, setProducts] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    affiliate_url: ""
  });

  const user = authApi.getUser();

  const fetchProductsAndLimits = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch active subscription
      const sub = await subscriptionApi.getMyActive();
      setActiveSub(sub);

      // 2. Fetch products
      const res = await productApi.getAll('', 1, 1000, user.id);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndLimits();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      affiliate_url: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ? Math.round(Number(product.price)).toString() : "",
      image_url: product.image_url || "",
      affiliate_url: product.affiliate_url || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) {
      return;
    }
    try {
      await productApi.delete(id);
      alert("Xóa sản phẩm thành công!");
      fetchProductsAndLimits();
    } catch (err) {
      alert(err.message || "Xóa sản phẩm thất bại");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Vui lòng điền tên và giá sản phẩm!");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price)
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, payload);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await productApi.create(payload);
        alert("Đăng sản phẩm thành công!");
      }
      setIsModalOpen(false);
      fetchProductsAndLimits();
    } catch (err) {
      alert(err.message || "Lưu sản phẩm thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-2 text-sm text-muted-foreground">Đang tải danh sách sản phẩm...</span>
      </div>
    );
  }

  const maxProducts = activeSub?.package?.max_products ?? 3;
  const limitsReached = products.length >= maxProducts;

  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
            Quản lý sản phẩm shop
          </h1>
          <p className="text-sm text-muted-foreground">
            Danh sách các sản phẩm đang hiển thị tại gian hàng công cộng và link mua affiliate.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={openAddModal}
            disabled={limitsReached && !authApi.isAdmin()}
            className="flex items-center gap-1.5 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Đăng sản phẩm mới
          </Button>
        </div>
      </div>

      {/* Package Limits Alert */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-amber-500/20 bg-amber-50/50 p-4 text-sm text-amber-800">
        <div>
          Bạn đang sử dụng gói <strong className="text-amber-900">{activeSub?.package?.name || "Free"}</strong>. 
          Giới hạn sản phẩm: <strong className="text-amber-900">{products.length} / {maxProducts}</strong>.
        </div>
        {limitsReached && !authApi.isAdmin() && (
          <span className="font-semibold text-red-600">
            Bạn đã đạt giới hạn! Hãy nâng cấp gói để tiếp tục đăng thêm.
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Product List Grid */}
      {products.length === 0 ? (
        <div className="mt-12 text-center py-12 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <PackageOpen className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-sm font-semibold text-slate-800">Chưa có sản phẩm nào</h3>
          <p className="mt-1 text-sm text-slate-400">Hãy nhấn nút Đăng sản phẩm mới để tạo sản phẩm đầu tiên của bạn.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100 border">
                  {p.image_url ? (
                    <img 
                      src={p.image_url} 
                      alt={p.name} 
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <PackageOpen className="h-12 w-12" />
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-slate-800 line-clamp-1">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 h-8">{p.description || "Không có mô tả"}</p>
                  <p className="mt-2 text-sm font-semibold text-amber-600">
                    {Number(p.price).toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2">
                {p.affiliate_url ? (
                  <a 
                    href={p.affiliate_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    Link mua <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400">Không có link affiliate</span>
                )}
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => openEditModal(p)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 border"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id, p.name)}
                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 border border-red-100"
                    title="Xóa"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-bold text-slate-800">
                {editingProduct ? "Chỉnh sửa sản phẩm" : "Đăng sản phẩm mới"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên sản phẩm *</label>
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Nón lá thêu tay truyền thống"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả sản phẩm</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả tóm tắt về sản phẩm..."
                  className="w-full min-h-[80px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Giá sản phẩm (VNĐ) *</label>
                  <Input 
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 120000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Link hình ảnh (URL)</label>
                  <Input 
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Link mua Affiliate (Shopee, Lazada,...)</label>
                <Input 
                  name="affiliate_url"
                  value={formData.affiliate_url}
                  onChange={handleInputChange}
                  placeholder="https://shopee.vn/..."
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Khi người dùng mua sắm, nút mua sẽ chuyển hướng họ đến link này.
                </span>
              </div>

              {/* Form Buttons */}
              <div className="mt-6 border-t pt-4 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-amber-500 text-white hover:bg-amber-600 px-5"
                >
                  {submitting ? "Đang lưu..." : "Lưu lại"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
