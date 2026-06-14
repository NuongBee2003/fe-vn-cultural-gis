import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import VNCulture from "@/assets/img/holiday/vnculture.jpg";
import { authApi } from "@/api/authApi";
import { useNotify } from "@/context/NotifyContext";


export default function LoginPage() {
  const navigate = useNavigate();
  const notify = useNotify();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
                Đăng nhập
              </h2>

              <p className="text-base text-gray-600 mt-2 font-medium">
                Chào mừng bạn quay trở lại
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Email
                </label>

                <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[var(--brand-primary)] transition-all">
                  <Mail
                    size={18}
                    className="text-gray-400 mr-3 shrink-0"
                  />

                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 outline-none bg-transparent text-sm"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                    Mật khẩu
                  </label>

                  <button
                    type="button"
                    className="text-xs text-[var(--brand-primary)] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[var(--brand-primary)] transition-all">
                  <Lock
                    size={18}
                    className="text-gray-400 mr-3 shrink-0"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className="flex-1 outline-none bg-transparent text-sm"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-[var(--brand-primary)] transition-all"
                                 >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
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
                className="w-full h-12 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-variant)] text-white font-semibold transition-all disabled:opacity-60 flex items-center justify-center"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="text-xs text-gray-400">HOẶC</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button className="h-11 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all">
                Google
              </button>

              <button className="h-11 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-all">
                Facebook
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
    </div>
  );
}