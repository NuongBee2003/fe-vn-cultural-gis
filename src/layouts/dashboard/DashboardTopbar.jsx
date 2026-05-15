import { Link, useLocation } from "react-router-dom";
import { PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { getDashboardBreadcrumbs } from "@/constants/dashboardNav";

export default function DashboardTopbar({ className, onToggleSidebar }) {
  const { pathname } = useLocation();
  const breadcrumbs = getDashboardBreadcrumbs(pathname);

  return (
    <div
      className={cn(
        "sticky top-16 z-10 flex h-12 items-center gap-4 border-b border-border bg-background px-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="grid size-9 place-items-center rounded-md hover:bg-muted"
          title="Menu"
        >
          <PanelLeft className="size-5" />
        </button>

        {breadcrumbs.length ? (
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbs.map((bc, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div
                  key={`${bc.label}-${idx}`}
                  className="flex min-w-0 items-center gap-2"
                >
                  {bc.to && !isLast ? (
                    <Link to={bc.to} className="truncate hover:text-foreground">
                      {bc.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        "truncate",
                        isLast ? "text-foreground font-medium" : "",
                      )}
                    >
                      {bc.label}
                    </span>
                  )}
                  {!isLast ? <span className="shrink-0">›</span> : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
