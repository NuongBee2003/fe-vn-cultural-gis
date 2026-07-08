import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "@/api/authApi";
import { PATHS } from "@/constants/paths";
import { Button } from "@/components/ui/button/button";
import { 
  MapPin, 
  ShoppingBag, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Store,
  MapPinned
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const user = authApi.getUser();

  const handleCTAClick = () => {
    if (!user) {
      navigate(`/login?redirect=${PATHS.BUSINESS_PRICING}`);
    } else if (user.role === "business" || user.role === "admin") {
      navigate(PATHS.BUSINESS_OVERVIEW);
    } else {
      navigate(PATHS.BUSINESS_PRICING);
    }
  };

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      <div className="h-full overflow-y-auto">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/60">
        <div className="flex items-center gap-3">
          <Store size={22} className="text-amber-500" />
          <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Di Sản Việt - Business
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#features" className="hover:text-amber-400 transition-colors">Tính năng</a>
          <a href="#pricing" className="hover:text-amber-400 transition-colors">Gói dịch vụ</a>
          <Link to="/" className="hover:text-amber-400 transition-colors">Bản đồ trang chủ</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "business" || user.role === "admin" ? (
                <Button 
                  onClick={() => navigate(PATHS.BUSINESS_OVERVIEW)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  Vào Business Portal <ArrowRight size={14} />
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate(PATHS.BUSINESS_PRICING)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  Nâng cấp Doanh nghiệp
                </Button>
              )}
              <Button 
                onClick={() => {
                  authApi.logout();
                  window.location.reload();
                }}
                variant="outline" 
                className="border-slate-800 text-slate-400 hover:text-white px-3 py-2 rounded-xl text-xs bg-slate-950"
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => navigate(`/login?redirect=${PATHS.LANDING}`)}
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold px-5 py-2 rounded-xl text-xs"
            >
              Đăng nhập Doanh nghiệp
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-indigo-500/5 to-transparent blur-3xl rounded-full -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/5 blur-3xl rounded-full -z-10 animate-pulse" />
        
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-500 text-xs font-semibold tracking-wide uppercase mb-6 animate-fade-in">
            <Sparkles size={14} className="animate-spin duration-3000" /> Giải pháp marketing di sản số 1 Việt Nam
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight md:leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 max-w-4xl mx-auto">
            Kết Nối Kinh Doanh Với Bản Đồ Văn Hóa Quốc Gia
          </h1>
          
          <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Đăng ký tài khoản doanh nghiệp (Business) để ghim địa điểm, chi nhánh kinh doanh của bạn cạnh bên các di tích lịch sử, danh thắng văn hóa trên bản đồ tương tác, đồng thời sở hữu gian hàng tiếp thị liên kết (Affiliate Shop) độc quyền.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleCTAClick}
              className="w-full sm:w-auto px-8 py-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group transition-all duration-300 hover:scale-105"
            >
              Bắt đầu ngay hôm nay
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
            
            <a href="#features" className="w-full sm:w-auto">
              <Button 
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 rounded-xl border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-base transition-colors"
              >
                Tìm hiểu tính năng
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 bg-slate-900/40 border-y border-slate-900/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Tại Sao Doanh Nghiệp Chọn Chúng Tôi?
            </h2>
            <p className="mt-4 text-slate-400 text-sm">
              Đem đến cầu nối tự nhiên và giá trị giữa các du khách đam mê văn hóa lịch sử Việt Nam với các sản phẩm địa phương, dịch vụ du lịch bản địa của bạn.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* feature 1 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 hover:border-amber-500/30 hover:bg-slate-900 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200 group-hover:text-white">Ghim Chi Nhánh Bản Đồ</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Đưa nhà hàng, khách sạn, cửa hàng quà tặng văn hóa của bạn hiển thị trực quan lên Bản đồ Di Sản. Khách du lịch dễ dàng tìm thấy địa chỉ của bạn khi tham khảo các di tích lân cận.
              </p>
            </div>

            {/* feature 2 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 hover:border-amber-500/30 hover:bg-slate-900 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200 group-hover:text-white">Affiliate Shop Thông Minh</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Đăng bán các sản phẩm thủ công, đặc sản ẩm thực văn hóa của bạn với đường link liên kết ngoài (Shopee, Lazada, Tiki, Website riêng). Giảm thiểu quy mô quản lý giỏ hàng, tối ưu doanh số.
              </p>
            </div>

            {/* feature 3 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 hover:border-amber-500/30 hover:bg-slate-900 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200 group-hover:text-white">Báo Cáo Tương Tác Chi Tiết</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Theo dõi lượng khách tham quan click vào địa danh của bạn, số người xem sản phẩm, tỷ lệ tương tác chuyển đổi. Hỗ trợ dữ liệu trực quan giúp bạn ra quyết định marketing chuẩn xác.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Lựa Chọn Gói Dịch Vụ Phù Hợp
            </h2>
            <p className="mt-4 text-slate-400 text-sm">
              Từ khởi đầu miễn phí cho đến các giải pháp truyền thông thương hiệu mạnh mẽ, chúng tôi có mọi lựa chọn phù hợp với ngân sách của bạn.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
            {/* Free Pkg */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <h3 className="text-lg font-bold text-slate-300">Free</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-white">0 VNĐ</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Gói miễn phí không hỗ trợ địa điểm nổi bật</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Không hỗ trợ địa điểm nổi bật</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Hỗ trợ tối đa 3 sản phẩm trên Shop</li>
                </ul>
              </div>
              <Button 
                onClick={handleCTAClick}
                variant="outline"
                className="mt-8 w-full border-slate-800 bg-slate-950 text-slate-300 hover:text-white"
              >
                Trải nghiệm ngay
              </Button>
            </div>

            {/* Plus Pkg */}
            <div className="bg-slate-900/40 border-2 border-amber-500/20 rounded-2xl p-8 flex flex-col justify-between hover:border-amber-500/40 shadow-lg shadow-amber-500/5 relative transition-all">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-slate-950 text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full">
                Khuyên dùng
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-500">Plus</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-white">99.000 VNĐ</span>
                  <span className="text-xs text-slate-500 ml-1">/ 30 ngày</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Gói Plus hỗ trợ tối đa 1 địa điểm nổi bật đến hết gói và 20 sản phẩm</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Hỗ trợ tối đa 1 địa điểm nổi bật đến hết gói</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Hỗ trợ tối đa 20 sản phẩm trên Shop</li>
                </ul>
              </div>
              <Button 
                onClick={handleCTAClick}
                className="mt-8 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
              >
                Đăng ký Plus
              </Button>
            </div>

            {/* Premium Pkg */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <h3 className="text-lg font-bold text-slate-300">Premium</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-white">299.000 VNĐ</span>
                  <span className="text-xs text-slate-500 ml-1">/ 30 ngày</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Gói Premium hỗ trợ tối đa 3 địa điểm nổi bật đến hết gói và 50 sản phẩm</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Hỗ trợ tối đa 3 địa điểm nổi bật đến hết gói</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Hỗ trợ tối đa 50 sản phẩm trên Shop</li>
                </ul>
              </div>
              <Button 
                onClick={handleCTAClick}
                variant="outline"
                className="mt-8 w-full border-slate-800 bg-slate-950 text-slate-300 hover:text-white"
              >
                Đăng ký Premium
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section bottom */}
      <section className="py-20 bg-gradient-to-t from-slate-950 to-slate-900/30 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Store size={48} className="mx-auto text-amber-500 mb-6 animate-bounce" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 mb-4">Sẵn Sàng Phát Triển Doanh Nghiệp?</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8">
            Nâng tầm thương hiệu di sản địa phương của bạn ngay hôm nay cùng hàng nghìn du khách trên nền tảng của chúng tôi.
          </p>
          <Button 
            onClick={handleCTAClick}
            className="px-8 py-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
          >
            Đăng ký tài khoản ngay
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-900/60 bg-slate-950 text-center text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <MapPinned size={14} className="text-amber-500" /> Di Sản Việt © 2026
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Thanh toán Sandbox an toàn qua cổng VNPAY</span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
