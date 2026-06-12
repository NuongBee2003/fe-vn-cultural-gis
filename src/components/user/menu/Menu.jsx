import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserPlus,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu as MenuIcon,
} from "lucide-react";
import NavItem from "./NavItem";
import logoVcm from "@/assets/logo-vcm.png";
import { MENU_NAV_ITEMS } from "@/constants/menuNav";
import { PATHS } from "@/constants/paths";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function Menu() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    window.location.reload();
  };

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
                  src={logoVcm}
                  alt="VietCulture"
                  className=" object-contain"
                />
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[9px] tracking-widest font-medium uppercase text-[var(--brand-primary)] whitespace-nowrap">
                  VietCulture
                </div>
                <div
                  className="text-[14px] font-semibold text-[var(--muted-2)] whitespace-nowrap"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Map
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
        <div className="relative z-50 px-1.5 py-2.5 border-t border-[var(--brand-primary-18)] flex flex-col gap-1.5">
          {isLogin ? (
            collapsed ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#5D4037] text-white flex items-center justify-center text-sm font-semibold overflow-hidden shadow-sm">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user?.username ? user.username.charAt(0).toUpperCase() : "U"
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  title={t("auth.logout", "Đăng xuất")}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-rose-600 bg-transparent border border-rose-200 cursor-pointer hover:bg-rose-50 transition-all"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 bg-white/5 rounded-xl p-2 border border-[var(--brand-primary-18)]">
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
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 py-1.5 mt-1 rounded-lg text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border-none cursor-pointer transition-all w-full"
                >
                  <LogOut size={12} /> {t("auth.logout", "Đăng xuất")}
                </button>
              </div>
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
    </>
  );
}
