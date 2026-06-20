import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import VNCulture from "@/assets/img/holiday/vnculture.jpg";
import { authApi } from "@/api/authApi";
import { useNotify } from "@/context/NotifyContext";

const GoogleIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={`shrink-0 ${className}`}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66-.66-1.05-1.37-1.05-2.09z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);


export default function LoginPage() {
  const navigate = useNavigate();
  const notify = useNotify();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // States for Forgot Password
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // States for Mock Google Dialog
  const [showMockGoogleDialog, setShowMockGoogleDialog] = useState(false);

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "739343750849-mock-client-id.apps.googleusercontent.com",
          callback: handleGoogleLoginSuccess,
        });
      }
    };

    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      initGoogle();
    }
  }, []);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      const res = await authApi.googleLogin({ token: credentialResponse.credential });
      if (res && res.token) {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token", res.token);
        localStorage.setItem("adminToken", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("adminUser", JSON.stringify(res.user));
        
        await notify.success("Đăng nhập bằng Google thành công!", "Chào mừng!");
        navigate(PATHS.HOME);
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Đăng nhập bằng Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRealSignIn = () => {
    if (window.google) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowMockGoogleDialog(true);
          }
        });
      } catch (e) {
        console.error(e);
        setShowMockGoogleDialog(true);
      }
    } else {
      setShowMockGoogleDialog(true);
    }
  };

  const handleGoogleMockLogin = async (mockEmail, mockName) => {
    try {
      setLoading(true);
      setError("");
      const res = await authApi.googleLogin({
        isMock: true,
        mockEmail,
        mockUsername: mockName,
        mockAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${mockName}`
      });
      if (res && res.token) {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token", res.token);
        localStorage.setItem("adminToken", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("adminUser", JSON.stringify(res.user));
        
        await notify.success(`Đăng nhập Google (${mockName}) thành công!`, "Chào mừng!");
        navigate(PATHS.HOME);
      }
    } catch (err) {
      setError(err?.message || "Đăng nhập Google giả lập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login(email.trim(), password);
      if (res && res.token) {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token", res.token);
        localStorage.setItem("adminToken", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("adminUser", JSON.stringify(res.user));
        
        await notify.success("Đăng nhập thành công!", "Chào mừng trở lại");
        navigate(PATHS.HOME);
      } else {
        setError("Đăng nhập thất bại. Không tìm thấy thông tin xác thực.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Sai email hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }
    try {
      setLoading(true);
      await authApi.forgotPassword(email.trim());
      await notify.success("Đã gửi mã OTP thử nghiệm!", "Vui lòng kiểm tra");
      setForgotStep(2);
    } catch (err) {
      setError(err?.message || "Email không tồn tại hoặc có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp || !newPassword || !confirmNewPassword) {
      setError("Vui lòng nhập đầy đủ các trường.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu mới không khớp nhau.");
      return;
    }
    try {
      setLoading(true);
      await authApi.resetPassword(email.trim(), otp.trim(), newPassword);
      await notify.success("Đặt lại mật khẩu thành công!", "Bạn có thể đăng nhập ngay.");
      setIsForgotPassword(false);
      setForgotStep(1);
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPassword("");
    } catch (err) {
      setError(err?.message || "Mã OTP không hợp lệ hoặc lỗi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden">
      <div className="w-full h-full grid lg:grid-cols-2 bg-white">

        {/* Left */}
        <div
          className="hidden lg:flex flex-col justify-end relative bg-cover bg-center p-12 h-full"
          style={{
            backgroundImage: `url(${VNCulture})`,
          }}
        >
          {/* Overlay giúp chữ rõ hơn */}
          <div className="absolute inset-0 bg-black/55"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-6">
              <h1
                className="text-5xl font-extrabold text-white tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                VietCulture
              </h1>

              <p className="text-xl font-semibold text-amber-200 mt-2 tracking-wide">
                Bản đồ Văn hóa & Du lịch Việt Nam
              </p>
            </div>

            <h2 className="text-4xl font-bold tracking-tight leading-tight text-white mb-5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              Khám phá vẻ đẹp Việt Nam
            </h2>

            <p className="text-gray-100 text-lg leading-relaxed font-medium max-w-md drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Đăng nhập để lưu địa điểm yêu thích, chia sẻ trải nghiệm,
              check-in và tham gia cộng đồng văn hóa du lịch Việt.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center p-6 sm:p-10 bg-white h-full overflow-y-auto">
          <div className="w-full max-w-md my-auto py-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                {!isForgotPassword 
                  ? "Đăng nhập" 
                  : forgotStep === 1 
                    ? "Quên mật khẩu" 
                    : "Đặt lại mật khẩu"
                }
              </h2>

              <p className="text-base text-gray-600 mt-2 font-medium">
                {!isForgotPassword 
                  ? "Chào mừng bạn quay trở lại" 
                  : forgotStep === 1 
                    ? "Nhập email của bạn để nhận mã xác minh" 
                    : "Tạo mật khẩu bảo mật mới cho tài khoản"
                }
              </p>
            </div>

            {!isForgotPassword ? (
              // FORM ĐĂNG NHẬP THƯỜNG
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                    Email
                  </label>

                  <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[var(--brand-primary)] transition-all">
                    <Mail size={18} className="text-gray-400 mr-3 shrink-0" />
                    <input
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="flex-1 outline-none bg-transparent text-sm"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-[#B8922E]">
                      Mật khẩu
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setForgotStep(1);
                        setError("");
                      }}
                      className="text-xs text-[var(--brand-primary)] hover:underline cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>

                  <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[var(--brand-primary)] transition-all">
                    <Lock size={18} className="text-gray-400 mr-3 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      className="flex-1 outline-none bg-transparent text-sm"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-[var(--brand-primary)] transition-all cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                    <input type="checkbox" />
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-medium mt-2">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-variant)] text-white font-semibold transition-all disabled:opacity-60 flex items-center justify-center cursor-pointer"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>
            ) : forgotStep === 1 ? (
              // FORM QUÊN MẬT KHẨU - BƯỚC 1: NHẬP EMAIL
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                    Địa chỉ Email
                  </label>

                  <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[var(--brand-primary)] transition-all">
                    <Mail size={18} className="text-gray-400 mr-3 shrink-0" />
                    <input
                      type="email"
                      placeholder="Nhập email cần khôi phục mật khẩu"
                      className="flex-1 outline-none bg-transparent text-sm"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); }}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-medium mt-2">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-variant)] text-white font-semibold transition-all disabled:opacity-60 flex items-center justify-center cursor-pointer"
                >
                  {loading ? "Đang gửi OTP..." : "Gửi mã xác nhận"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError("");
                  }}
                  className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
                >
                  Quay lại đăng nhập
                </button>
              </form>
            ) : (
              // FORM QUÊN MẬT KHẨU - BƯỚC 2: NHẬP OTP & NEW PASSWORD
              <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3.5 leading-relaxed font-medium">
                  Hệ thống đã giả lập gửi mã OTP về email **{email}**. Để hoàn tất kiểm tra, vui lòng nhập mã OTP thử nghiệm là <strong className="text-amber-950 font-bold bg-amber-100 px-1.5 py-0.5 rounded">123456</strong>.
                </div>

                {/* OTP Code */}
                <div>
                  <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                    Mã xác nhận (OTP)
                  </label>

                  <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[var(--brand-primary)] transition-all">
                    <Lock size={18} className="text-gray-400 mr-3 shrink-0" />
                    <input
                      type="text"
                      placeholder="Nhập mã OTP (123456)"
                      maxLength={6}
                      className="flex-1 outline-none bg-transparent text-sm tracking-widest font-mono font-bold"
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); }}
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                    Mật khẩu mới
                  </label>

                  <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[var(--brand-primary)] transition-all">
                    <Lock size={18} className="text-gray-400 mr-3 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      className="flex-1 outline-none bg-transparent text-sm"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); }}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                    Xác nhận mật khẩu mới
                  </label>

                  <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[var(--brand-primary)] transition-all">
                    <Lock size={18} className="text-gray-400 mr-3 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu mới"
                      className="flex-1 outline-none bg-transparent text-sm"
                      value={confirmNewPassword}
                      onChange={(e) => { setConfirmNewPassword(e.target.value); }}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-medium mt-2">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-variant)] text-white font-semibold transition-all disabled:opacity-60 flex items-center justify-center cursor-pointer"
                >
                  {loading ? "Đang xác nhận..." : "Đặt lại mật khẩu"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForgotStep(1);
                    setError("");
                  }}
                  className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
                >
                  Quay lại
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="text-xs text-gray-400">HOẶC</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Social */}
            <div className="w-full">
              <button 
                type="button"
                onClick={handleGoogleRealSignIn}
                className="w-full h-12 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 text-sm font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer text-gray-700 shadow-xs hover:shadow-sm"
              >
                <GoogleIcon size={20} />
                Đăng nhập bằng Google
              </button>
            </div>

            {/* Register */}
            <p className="text-center text-sm text-gray-500 mt-7">
              Bạn chưa có tài khoản?{" "}
              <NavLink
                to={PATHS.REGISTER}
                className="text-[var(--brand-primary)] font-semibold hover:underline"
              >
                Đăng ký ngay
              </NavLink>
            </p>
          </div>
        </div>
      </div>

      {/* Mock Google Login Dialog */}
      {showMockGoogleDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <GoogleIcon size={24} />
              Đăng nhập bằng Google
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Chọn một tài khoản Google để đăng nhập nhanh hoặc chọn chế độ Đăng nhập Google thực tế.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowMockGoogleDialog(false);
                  handleGoogleMockLogin("nguyenvana.google@gmail.com", "Nguyễn Văn A");
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/20 text-left transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Nguyễn Văn A</p>
                  <p className="text-xs text-gray-500">nguyenvana.google@gmail.com</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowMockGoogleDialog(false);
                  handleGoogleMockLogin("tranthib.google@gmail.com", "Trần Thị B");
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-pink-500 hover:bg-pink-50/20 text-left transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                  B
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Trần Thị B</p>
                  <p className="text-xs text-gray-500">tranthib.google@gmail.com</p>
                </div>
              </button>

              <div className="py-2 flex items-center gap-2">
                <div className="flex-1 h-[1px] bg-gray-100"></div>
                <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">Thực tế</span>
                <div className="flex-1 h-[1px] bg-gray-100"></div>
              </div>

              <button
                onClick={() => {
                  setShowMockGoogleDialog(false);
                  if (window.google) {
                    try {
                      window.google.accounts.id.prompt();
                    } catch (e) {
                      notify.error("Không thể khởi động Google Sign-In. Vui lòng kiểm tra cấu hình.");
                    }
                  } else {
                    notify.error("Thư viện Google chưa được tải thành công.");
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-gray-300 text-sm font-semibold hover:bg-gray-50 text-gray-700 text-center transition-all cursor-pointer"
              >
                Sử dụng tài khoản Google thật
              </button>
            </div>

            <button
              onClick={() => setShowMockGoogleDialog(false)}
              className="w-full mt-5 py-2 text-center text-xs font-semibold text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}