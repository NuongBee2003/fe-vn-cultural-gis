import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import { Award, Check, RefreshCw } from "lucide-react";
import { subscriptionApi } from "@/api/subscriptionApi";
import { authApi } from "@/api/authApi";
import { useNotify } from "@/context/NotifyContext";
import { Button } from "@/components/ui/button/button";

const DEFAULT_PACKAGES = [
  {
    id: 1,
    name: "Free",
    price: 0,
    duration_days: 3650,
    max_places: 0,
    max_products: 3,
    description: "Gói miễn phí đăng tối đa 3 địa điểm",
    features: [
      "Hỗ trợ tối đa 0 địa điểm trên bản đồ",
      "Hỗ trợ tối đa 3 sản phẩm trên Shop"
    ],
    bgGradient: "bg-slate-800/40 border-slate-700/80 text-white",
    btnColor: "bg-slate-700 hover:bg-slate-600 text-white rounded-xl",
    badgeColor: "bg-slate-800 text-slate-300"
  },
  {
    id: 2,
    name: "Plus",
    price: 99000,
    duration_days: 30,
    max_places: 1,
    max_products: 20,
    description: "Gói Plus hỗ trợ 1 địa điểm và tối đa 20 sản phẩm",
    features: [
      "Hỗ trợ tối đa 1 địa điểm trên bản đồ",
      "Hỗ trợ tối đa 20 sản phẩm trên Shop"
    ],
    bgGradient: "bg-indigo-950/25 border-indigo-500/30 text-white shadow-md shadow-indigo-500/5",
    btnColor: "bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl",
    badgeColor: "bg-indigo-900/50 text-indigo-200"
  },
  {
    id: 3,
    name: "Premium",
    price: 299000,
    duration_days: 30,
    max_places: 3,
    max_products: 50,
    description: "Gói Premium hỗ trợ tối đa 3 địa điểm và 50 sản phẩm",
    features: [
      "Hỗ trợ tối đa 3 địa điểm trên bản đồ",
      "Hỗ trợ tối đa 50 sản phẩm trên Shop"
    ],
    bgGradient: "bg-amber-950/20 border-amber-500/40 text-white shadow-lg shadow-amber-500/10 scale-105 relative z-10",
    btnColor: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl",
    badgeColor: "bg-amber-900/50 text-amber-200"
  }
];

export default function SubscriptionPackagesPage() {
  const navigate = useNavigate();
  const notify = useNotify();
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("adminUser") || localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // States cho form thông tin doanh nghiệp
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [targetPkg, setTargetPkg] = useState(null);
  const [businessName, setBusinessName] = useState(currentUser?.business_name || "");
  const [businessPhone, setBusinessPhone] = useState(currentUser?.business_phone || "");

  const fetchActiveSub = async () => {
    try {
      // 1. Đồng bộ profile mới nhất từ DB
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (token) {
        try {
          const profile = await authApi.getProfile();
          if (profile) {
            setCurrentUser(profile);
          }
        } catch (profileErr) {
          console.error("Lỗi tải thông tin profile:", profileErr);
        }
      }

      // 2. Lấy thông tin gói active
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

  const executeSubscribe = async (pkg, bName, bPhone) => {
    setProcessingId(pkg.id);
    try {
      const res = await subscriptionApi.subscribe(pkg.id, bName.trim(), bPhone.trim());
      
      // Nếu là gói thanh toán phí, Backend trả về URL thanh toán VNPAY
      if (res.data && res.data.paymentUrl) {
        // Lưu tạm thông tin doanh nghiệp vào localStorage trước khi redirect để lát quay về có sẵn
        ["adminUser", "user"].forEach((key) => {
          const storedUserRaw = localStorage.getItem(key);
          if (storedUserRaw) {
            try {
              const parsed = JSON.parse(storedUserRaw);
              parsed.business_name = bName.trim();
              parsed.business_phone = bPhone.trim();
              localStorage.setItem(key, JSON.stringify(parsed));
            } catch (e) {
              console.error(e);
            }
          }
        });
        console.log("Redirecting to VNPAY:", res.data.paymentUrl);
        window.location.href = res.data.paymentUrl;
      } else {
        notify.success(`Nâng cấp gói "${pkg.name}" thành công!`);
        ["adminUser", "user"].forEach((key) => {
          const storedUserRaw = localStorage.getItem(key);
          if (storedUserRaw) {
            try {
              const parsed = JSON.parse(storedUserRaw);
              parsed.role = "business";
              parsed.business_name = bName.trim();
              parsed.business_phone = bPhone.trim();
              localStorage.setItem(key, JSON.stringify(parsed));
            } catch (e) {
              console.error(e);
            }
          }
        });
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("local-storage-update", { detail: { key: "user" } }));
        navigate(PATHS.BUSINESS_OVERVIEW);
      }
    } catch (err) {
      console.error(err);
      notify.error(err.message || "Đăng ký gói thất bại");
    } finally {
      setProcessingId(null);
      setShowBusinessForm(false);
      setTargetPkg(null);
    }
  };

  const handleSubscribe = async (pkg) => {
    if (!currentUser) {
      notify.warning("Vui lòng đăng nhập trước khi nâng cấp gói dịch vụ!");
      navigate(`/login?redirect=${PATHS.BUSINESS_PRICING}`);
      return;
    }

    if (processingId) return;
    
    // Nếu là gói trùng với gói hiện tại
    const isCurrentPkg = activePkgId === pkg.id;
    if (isCurrentPkg) {
      notify.info("Bạn đang sử dụng gói dịch vụ này!");
      return;
    }

    // Không cho phép hạ cấp gói
    if (currentPrice >= 0 && pkg.price < currentPrice) {
      notify.warning("Bạn đang sử dụng gói dịch vụ cao hơn, không thể hạ cấp gói!");
      return;
    }

    // Kiểm tra xem đã có thông tin doanh nghiệp hay chưa
    const hasName = currentUser.business_name && currentUser.business_name.trim();
    const hasPhone = currentUser.business_phone && currentUser.business_phone.trim();

    if (hasName && hasPhone) {
      // Tự động điền state
      setBusinessName(currentUser.business_name.trim());
      setBusinessPhone(currentUser.business_phone.trim());
      // Thực hiện đăng ký luôn, bỏ qua bước nhập form
      await executeSubscribe(pkg, currentUser.business_name, currentUser.business_phone);
    } else {
      // Nếu chưa có đầy đủ thông tin, hiện form yêu cầu điền
      setBusinessName(currentUser.business_name || "");
      setBusinessPhone(currentUser.business_phone || "");
      setTargetPkg(pkg);
      setShowBusinessForm(true);
    }
  };

  const confirmSubscription = async (e) => {
    e.preventDefault();
    if (!targetPkg || processingId) return;

    if (!businessName.trim() || !businessPhone.trim()) {
      notify.warning("Vui lòng nhập đầy đủ tên doanh nghiệp và số điện thoại!");
      return;
    }

    await executeSubscribe(targetPkg, businessName, businessPhone);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-2 text-sm text-muted-foreground">Đang tải bảng giá dịch vụ...</span>
      </div>
    );
  }

  const activePkgId = activeSub?.is_default 
    ? (currentUser?.role === "business" ? 1 : null) 
    : (activeSub?.package?.id || null);

  const currentPrice = activeSub?.is_default
    ? (currentUser?.role === "business" ? 0 : -1)
    : (activeSub?.package?.price !== undefined ? Number(activeSub.package.price) : -1);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      <div className="h-full overflow-y-auto p-6 md:p-12">
        {/* Top Header */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
          >
            &larr; Quay lại Bản đồ Trang chủ
          </button>
          <span className="text-xs font-semibold text-slate-500">DI SẢN VIỆT - BUSINESS</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto border-b border-slate-800 pb-6 mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Bảng giá Gói Dịch Vụ Doanh Nghiệp
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Nâng cấp tài khoản của bạn để quảng bá địa điểm chi nhánh và mở rộng quy mô gian hàng Shop của bạn.
          </p>
        </div>

        {/* Package Cards Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto items-stretch">
          {DEFAULT_PACKAGES.map((pkg) => {
            const isCurrent = activePkgId === pkg.id;
            const isPremium = pkg.id === 3;
            const isUpgrading = processingId === pkg.id;
            const isDowngrade = currentPrice >= 0 && pkg.price < currentPrice;

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
                      <h3 className={`text-xl font-bold ${pkg.id === 3 ? "text-amber-400" : pkg.id === 2 ? "text-indigo-400" : "text-slate-200"}`}>{pkg.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{pkg.description}</p>
                    </div>
                    {isCurrent && (
                      <span className="inline-flex rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                        Gói hiện tại
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-3xl font-extrabold text-white">
                      {pkg.price === 0 ? "0 VNĐ" : Number(pkg.price).toLocaleString("vi-VN") + " VNĐ"}
                    </span>
                    {pkg.price > 0 && (
                      <span className="text-xs text-slate-400 ml-1">/{pkg.duration_days} ngày</span>
                    )}
                  </div>

                  {/* Feature List */}
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${pkg.id === 3 ? "text-amber-400/80" : pkg.id === 2 ? "text-indigo-400/80" : "text-slate-400"}`}>Quyền lợi gói:</h4>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <Check className="h-4.5 w-4.5 shrink-0 text-emerald-400 mt-0.5" />
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
                    disabled={isCurrent || isUpgrading || isDowngrade}
                    className={`w-full py-2.5 font-medium transition-all ${(isCurrent || isDowngrade) ? 'bg-slate-800/80 text-slate-500 border border-slate-700 cursor-not-allowed' : pkg.btnColor}`}
                  >
                    {isUpgrading ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Đang xử lý...
                      </span>
                    ) : isCurrent ? (
                      "Đang sử dụng"
                    ) : isDowngrade ? (
                      "Không thể hạ cấp"
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
        <div className="mt-12 max-w-2xl mx-auto rounded-xl border border-indigo-500/25 bg-indigo-950/20 p-4 text-xs text-indigo-200 flex gap-3 items-center">
          <Award className="h-6 w-6 text-indigo-400 shrink-0" />
          <div>
            <strong className="text-indigo-300">Cổng thanh toán Sandbox VNPAY:</strong> Bạn có thể dùng bất kỳ thông tin thẻ test nào từ tài liệu VNPAY Sandbox để hoàn tất thanh toán giả lập. Tài khoản của bạn sẽ được nâng cấp lập tức sau khi xác nhận thanh toán thành công.
          </div>
        </div>

        {/* Modal Đăng ký thông tin doanh nghiệp */}
        {showBusinessForm && targetPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold text-slate-100 mb-2 text-left">Đăng ký thông tin Doanh nghiệp</h3>
              <p className="text-xs text-slate-400 mb-6 text-left">
                Vui lòng cung cấp tên doanh nghiệp và số điện thoại để khởi tạo hồ sơ và kích hoạt gói **{targetPkg.name}**.
              </p>

              <form onSubmit={confirmSubscription} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-500 mb-2 uppercase tracking-wider text-left">Tên doanh nghiệp / Cửa hàng</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Rượu Cần Tây Nguyên"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-500 mb-2 uppercase tracking-wider text-left">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0987654321"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBusinessForm(false);
                      setTargetPkg(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={processingId !== null}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-xs font-bold text-slate-950 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {processingId ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Đang xử lý...
                      </>
                    ) : (
                      "Xác nhận nâng cấp"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
