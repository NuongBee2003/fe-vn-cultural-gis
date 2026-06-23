import React, { useEffect, useState } from "react";
import { Award, Check, RefreshCw } from "lucide-react";
import { subscriptionApi } from "@/api/subscriptionApi";
import { Button } from "@/components/ui/button/button";

const DEFAULT_PACKAGES = [
  {
    id: 1,
    name: "Free",
    price: 0,
    duration_days: 3650,
    max_places: 0,
    max_products: 3,
    description: "Dành cho cá nhân trải nghiệm du lịch văn hóa",
    features: [
      "Tối đa 0 địa điểm trên bản đồ",
      "Tối đa 3 sản phẩm trên Shop",
      "Sử dụng liên kết mua Affiliate link ngoài",
      "Xem bản đồ và đóng góp bài viết cộng đồng"
    ],
    bgGradient: "from-slate-50 to-slate-100/50 border-slate-200 text-slate-800",
    btnColor: "bg-slate-700 hover:bg-slate-800 text-white",
    badgeColor: "bg-slate-100 text-slate-700"
  },
  {
    id: 2,
    name: "Plus",
    price: 99000,
    duration_days: 30,
    max_places: 1,
    max_products: 20,
    description: "Lựa chọn tốt cho doanh nghiệp hoặc chi nhánh văn hóa nhỏ",
    features: [
      "Tối đa 1 địa điểm trên bản đồ (được tạo nhiều chi nhánh)",
      "Tối đa 20 sản phẩm trên Shop",
      "Ưu tiên hiển thị trên kết quả tìm kiếm bản đồ",
      "Sử dụng liên kết mua Affiliate link ngoài",
      "Quản lý dashboard tổng quan doanh nghiệp"
    ],
    bgGradient: "from-blue-50/50 to-indigo-50/20 border-blue-200 text-blue-900 shadow-md shadow-blue-500/5",
    btnColor: "bg-blue-600 hover:bg-blue-700 text-white",
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    id: 3,
    name: "Premium",
    price: 299000,
    duration_days: 30,
    max_places: 3,
    max_products: 50,
    description: "Hỗ trợ truyền thông thương hiệu di sản và sản phẩm quy mô lớn",
    features: [
      "Tối đa 3 địa điểm trên bản đồ (được tạo nhiều chi nhánh)",
      "Tối đa 50 sản phẩm trên Shop",
      "Vị trí hiển thị nổi bật với Marker đặc biệt trên bản đồ",
      "Sử dụng liên kết mua Affiliate link ngoài",
      "Báo cáo chi tiết lượt xem địa điểm và tương tác khách hàng",
      "Hỗ trợ support VIP 24/7 từ quản trị viên"
    ],
    bgGradient: "from-amber-50/50 to-amber-100/20 border-amber-300 text-amber-950 shadow-lg shadow-amber-500/10 scale-105 relative z-10",
    btnColor: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white",
    badgeColor: "bg-amber-100 text-amber-700"
  }
];

export default function SubscriptionPackagesPage() {
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchActiveSub = async () => {
    try {
      const data = await subscriptionApi.getMyActive();
      setActiveSub(data);
    } catch (err) {
      console.error("Lỗi lấy thông tin gói active:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSub();
  }, []);

  const handleSubscribe = async (pkg) => {
    if (processingId) return;
    
    // Nếu là gói trùng với gói hiện tại
    const isCurrentPkg = activeSub?.package?.id === pkg.id || (pkg.id === 1 && activeSub?.is_default);
    if (isCurrentPkg) {
      alert("Bạn đang sử dụng gói dịch vụ này!");
      return;
    }

    if (!window.confirm(`Xác nhận đăng ký ${pkg.name}?`)) {
      return;
    }

    setProcessingId(pkg.id);
    try {
      const res = await subscriptionApi.subscribe(pkg.id);
      
      // Nếu là gói thanh toán phí, Backend trả về URL thanh toán VNPAY
      if (res.data && res.data.paymentUrl) {
        console.log("Redirecting to VNPAY:", res.data.paymentUrl);
        window.location.href = res.data.paymentUrl;
      } else {
        alert(`Nâng cấp gói "${pkg.name}" thành công!`);
        fetchActiveSub();
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Đăng ký gói thất bại");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-2 text-sm text-muted-foreground">Đang tải bảng giá dịch vụ...</span>
      </div>
    );
  }

  const activePkgId = activeSub?.is_default ? 1 : (activeSub?.package?.id || 1);

  return (
    <main className="p-6">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto border-b pb-6 mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
          Bảng giá Gói Dịch Vụ Doanh Nghiệp
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nâng cấp tài khoản của bạn để quảng bá địa điểm chi nhánh và mở rộng quy mô gian hàng Shop của bạn.
        </p>
      </div>

      {/* Package Cards Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto items-stretch">
        {DEFAULT_PACKAGES.map((pkg) => {
          const isCurrent = activePkgId === pkg.id;
          const isPremium = pkg.id === 3;
          const isUpgrading = processingId === pkg.id;

          return (
            <div 
              key={pkg.id} 
              className={`rounded-2xl border p-8 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl ${pkg.bgGradient}`}
            >
              <div>
                {/* Premium tag */}
                {isPremium && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-sm">
                    Phổ biến nhất
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{pkg.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{pkg.description}</p>
                  </div>
                  {isCurrent && (
                    <span className="inline-flex rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                      Gói hiện tại
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-baseline">
                  <span className="text-3xl font-extrabold text-slate-800">
                    {pkg.price === 0 ? "0 VNĐ" : Number(pkg.price).toLocaleString("vi-VN") + " VNĐ"}
                  </span>
                  {pkg.price > 0 && (
                    <span className="text-xs text-muted-foreground ml-1">/{pkg.duration_days} ngày</span>
                  )}
                </div>

                {/* Feature List */}
                <div className="mt-6 pt-6 border-t border-slate-200/60">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quyền lợi gói:</h4>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Purchase Button */}
              <div className="mt-8">
                <Button 
                  onClick={() => handleSubscribe(pkg)}
                  disabled={isCurrent || isUpgrading}
                  className={`w-full py-2.5 font-medium transition-all ${isCurrent ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : pkg.btnColor}`}
                >
                  {isUpgrading ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <RefreshCw className="h-4 w-4 animate-spin" /> Đang xử lý...
                    </span>
                  ) : isCurrent ? (
                    "Đang sử dụng"
                  ) : (
                    pkg.price === 0 ? "Kích hoạt miễn phí" : "Nâng cấp ngay"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* VNPAY Sandbox Alert */}
      <div className="mt-12 max-w-2xl mx-auto rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-700 flex gap-3 items-center">
        <Award className="h-6 w-6 text-blue-500 shrink-0" />
        <div>
          <strong>Cổng thanh toán Sandbox VNPAY:</strong> Bạn có thể dùng bất kỳ thông tin thẻ test nào từ tài liệu VNPAY Sandbox để hoàn tất thanh toán giả lập. Tài khoản của bạn sẽ được nâng cấp lập tức sau khi xác nhận thanh toán thành công.
        </div>
      </div>
    </main>
  );
}
