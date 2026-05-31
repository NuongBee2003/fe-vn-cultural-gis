import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import { authApi } from "@/api/authApi";
import VNCulture from "@/assets/img/holiday/vnculture.jpg";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate input
      if (!email || !password) {
        setError("Vui lòng nhập email và mật khẩu");
        setLoading(false);
        return;
      }

      // Call API login
      const response = await authApi.login(email, password);
      const { token, user } = response;

      // Check if user is admin
      if (user.role !== "admin") {
        setError("Bạn không có quyền truy cập trang quản trị!");
        setLoading(false);
        return;
      }

      // Save token and user to localStorage
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      // Redirect to dashboard
      navigate(PATHS.DASHBOARD);
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden">
      <div className="w-full h-full grid lg:grid-cols-2 bg-white">
        {/* Left - Background Image */}
        <div
          className="hidden lg:flex flex-col justify-end relative bg-cover bg-center p-12 h-full"
          style={{
            backgroundImage: `url(${VNCulture})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/55"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-6">
              <h1
                className="text-5xl font-extrabold text-white tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                VietCulture Admin
              </h1>

              <p className="text-xl font-semibold text-amber-200 mt-2 tracking-wide">
                Trang quản trị Bản đồ Văn hóa Việt Nam
              </p>
            </div>

            <h2 className="text-4xl font-bold tracking-tight leading-tight text-white mb-5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              Quản lý nội dung
            </h2>

            <p className="text-gray-100 text-lg leading-relaxed font-medium max-w-md drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Đăng nhập để truy cập bảng điều khiển quản trị. Quản lý địa điểm, thể loại, bình luận, và nội dung khác.
            </p>
          </div>
        </div>

        {/* Right - Login Form */}
        <div className="flex justify-center p-6 sm:p-10 bg-white h-full overflow-y-auto">
          <div className="w-full max-w-md my-auto py-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                Đăng nhập Admin
              </h2>

              <p className="text-base text-gray-600 mt-2 font-medium">
                Chỉ dành cho quản trị viên
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Email
                </label>

                <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[#B8922E] transition-all">
                  <Mail
                    size={18}
                    className="text-gray-400 mr-3 shrink-0"
                  />

                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 outline-none bg-transparent text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Mật khẩu
                </label>

                <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 focus-within:border-[#B8922E] transition-all">
                  <Lock
                    size={18}
                    className="text-gray-400 mr-3 shrink-0"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className="flex-1 outline-none bg-transparent text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#B8922E] hover:bg-[#a67d22] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                Quay trở lại{" "}
                <button
                  type="button"
                  onClick={() => navigate(PATHS.HOME)}
                  className="text-[#B8922E] hover:underline font-semibold"
                >
                  trang chủ
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
