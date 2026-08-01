import React, { useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { PATHS } from "@/constants/paths";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status"); // "success" | "fail"
  const message = searchParams.get("message");
  const code = searchParams.get("code");

  const isSuccess = status === "success";

  useEffect(() => {
    // Tự động reload thông tin user trong localStorage nếu thanh toán thành công để cập nhật role: business
    if (isSuccess) {
      ["adminUser", "user"].forEach((key) => {
        const storedUser = localStorage.getItem(key);
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            userObj.role = "business"; // Cập nhật role tạm thời trên FE
            localStorage.setItem(key, JSON.stringify(userObj));
          } catch (e) {
            console.error(e);
          }
        }
      });
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("local-storage-update", { detail: { key: "user" } }));
    }
  }, [isSuccess]);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900 justify-center items-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Status Icon */}
        <div className="flex justify-center">
          {isSuccess ? (
            <div className="rounded-full bg-emerald-950/50 p-4 text-emerald-400 border border-emerald-500/20 animate-bounce">
              <CheckCircle2 className="h-16 w-16" />
            </div>
          ) : (
            <div className="rounded-full bg-red-950/50 p-4 text-red-400 border border-red-500/20 animate-pulse">
              <XCircle className="h-16 w-16" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-extrabold text-slate-100">
          {isSuccess ? "Thanh toán thành công!" : "Giao dịch thất bại"}
        </h1>

        {/* Subtitle / Message */}
        <p className="mt-3 text-sm text-slate-400 px-4">
          {isSuccess 
            ? "Tài khoản của bạn đã được nâng cấp lên vai trò Business. Giờ đây bạn có thể đăng địa điểm và tạo gian hàng sản phẩm."
            : "Đã có lỗi xảy ra trong quá trình thanh toán qua VNPAY hoặc giao dịch đã bị hủy bỏ bởi người dùng."
          }
        </p>

        {/* Transaction Details Box */}
        <div className="mt-6 rounded-2xl bg-slate-950 border border-slate-800 p-4 text-left text-xs text-slate-400 space-y-2.5">
          <div className="flex justify-between">
            <span>Cổng thanh toán:</span>
            <span className="font-semibold text-slate-300">VNPAY (Sandbox)</span>
          </div>
          <div className="flex justify-between">
            <span>Mã kết quả:</span>
            <span className={`font-semibold ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
              {isSuccess ? "00 (Giao dịch thành công)" : code || "Hủy bỏ / Lỗi chữ ký"}
            </span>
          </div>
          {message && (
            <div className="flex justify-between items-start gap-1">
              <span>Lý do chi tiết:</span>
              <span className="font-semibold text-slate-300 text-right">{message}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          {isSuccess ? (
            <>
              <Link to={PATHS.BUSINESS_OVERVIEW}>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center gap-1.5 py-3 shadow-md shadow-amber-500/10 font-bold rounded-xl">
                  Vào trang quản trị doanh nghiệp <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to={PATHS.BUSINESS_PRICING}>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl py-3">
                  Quay lại chọn gói dịch vụ
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full border-slate-800 text-slate-400 hover:text-white rounded-xl py-3 bg-slate-950 hover:bg-slate-900">
                  Quay lại Bản đồ trang chủ
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Footer Support Tag */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-center items-center gap-1.5 text-xs text-slate-400">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Hệ thống thanh toán bảo mật 256-bit</span>
        </div>
      </div>
    </div>
  );
}
