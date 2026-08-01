import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import { MapPinned, PackageOpen, Award, Calendar, RefreshCw, XCircle, Store, Phone, User, Building } from "lucide-react";
import { subscriptionApi } from "@/api/business/subscriptionApi";
import { productApi } from "@/api/business/productApi";
import { authApi } from "@/api/user/authApi";
import { getAllPlaces } from "@/api/user/locationApi";
import { Button } from "@/components/ui/button/button";

export default function BusinessOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState(null);
  const [history, setHistory] = useState([]);
  const [placesCount, setPlacesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [error, setError] = useState(null);

  const user = authApi.getUser();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch active subscription
      const subData = await subscriptionApi.getMyActive();
      setActiveSub(subData);

      // 2. Fetch subscription history
      const historyData = await subscriptionApi.getMyHistory();
      setHistory(historyData);

      if (user) {
        // 3. Fetch products count for this user
        const prodData = await productApi.getAll('', 1, 1000, user.id);
        setProductsCount(Array.isArray(prodData.data) ? prodData.data.length : 0);

        // 4. Fetch places count for this user
        const placesData = await getAllPlaces(1, 1000, null, "", user.id);
        setPlacesCount(placesData.data?.length || 0);
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải thông tin tổng quan doanh nghiệp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelSub = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy gói dịch vụ hiện tại không? Sau khi hủy, tài khoản sẽ quay lại giới hạn gói mặc định.")) {
      return;
    }
    try {
      await subscriptionApi.cancel();
      alert("Hủy gói dịch vụ thành công!");
      fetchData();
    } catch (err) {
      alert(err.message || "Hủy gói dịch vụ thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-2 text-sm text-muted-foreground">Đang tải dữ liệu...</span>
      </div>
    );
  }

  const pkgName = activeSub?.package?.name || "Free";
  const maxPlaces = activeSub?.package?.max_places ?? (activeSub?.is_default ? 0 : 3);
  const maxProducts = activeSub?.package?.max_products ?? 3;
  const isDefault = activeSub?.is_default ?? true;

  const placesPercent = maxPlaces > 0 ? Math.min(100, Math.round((placesCount / maxPlaces) * 100)) : 100;
  const productsPercent = maxProducts > 0 ? Math.min(100, Math.round((productsCount / maxProducts) * 100)) : 100;

  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
            Tổng quan doanh nghiệp
          </h1>
          <p className="text-sm text-muted-foreground">
            Xin chào {user?.username || "Chủ cửa hàng"}, theo dõi giới hạn gói dịch vụ và các hoạt động kinh doanh của bạn tại đây.
          </p>
        </div>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5 border-amber-500/20 text-amber-600 hover:bg-amber-50"
        >
          <RefreshCw className="h-4 w-4" /> Làm mới
        </Button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Left Column Stack */}
        <div className="md:col-span-1 space-y-6">
          {/* Package Card */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-50/60 to-white p-6 shadow-sm hover:shadow-md transition-all text-slate-800">
            <div className="absolute -right-8 -top-8 text-amber-500/10">
              <Award className="h-32 w-32" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Gói hiện tại</p>
                <h2 className="text-xl font-bold text-slate-800">{pkgName}</h2>
              </div>
            </div>

            <div className="mt-6 space-y-3.5 border-t border-amber-500/10 pt-4 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> Ngày bắt đầu:</span>
                <span className="font-semibold text-slate-800">
                  {activeSub?.subscription?.start_date ? new Date(activeSub.subscription.start_date).toLocaleDateString("vi-VN") : "Hệ thống"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> Ngày hết hạn:</span>
                <span className="font-semibold text-slate-800">
                  {activeSub?.subscription?.end_date ? new Date(activeSub.subscription.end_date).toLocaleDateString("vi-VN") : "Không thời hạn"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-slate-400" /> Trạng thái gói:</span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${isDefault ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                  {isDefault ? 'Mặc định (Free)' : 'Đang hoạt động'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link to={PATHS.BUSINESS_PRICING} className="w-full">
                <Button className="w-full bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-500/10 py-2 font-medium">
                  Nâng cấp dịch vụ
                </Button>
              </Link>
              {!isDefault && (
                <Button 
                  onClick={handleCancelSub} 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <XCircle className="mr-1.5 h-4 w-4" /> Hủy gói dịch vụ
                </Button>
              )}
            </div>
          </div>

          {/* Business Info Card */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-50/60 to-white p-6 shadow-sm hover:shadow-md transition-all text-slate-800">
            <div className="absolute -right-8 -top-8 text-blue-500/10">
              <Store className="h-32 w-32" />
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Hồ sơ Doanh nghiệp</p>
                <h2 className="text-xl font-bold text-slate-800 truncate max-w-[200px]">{user?.business_name || "Chưa cập nhật"}</h2>
              </div>
            </div>

            <div className="mt-6 space-y-3.5 border-t border-blue-500/10 pt-4 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><Building className="h-4 w-4 text-slate-400" /> Doanh nghiệp:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">{user?.business_name || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-slate-400" /> Điện thoại:</span>
                <span className="font-semibold text-slate-800">{user?.business_phone || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-slate-400" /> Tài khoản:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">{user?.username || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Limits */}
        <div className="md:col-span-2 space-y-6">
          {/* Progress Indicators */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Places Limit Card */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <MapPinned className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Địa điểm di sản</h3>
                    <p className="text-xs text-muted-foreground">Giới hạn đăng địa điểm</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-800">{placesCount}</span>
                  <span className="text-sm text-slate-400"> / {maxPlaces}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Tiến trình sử dụng</span>
                  <span>{maxPlaces > 0 ? `${placesPercent}%` : "0%"}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-blue-500 transition-all duration-500" 
                    style={{ width: `${maxPlaces > 0 ? placesPercent : 0}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 text-right">
                <Link to="/business/places" className="text-xs font-semibold text-blue-600 hover:underline">
                  Quản lý địa điểm &rarr;
                </Link>
              </div>
            </div>

            {/* Products Limit Card */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                    <PackageOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Sản phẩm Shop</h3>
                    <p className="text-xs text-muted-foreground">Giới hạn sản phẩm</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-800">{productsCount}</span>
                  <span className="text-sm text-slate-400"> / {maxProducts}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Tiến trình sử dụng</span>
                  <span>{productsPercent}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${productsPercent}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 text-right">
                <Link to="/business/products" className="text-xs font-semibold text-emerald-600 hover:underline">
                  Quản lý sản phẩm &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          {isDefault && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
              <h4 className="font-bold text-blue-800">Quyền lợi khi nâng cấp lên gói Business Plus hoặc Premium:</h4>
              <ul className="mt-2.5 list-inside list-disc space-y-1.5 text-sm text-blue-700">
                <li>Bắt đầu hiển thị thương hiệu và địa điểm kinh doanh chi nhánh của bạn trên bản đồ.</li>
                <li>Đăng tải nhiều sản phẩm liên kết Shopee, Lazada tăng doanh số.</li>
                <li>Tạo các chiến dịch quảng bá địa danh văn hóa du lịch gắn liền với hoạt động kinh doanh.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* History Subscriptions */}
      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Lịch sử đăng ký dịch vụ</h3>
        <p className="text-sm text-muted-foreground mb-4">Danh sách các hóa đơn thanh toán và gói dịch vụ đã sử dụng.</p>

        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5 text-left">Gói dịch vụ</th>
                <th className="px-6 py-3.5 text-left">Ngày bắt đầu</th>
                <th className="px-6 py-3.5 text-left">Ngày kết thúc</th>
                <th className="px-6 py-3.5 className=text-left">Đơn giá</th>
                <th className="px-6 py-3.5 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700 bg-white">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    Chưa có lịch sử đăng ký dịch vụ nào.
                  </td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-800">{h.package?.name}</td>
                    <td className="px-6 py-4">{h.start_date ? new Date(h.start_date).toLocaleDateString("vi-VN") : "-"}</td>
                    <td className="px-6 py-4">{h.end_date ? new Date(h.end_date).toLocaleDateString("vi-VN") : "-"}</td>
                    <td className="px-6 py-4 font-medium">
                      {h.package?.price ? Number(h.package.price).toLocaleString("vi-VN") + " VNĐ" : "0 VNĐ"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        h.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        h.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        h.status === 'expired' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'
                      }`}>
                        {h.status === 'active' ? 'Hoạt động' :
                         h.status === 'pending' ? 'Chờ thanh toán' :
                         h.status === 'expired' ? 'Hết hạn' : 'Đã hủy'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
