import * as React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS } from "@/constants/dashboardNav";
import { authApi } from "@/api/authApi";

function NavItemLink({ to, icon: Icon, label, labelKey }) {
  const { t } = useTranslation();
  const displayLabel = labelKey ? t(labelKey, { defaultValue: label }) : label;
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )
      }
    >
      {Icon ? <Icon className="size-4 shrink-0" /> : null}
      <span className="truncate">{displayLabel}</span>
    </NavLink>
  );
}

function NavGroup({ item, pathname, open, onOpenChange }) {
  const { t } = useTranslation();
  const isInGroup = item.base ? pathname.startsWith(item.base) : false;
  const navigate = useNavigate();
  const Icon = item.icon;
  const displayLabel = item.labelKey ? t(item.labelKey, { defaultValue: item.label }) : item.label;

  return (
    <div>
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          isInGroup
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <button
          type="button"
          onClick={() => {
            if (item.base) navigate(item.base);
            onOpenChange(true);
          }}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          {Icon ? <Icon className="size-4 shrink-0" /> : null}
          <span className="truncate">{displayLabel}</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          className="grid size-8 shrink-0 place-items-center rounded-md hover:bg-muted"
          aria-label={open ? "Collapse" : "Expand"}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              open ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
      </div>

      {open ? (
        <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-border pl-3">
          {item.children.map((child) => {
            const childLabel = child.labelKey ? t(child.labelKey, { defaultValue: child.label }) : child.label;
            return (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {childLabel}
              </NavLink>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardSidebar() {
  const { pathname } = useLocation();
  const [openBase, setOpenBase] = React.useState(null);

  const navItems = DASHBOARD_NAV_ITEMS;

  React.useEffect(() => {
    const activeGroup = navItems.find(
      (item) => item.base && pathname.startsWith(item.base),
    );
    setOpenBase(activeGroup?.base ?? null);
  }, [pathname, navItems]);

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-background">
      <nav className="flex-1 overflow-auto p-2">
        <div className="flex flex-col gap-1">
          {navItems.map((item) =>
            item.children ? (
              <NavGroup
                key={item.labelKey || item.label}
                item={item}
                pathname={pathname}
                open={openBase === item.base}
                onOpenChange={(next) => setOpenBase(next ? item.base : null)}
              />
            ) : (
              <NavItemLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                labelKey={item.labelKey}
              />
            ),
          )}
        </div>
      </nav>

      {/* Button to go back to Home UI */}
      <div className="p-3 border-t border-border">
        <NavLink
          to="/"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white no-underline transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          Về trang chủ UI
        </NavLink>
      </div>
    </aside>
  );
}
