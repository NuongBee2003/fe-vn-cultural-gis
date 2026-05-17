import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  UserPlus,
  LogIn,
  Star,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import NavItem from "./NavItem";
import logoVcm from "@/assets/logo-vcm.png";
import { MENU_NAV_ITEMS } from "@/constants/menuNav";
import { PATHS } from "@/constants/paths";

export default function Menu() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={` z-[2000] h-screen bg-[var(--brand-bg)] border-r border-[var(--brand-primary-18)] flex flex-col overflow-hidden transition-all duration-300 ease-in-out shadow-2xl
        ${collapsed ? "w-16" : "w-60"}`}
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
          title={collapsed ? "Mở sidebar" : "Đóng sidebar"}
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 cursor-pointer transition-all duration-150
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
            Điều hướng
          </div>
        )}
        {MENU_NAV_ITEMS.map((item) => (
          <NavItem key={item.label} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Login and Register */}
      <div className="px-1.5 py-2.5 border-t border-[var(--brand-primary-18)] flex flex-col gap-1.5">
        {collapsed ? (
          <>
            <div className="flex justify-center">
              <button
                title="Đăng ký"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--brand-primary)] bg-transparent border border-[var(--brand-primary-35)] cursor-pointer hover:bg-[var(--brand-primary-10)] transition-all"
              >
                <UserPlus size={15} />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                title="Đăng nhập"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--brand-on-primary)] bg-[var(--brand-primary)] border-none cursor-pointer hover:bg-[var(--brand-primary-variant)] transition-all"
              >
                <LogIn size={15} />
              </button>
            </div>
          </>
        ) : (
          <>
            <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-[var(--brand-primary)] bg-transparent border border-[var(--brand-primary-35)] cursor-pointer transition-all hover:bg-[var(--brand-primary-10)]">
              <UserPlus size={13} /> Đăng ký
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-[var(--brand-on-primary)] bg-[var(--brand-primary)] border-none cursor-pointer transition-all hover:bg-[var(--brand-primary-variant)]">
              <LogIn size={13} /> Đăng nhập
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
