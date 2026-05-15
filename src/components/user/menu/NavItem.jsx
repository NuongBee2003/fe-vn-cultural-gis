import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

function isInternalHref(href) {
  return typeof href === "string" && href.startsWith("/");
}

export default function NavItem({ item, collapsed }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  if (collapsed) {
    const href = item.href || "#";
    const internal = isInternalHref(href) && !item.children;

    return (
      <div title={item.label} className="flex justify-center">
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
            ${open
              ? "bg-[var(--brand-primary-08)] text-[var(--muted-2)]"
              : "bg-transparent text-[var(--muted-1)] hover:bg-white/5 hover:text-[var(--muted-2)]"
            }`}
        >
          <Icon size={15} className="shrink-0 opacity-80" />
          <span className="flex-1">{item.label}</span>
          <ChevronDown
            size={12}
            className={`opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="ml-3.5 border-l border-[var(--brand-primary-18)] pl-2.5 mt-0.5">
            {item.children.map((child) => (
              isInternalHref(child.href) ? (
                <NavLink
                  key={child.label}
                  to={child.href}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] text-[var(--muted-1)] no-underline transition-all duration-150 mb-px hover:text-[var(--muted-2)] hover:bg-[var(--brand-primary-07)]"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--brand-primary-45)] shrink-0" />
                  {child.label}
                  {child.badge ? (
                    <span className="text-[9px] font-semibold px-1 py-px rounded bg-[var(--brand-primary)] text-[var(--brand-on-primary)] ml-0.5">
                      {child.badge}
                    </span>
                  ) : null}
                </NavLink>
              ) : (
                <a
                  key={child.label}
                  href={child.href}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] text-[var(--muted-1)] no-underline transition-all duration-150 mb-px hover:text-[var(--muted-2)] hover:bg-[var(--brand-primary-07)]"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--brand-primary-45)] shrink-0" />
                  {child.label}
                  {child.badge ? (
                    <span className="text-[9px] font-semibold px-1 py-px rounded bg-[var(--brand-primary)] text-[var(--brand-on-primary)] ml-0.5">
                      {child.badge}
                    </span>
                  ) : null}
                </a>
              )
            ))}
          </div>
        )}
      </div>
    );
  }

  const href = item.href || "#";
  if (!isInternalHref(href)) {
    return (
      <a
        href={href}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[13px] no-underline transition-all duration-150 text-[var(--muted-1)] border-l-2 border-transparent hover:bg-white/5 hover:text-[var(--muted-2)]"
      >
        <Icon size={15} />
        {item.label}
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
      {item.label}
    </NavLink>
  );
}
