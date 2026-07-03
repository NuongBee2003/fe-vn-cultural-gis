import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserPlus,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu as MenuIcon,
  Shield,
  User,
  Mail,
  ChevronUp,
  X,
  Crown,
  Store,
  Settings,
} from "lucide-react";
import NavItem from "./NavItem";
import logoVcm from "@/assets/logo-vcm.png";
import UserProfileModal from "./UserProfileModal";
import { MENU_NAV_ITEMS } from "@/constants/menuNav";
import { PATHS } from "@/constants/paths";
import { useSettings } from "@/context/SettingsContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

function getRoleBadge(role) {
  const r = String(role || "").toLowerCase();
  if (r === "admin") {
    return {
      label: "Quản trị viên",
      icon: <Crown size={11} />,
      className: "bg-amber-100 text-amber-700 border-amber-300",
    };
  }
  if (r === "moderator" || r === "mod") {
    return {
      label: "Kiểm duyệt viên",
      icon: <Shield size={11} />,
      className: "bg-indigo-100 text-indigo-700 border-indigo-300",
    };
  }
  if (r === "business") {
    return {
      label: "Doanh nghiệp",
      icon: <Store size={11} />,
      className: "bg-blue-100 text-blue-700 border-blue-300",
    };
  }
  return {
    label: "Người dùng",
    icon: <User size={11} />,
    className: "bg-slate-100 text-slate-600 border-slate-300",
  };
}

export default function Menu() {
  const { appName, appLogo } = useSettings();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileRef = useRef(null);

  const getStoredUserInfo = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const userRaw = localStorage.getItem("user") || localStorage.getItem("adminUser");
    const isLogin = localStorage.getItem("isLogin") === "true" || !!token;
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, isLogin, user };
  };

  const [userInfo, setUserInfo] = useState(getStoredUserInfo());

  useEffect(() => {
    const handleUpdate = () => {
      setUserInfo(getStoredUserInfo());
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("local-storage-update", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("local-storage-update", handleUpdate);
    };
  }, []);

  const { isLogin, user } = userInfo;

  // Đóng popup khi click ngoài
  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminUser");
    window.location.reload();
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[1999]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-[1500] w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--brand-primary)] pointer-events-auto"
      >
        <MenuIcon size={20} />
      </button>

      <aside
        className={`z-[2000] h-screen bg-[var(--brand-bg)] border-r border-[var(--brand-primary-18)] flex flex-col overflow-hidden transition-all duration-300 ease-in-out shadow-2xl
          fixed md:relative top-0 left-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "w-60 md:w-16" : "w-60"}`}
      >

        {/* Brand + Toggle */}
        <div
          className={`border-b border-[var(--brand-primary-18)] flex items-center min-h-[64px] px-3 py-3.5
        ${collapsed ? "justify-center" : "justify-between gap-2"}`}
        >
          {!collapsed && (
            <NavLink
              to={PATHS.HOME}
              className="flex items-center gap-2.5 no-underline overflow-hidden"
            >
              <div className="w-[34px] h-[34px] rounded-full border border-[var(--brand-primary)] flex items-center justify-center shrink-0 bg-white">
                <img
                  src={appLogo || logoVcm}
                  alt={appName || "VietCulture"}
                  className=" object-contain"
                />
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[9px] tracking-widest font-medium uppercase text-[var(--brand-primary)] whitespace-nowrap">
                  {(appName || "VietCulture").replace(/ map$/i, "").trim()}
                </div>
                <div
                  className="text-[14px] font-semibold text-[var(--muted-2)] whitespace-nowrap"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {/(map)$/i.test(appName || "") ? "Map" : "Map"}
                </div>
              </div>
            </NavLink>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? t("nav.openSidebar", "Mở sidebar") : t("nav.closeSidebar", "Đóng sidebar")}
            className="hidden md:flex w-7 h-7 rounded-md items-center justify-center shrink-0 cursor-pointer transition-all duration-150
            bg-white/5 border border-[var(--brand-primary-18)] text-[var(--muted-1)]
            hover:bg-[var(--brand-primary-12)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary-50)]"
          >
            {collapsed ? (
              <PanelLeftOpen size={14} />
            ) : (
              <PanelLeftClose size={14} />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-2.5 flex flex-col gap-0.5">
          {!collapsed && (
            <div className="text-[9px] tracking-widest uppercase text-[var(--brand-primary-50)] font-semibold px-2.5 pb-2 pt-1 whitespace-nowrap">
              {t("nav.navigation", "Điều hướng")}
            </div>
          )}
          {MENU_NAV_ITEMS.map((item) => (
            <NavItem key={item.labelKey || item.label} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="relative z-50 px-1.5 py-2 border-t border-[var(--brand-primary-18)] flex flex-col gap-1.5">
          {collapsed ? (
            <div className="flex justify-center">
              <LanguageSwitcher collapsed={collapsed} />
            </div>
          ) : (
            <div className="px-1">
              <LanguageSwitcher variant="menu" />
            </div>
          )}
        </div>

        {/* Login and Register or User Profile */}
        <div ref={profileRef} className="relative z-50 px-1.5 py-2.5 border-t border-[var(--brand-primary-18)] flex flex-col gap-1.5">

          {/* Profile Popup */}
          {profileOpen && isLogin && user && (
            <div className="absolute bottom-full left-1.5 right-1.5 mb-2 rounded-2xl border border-[var(--brand-primary-18)] bg-[var(--brand-bg)] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
              {/* Header popup */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--brand-primary-18)]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--brand-primary-50)]">
                  Thông tin tài khoản
                </p>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Avatar + tên + email */}
              <div className="px-4 py-4 flex items-center gap-3">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#5D4037] text-white flex items-center justify-center text-base font-bold overflow-hidden shadow-md ring-2 ring-[var(--brand-primary-35)]">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user?.username ? user.username.charAt(0).toUpperCase() : "U"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-100 truncate">{user?.username || "Người dùng"}</p>
                  {user?.email && (
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <Mail size={10} />
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="px-4 pb-3 space-y-2">
                {/* Role / Quyền */}
                <div className="flex items-center justify-between rounded-xl bg-white/5 border border-[var(--brand-primary-18)] px-3 py-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Shield size={13} className="text-[var(--brand-primary-50)]" />
                    <span>Quyền hạn</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${roleBadge.className}`}>
                    {roleBadge.icon}
                    {roleBadge.label}
                  </span>
                </div>

                {/* ID tài khoản */}
                {user?.id && (
                  <div className="flex items-center justify-between rounded-xl bg-white/5 border border-[var(--brand-primary-18)] px-3 py-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <User size={13} className="text-[var(--brand-primary-50)]" />
                      <span>ID tài khoản</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-300">#{user.id}</span>
                  </div>
                )}

                {/* Cập nhật thông tin */}
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-[var(--brand-primary-18)] hover:bg-white/10 px-3 py-2.5 text-xs font-semibold text-slate-200 cursor-pointer transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <Settings size={13} className="text-[var(--brand-primary-50)]" />
                    <span>Cập nhật thông tin</span>
                  </div>
                  <span className="text-slate-400">→</span>
                </button>

                {/* Trang quản lý nếu là admin */}
                {String(user?.role || "").toLowerCase() === "admin" && (
                  <NavLink
                    to={PATHS.DASHBOARD}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 px-3 py-2.5 text-xs font-semibold text-amber-400 no-underline cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={13} className="text-amber-500" />
                      <span>Trang quản lý</span>
                    </div>
                    <span>→</span>
                  </NavLink>
                )}

                {/* Trang doanh nghiệp nếu là business hoặc admin */}
                {(String(user?.role || "").toLowerCase() === "business" || String(user?.role || "").toLowerCase() === "admin") && (
                  <NavLink
                    to={PATHS.BUSINESS_DASHBOARD}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 px-3 py-2.5 text-xs font-semibold text-blue-400 no-underline cursor-pointer transition-all mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <Store size={13} className="text-blue-500" />
                      <span>Trang doanh nghiệp</span>
                    </div>
                    <span>→</span>
                  </NavLink>
                )}
              </div>

              {/* Nút đăng xuất */}
              <div className="px-4 pb-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[12px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-300 cursor-pointer transition-all"
                >
                  <LogOut size={13} />
                  {t("auth.logout", "Đăng xuất")}
                </button>
              </div>
            </div>
          )}

          {isLogin ? (
            collapsed ? (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  title="Xem thông tin tài khoản"
                  className="w-9 h-9 rounded-full bg-[#5D4037] text-white flex items-center justify-center text-sm font-semibold overflow-hidden shadow-sm cursor-pointer hover:ring-2 hover:ring-[var(--brand-primary-50)] transition-all"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user?.username ? user.username.charAt(0).toUpperCase() : "U"
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  title={t("auth.logout", "Đăng xuất")}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-rose-600 bg-transparent border border-rose-200 cursor-pointer hover:bg-rose-50 transition-all"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="w-full flex flex-col gap-2 bg-white/5 rounded-xl p-2 border border-[var(--brand-primary-18)] cursor-pointer hover:bg-white/10 hover:border-[var(--brand-primary-35)] transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#5D4037] text-white flex items-center justify-center text-xs font-semibold overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      user?.username ? user.username.charAt(0).toUpperCase() : "U"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {user?.username || "Người dùng"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                  <ChevronUp
                    size={14}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-0" : "rotate-180"}`}
                  />
                </div>
              </button>
            )
          ) : (
            collapsed ? (
              <>
                <div className="flex justify-center">
                  <NavLink
                    to={PATHS.REGISTER}
                    title={t("auth.register", "Đăng ký")}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--brand-primary)] bg-transparent border border-[var(--brand-primary-35)] cursor-pointer hover:bg-[var(--brand-primary-10)] transition-all"
                  >
                    <UserPlus size={15} />
                  </NavLink>
                </div>
                <div className="flex justify-center">
                  <NavLink
                    to={PATHS.LOGIN}
                    title={t("auth.login", "Đăng nhập")}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--brand-on-primary)] bg-[var(--brand-primary)] border-none cursor-pointer hover:bg-[var(--brand-primary-variant)] transition-all"
                  >
                    <LogIn size={15} />
                  </NavLink>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to={PATHS.REGISTER}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-[var(--brand-primary)] bg-transparent border border-[var(--brand-primary-35)] cursor-pointer transition-all hover:bg-[var(--brand-primary-10)] no-underline"
                >
                  <UserPlus size={13} /> {t("auth.register", "Đăng ký")}
                </NavLink>
                <NavLink
                  to={PATHS.LOGIN}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-[var(--brand-on-primary)] bg-[var(--brand-primary)] border-none cursor-pointer transition-all hover:bg-[var(--brand-primary-variant)] no-underline"
                >
                  <LogIn size={13} /> {t("auth.login", "Đăng nhập")}
                </NavLink>
              </>
            )
          )}
        </div>
      </aside>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={user}
      />
    </>
  );
}
