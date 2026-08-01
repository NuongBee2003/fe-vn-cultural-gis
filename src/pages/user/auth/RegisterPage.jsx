import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import VNCulture from "@/assets/img/holiday/vnculture.jpg";
import { authApi } from "@/api/user/authApi";
import { useNotify } from "@/context/NotifyContext";
import { useSettings } from "@/context/SettingsContext";

const GoogleIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={`shrink-0 ${className}`}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66-.66-1.05-1.37-1.05-2.09z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const notify = useNotify();
  const { appName } = useSettings();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    agree: ""
  });

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
        
        await notify.success("Đăng ký & Đăng nhập bằng Google thành công!", "Chào mừng!");
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
        
        await notify.success(`Đăng ký bằng Google (${mockName}) thành công!`, "Chào mừng!");
        navigate(PATHS.HOME);
      }
    } catch (err) {
      setError(err?.message || "Đăng ký bằng Google giả lập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    // Reset field errors
    const newErrors = {
      username: "",
      phone: "",
      email: "",
      password: "",
      agree: ""
    };
    
    let hasError = false;

    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập họ và tên.";
      hasError = true;
    }

    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
      hasError = true;
    } else {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(phone.trim())) {
        newErrors.phone = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.";
        hasError = true;
      }
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = "Email không đúng định dạng.";
        hasError = true;
      }
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
      hasError = true;
    } else if (password.length < 4) {
      newErrors.password = "Mật khẩu phải có ít nhất 4 ký tự.";
      hasError = true;
    }

    if (!agree) {
      newErrors.agree = "Bạn phải đồng ý với điều khoản sử dụng.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      username: "",
      phone: "",
      email: "",
      password: "",
      agree: ""
    });

    try {
      setLoading(true);
      const res = await authApi.register(username.trim(), email.trim(), password, phone.trim());
      if (res && res.token) {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token", res.token);
        localStorage.setItem("adminToken", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("adminUser", JSON.stringify(res.user));
        
        await notify.success("Tài khoản của bạn đã được tạo thành công!", "Đăng ký thành công");
        navigate(PATHS.HOME);
      } else {
        setError("Đăng ký thất bại. Không tìm thấy thông tin xác thực.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Đăng ký không thành công. Email hoặc số điện thoại có thể đã được sử dụng.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-full bg-white flex overflow-hidden">
      <div className="w-full h-full grid lg:grid-cols-2 bg-white">

        {/* Left */}
        <div
          className="hidden lg:flex flex-col justify-center relative bg-cover bg-center p-12 h-full"
          style={{
            backgroundImage: `url(${VNCulture})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/55"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-6">
              <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                {appName || "VietCulture"}
              </h1>

              <p className="text-xl font-semibold text-amber-200 mt-2 tracking-wide">
                Bản đồ Văn hóa & Du lịch Việt Nam
              </p>
            </div>

            <h2 className="text-4xl font-bold leading-tight text-white mb-5 max-w-[520px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              Bắt đầu hành trình khám phá Việt Nam
            </h2>

            <p className="text-gray-100 text-lg leading-relaxed font-medium max-w-md drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Tạo tài khoản để lưu địa điểm yêu thích, chia sẻ trải nghiệm
              văn hóa và kết nối cộng đồng du lịch Việt Nam.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center p-6 sm:p-10 bg-white h-full overflow-y-auto">
          <div className="w-full max-w-md my-auto py-8">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold tracking-tight text-[#B8922E]">
                Đăng ký
              </h2>

              <p className="text-base text-[#7A5C12] mt-2 font-medium">
                Tạo tài khoản mới ngay hôm nay
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-5" noValidate>

              {/* Fullname */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Họ và tên
                </label>

                <div className={`flex items-center border rounded-xl px-4 h-12 transition-all ${errors.username ? 'border-red-500 bg-red-50/10 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100' : 'border-[#E5D3A1] bg-[#FFFDF8] focus-within:border-[#C9A646] focus-within:ring-2 focus-within:ring-[#F4E3B2]'}`}>
                  <User
                    size={18}
                    className={`${errors.username ? 'text-red-500' : 'text-[#B8922E]'} mr-3 shrink-0`}
                  />

                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    className="flex-1 outline-none bg-transparent text-sm"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors(prev => ({ ...prev, username: "" }));
                    }}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 font-medium mt-1 pl-1">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Số điện thoại
                </label>

                <div className={`flex items-center border rounded-xl px-4 h-12 transition-all ${errors.phone ? 'border-red-500 bg-red-50/10 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100' : 'border-[#E5D3A1] bg-[#FFFDF8] focus-within:border-[#C9A646] focus-within:ring-2 focus-within:ring-[#F4E3B2]'}`}>
                  <Phone
                    size={18}
                    className={`${errors.phone ? 'text-red-500' : 'text-[#B8922E]'} mr-3 shrink-0`}
                  />

                  <input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    className="flex-1 outline-none bg-transparent text-sm"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 font-medium mt-1 pl-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Email
                </label>

                <div className={`flex items-center border rounded-xl px-4 h-12 transition-all ${errors.email ? 'border-red-500 bg-red-50/10 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100' : 'border-[#E5D3A1] bg-[#FFFDF8] focus-within:border-[#C9A646] focus-within:ring-2 focus-within:ring-[#F4E3B2]'}`}>
                  <Mail
                    size={18}
                    className={`${errors.email ? 'text-red-500' : 'text-[#B8922E]'} mr-3 shrink-0`}
                  />

                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 outline-none bg-transparent text-sm"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium mt-1 pl-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#B8922E] mb-2">
                  Mật khẩu
                </label>

                <div className={`flex items-center border rounded-xl px-4 h-12 transition-all ${errors.password ? 'border-red-500 bg-red-50/10 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100' : 'border-[#E5D3A1] bg-[#FFFDF8] focus-within:border-[#C9A646] focus-within:ring-2 focus-within:ring-[#F4E3B2]'}`}>
                  <Lock
                    size={18}
                    className={`${errors.password ? 'text-red-500' : 'text-[#B8922E]'} mr-3 shrink-0`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className="flex-1 outline-none bg-transparent text-sm"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#B8922E] hover:text-[#8C6A16] transition-all"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium mt-1 pl-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      if (errors.agree) setErrors(prev => ({ ...prev, agree: "" }));
                    }}
                  />

                  <p className="text-[#7A5C12]">
                    Tôi đồng ý với{" "}
                    <span className="text-[#B8922E] font-semibold cursor-pointer hover:underline">
                      điều khoản sử dụng
                    </span>
                  </p>
                </div>
                {errors.agree && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {errors.agree}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500 font-medium">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#C9A646] hover:bg-[#B8922E] text-white text-lg font-bold shadow-lg transition-all disabled:opacity-60 flex items-center justify-center"
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-gray-200"></div>

              <span className="text-sm text-[#B8922E] font-semibold">
                HOẶC
              </span>

              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Social */}
            <div className="w-full">
              <button 
                type="button"
                onClick={handleGoogleRealSignIn}
                className="w-full h-12 rounded-xl border border-[#E5D3A1] bg-[#FFFDF8] hover:bg-[#FFF4D6] hover:border-[#C9A646] text-sm font-semibold text-[#7A5C12] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs hover:shadow-sm"
              >
                <GoogleIcon size={20} />
                Đăng ký bằng Google
              </button>
            </div>

            {/* Login */}
            <p className="text-center text-sm text-[#7A5C12] mt-7">
              Bạn đã có tài khoản?{" "}
              <NavLink
                to={PATHS.LOGIN}
                className="text-[#B8922E] font-bold hover:underline"
              >
                Đăng nhập ngay
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
              Đăng ký bằng Google
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Chọn một tài khoản Google để đăng ký nhanh hoặc chọn chế độ Đăng nhập Google thực tế.
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
                      console.error("Google Sign-In error:", e);
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