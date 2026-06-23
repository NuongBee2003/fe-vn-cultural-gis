import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BUSINESS_NAV_ITEMS } from "@/constants/businessNav";
import { authApi } from "@/api/authApi";
import { subscriptionApi } from "@/api/subscriptionApi";
import ProfileMenu from "@/components/dashboard/profile/ProfileMenu";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContext";
import logoVcm from "@/assets/logo-vcm.png";
import { ArrowLeft, RefreshCw, Sparkles, Menu, X, ChevronRight, Store } from "lucide-react";

export default function BusinessLayout() {
  const { appLogo, appName } = useSettings();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = authApi.getUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [activeSub, setActiveSub] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const fetchActiveSub = async () => {
    try {
      const data = await subscriptionApi.getMyActive();
      setActiveSub(data);
    } catch (err) {
      console.error("Lỗi lấy thông tin gói active trong BusinessLayout:", err);
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => {
    fetchActiveSub();
    // Listen for custom event to reload subscription status (e.g. after payment)
    const handleReloadSub = () => fetchActiveSub();
    window.addEventListener("reload-subscription", handleReloadSub);
    return () => window.removeEventListener("reload-subscription", handleReloadSub);
  }, []);

  const getPackageBadge = () => {
    if (loadingSub) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
          <RefreshCw className="h-3 w-3 animate-spin" />
        </span>
      );
    }
    const pkgName = activeSub?.is_default ? "Free" : (activeSub?.package?.name || "Free");
    if (pkgName === "Premium") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold text-amber-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-md shadow-amber-500/30 border border-amber-200">
          <Sparkles className="h-3.5 w-3.5 fill-amber-950/20" /> Business Premium
        </span>
      );
    }
    if (pkgName === "Plus") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold text-blue-950 bg-gradient-to-r from-blue-200 to-blue-400 border border-blue-300">
          Business Plus
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-slate-700 bg-gradient-to-r from-slate-200 to-slate-300 border border-slate-200">
        Business Free
      </span>
    );
  };

  const username = (() => {
    const adminUser = localStorage.getItem("adminUser") || localStorage.getItem("user");
    if (adminUser) {
      try {
        const parsed = JSON.parse(adminUser);
        return parsed.username || "Business User";
      } catch {
        return "Business User";
      }
    }
    return "Business User";
  })();

  return (
    <div
      data-theme="business"
      className="flex h-screen w-screen flex-col overflow-hidden bg-slate-900 text-slate-100 font-sans"
    >
      {/* View Header */}
      <header className="sticky top-0 z-20 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="shrink-0 hover:opacity-85 transition-opacity cursor-pointer">
              <img
                src={appLogo || logoVcm}
                alt="Logo"
                className="h-10 w-auto max-w-[180px] object-contain"
              />
            </Link>
            <div className="hidden sm:block border-l border-slate-800 pl-3 py-1">
              <div className="text-base font-bold tracking-tight bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent flex items-center gap-1.5">
                <Store size={18} className="text-amber-500" />
                {appName || "Di Sản Việt"} - Business Portal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {getPackageBadge()}
            <LanguageSwitcher />
            <div className="border-l border-slate-800 pl-3">
              <ProfileMenu name={username} />
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-16 left-0 z-10 flex w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 md:static md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="flex-1 overflow-auto p-4 space-y-1.5">
            <div className="px-3 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menu quản trị doanh nghiệp
            </div>
            {BUSINESS_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all group",
                    isActive
                      ? "bg-amber-500/10 text-amber-500 border-l-4 border-amber-500"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon ? (
                    <item.icon
                      className={cn(
                        "size-5 transition-transform duration-300 group-hover:scale-110",
                        pathname === item.to ? "text-amber-500" : "text-slate-400 group-hover:text-white"
                      )}
                    />
                  ) : null}
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>

          {/* Quick Action Bottom */}
          <div className="p-4 border-t border-slate-800">
            <Link
              to="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white no-underline transition-all shadow-sm"
            >
              <ArrowLeft size={16} />
              Quay lại Trang Chủ
            </Link>
          </div>
        </aside>

        {/* Content Wrapper */}
        <div className="min-w-0 flex-1 overflow-auto bg-slate-950 p-6">
          <div className="mx-auto w-full max-w-7xl h-full">
            <div className="min-h-full rounded-2xl border border-slate-800 bg-slate-900/55 p-6 shadow-xl backdrop-blur-xs text-slate-100">
              <Outlet context={{ activeSub, fetchActiveSub }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
