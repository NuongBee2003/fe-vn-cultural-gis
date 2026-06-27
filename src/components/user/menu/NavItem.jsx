import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

function isInternalHref(href) {
  return typeof href === "string" && href.startsWith("/");
}

function childLinkActive(pathname, href) {
  return isInternalHref(href) && pathname === href;
}

const childLinkClass = ({ isActive }) =>
  `flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] no-underline transition-all duration-150 mb-px
  ${isActive
    ? "bg-[var(--brand-primary-12)] text-[var(--brand-primary)] font-medium"
    : "text-[var(--muted-1)] hover:text-[var(--muted-2)] hover:bg-[var(--brand-primary-07)]"
  }`;

export default function NavItem({ item, collapsed }) {
  const { t } = useTranslation();
  const location = useLocation();
  const hasActiveChild =
    item.children?.some((child) =>
      childLinkActive(location.pathname, child.href),
    ) ?? false;
  const [open, setOpen] = useState(hasActiveChild);
  const [prevHasActiveChild, setPrevHasActiveChild] = useState(hasActiveChild);
  const Icon = item.icon;

  if (hasActiveChild !== prevHasActiveChild) {
    setPrevHasActiveChild(hasActiveChild);
    if (hasActiveChild) {
      setOpen(true);
    }
  }

  const translatedLabel = t(item.labelKey, item.label);

  if (collapsed) {
    const href = item.href || "#";
    const internal = isInternalHref(href) && !item.children && !item.newTab;

    return (
      <div title={translatedLabel} className="flex justify-center">
        {internal ? (
          <NavLink
            to={href}
            className={({ isActive }) =>
              `w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150
            ${isActive
                ? "bg-[var(--brand-primary-12)] text-[var(--brand-primary)]"
                : "text-[var(--muted-1)] hover:bg-white/5 hover:text-[var(--muted-2)]"
              }`
            }
          >
            <Icon size={17} />
          </NavLink>
        ) : (
          <a
            href={href}
            target={item.newTab ? "_blank" : undefined}
            rel={item.newTab ? "noopener noreferrer" : undefined}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 text-[var(--muted-1)] hover:bg-white/5 hover:text-[var(--muted-2)]"
          >
            <Icon size={17} />
          </a>
        )}
      </div>
    );
  }

  if (item.children) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[13px] transition-all duration-150 cursor-pointer font-[inherit] text-left border-0
            ${hasActiveChild
              ? "bg-[var(--brand-primary-12)] text-[var(--brand-primary)] font-medium border-l-2 border-[var(--brand-primary)]"
              : open
                ? "bg-[var(--brand-primary-08)] text-[var(--muted-2)]"
                : "bg-transparent text-[var(--muted-1)] hover:bg-white/5 hover:text-[var(--muted-2)]"
            }`}
        >
          <Icon size={15} className="shrink-0 opacity-80" />
          <span className="flex-1">{translatedLabel}</span>
          <ChevronDown
            size={12}
            className={`opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="ml-3.5 border-l border-[var(--brand-primary-18)] pl-2.5 mt-0.5">
            {item.children.map((child) => {
              const childLabel = t(child.labelKey, child.label);
              return isInternalHref(child.href) ? (
                <NavLink
                  key={child.labelKey || child.label}
                  to={child.href}
                  className={childLinkClass}
                >
                  <span
                    className={`w-1 h-1 rounded-full shrink-0 ${childLinkActive(location.pathname, child.href)
                      ? "bg-[var(--brand-primary)]"
                      : "bg-[var(--brand-primary-45)]"
                    }`}
                  />
                  {childLabel}
                  {child.badge ? (
                    <span className="text-[9px] font-semibold px-1 py-px rounded bg-[var(--brand-primary)] text-[var(--brand-on-primary)] ml-0.5">
                      {child.badge}
                    </span>
                  ) : null}
                </NavLink>
              ) : (
                <a
                  key={child.labelKey || child.label}
                  href={child.href}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] text-[var(--muted-1)] no-underline transition-all duration-150 mb-px hover:text-[var(--muted-2)] hover:bg-[var(--brand-primary-07)]"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--brand-primary-45)] shrink-0" />
                  {childLabel}
                  {child.badge ? (
                    <span className="text-[9px] font-semibold px-1 py-px rounded bg-[var(--brand-primary)] text-[var(--brand-on-primary)] ml-0.5">
                      {child.badge}
                    </span>
                  ) : null}
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const href = item.href || "#";
  if (!isInternalHref(href) || item.newTab) {
    return (
      <a
        href={href}
        target={item.newTab ? "_blank" : undefined}
        rel={item.newTab ? "noopener noreferrer" : undefined}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[13px] no-underline transition-all duration-150 text-[var(--muted-1)] border-l-2 border-transparent hover:bg-white/5 hover:text-[var(--muted-2)]"
      >
        <Icon size={15} />
        {translatedLabel}
      </a>
    );
  }

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[13px] no-underline transition-all duration-150
        ${isActive
            ? "bg-[var(--brand-primary-12)] text-[var(--brand-primary)] font-medium border-l-2 border-[var(--brand-primary)]"
            : "text-[var(--muted-1)] border-l-2 border-transparent hover:bg-white/5 hover:text-[var(--muted-2)]"
          }`
      }
    >
      <Icon size={15} />
      {translatedLabel}
    </NavLink>
  );
}
