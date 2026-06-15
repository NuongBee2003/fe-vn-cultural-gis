import { useState } from "react";
import { Grip, X, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const userRaw = localStorage.getItem("user") || localStorage.getItem("adminUser");
  const isLogin = localStorage.getItem("isLogin") === "true" || !!token;
  const user = userRaw ? JSON.parse(userRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminUser");
    setIsOpen(false);
    navigate(PATHS.HOME);
  };

  if (!isLogin) {
    return null;
  }

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative flex items-center gap-2 pointer-events-auto">

      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 rounded-full bg-[#5D4037] text-white flex items-center justify-center text-lg font-medium shadow-md hover:ring-2 hover:ring-offset-2 hover:ring-[#5D4037] transition-all overflow-hidden"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {/* Popup Menu */}
      {isOpen && (
        <div className="absolute top-14 right-0 w-[360px] bg-[#EEF2F6] rounded-3xl shadow-2xl overflow-hidden z-50 border border-gray-200">
          <div className="relative p-5 flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>

            {/* Email */}
            <p className="text-sm font-medium text-gray-800 mt-2 mb-6">
              {user?.email || "Chưa cập nhật email"}
            </p>

            {/* Big Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#5D4037] text-white flex items-center justify-center text-3xl font-medium shadow-sm mb-4 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>

            <h3 className="text-xl font-medium text-gray-900 mb-1">
              Xin chào, {user?.username || "Người dùng"}!
            </h3>
            
            <button className="mt-4 px-6 py-2 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 bg-white transition-colors">
              Quản lý tài khoản
            </button>

            {String(user?.role || "").toLowerCase() === "admin" && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate(PATHS.DASHBOARD);
                }}
                className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold transition-all shadow-sm"
              >
                <Shield size={16} />
                Trang quản lý
              </button>
            )}
          </div>

          <div className="p-2 bg-white rounded-b-3xl">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl transition-colors font-medium"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
