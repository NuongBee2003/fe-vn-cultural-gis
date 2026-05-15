import { cn } from "@/lib/utils";
import ProfileMenu from "@/components/dashboard/profile/ProfileMenu";

export default function ViewHeader({
  logo,
  title,
  description,
  className,
  name,
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 w-full border-b border-border bg-background",
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-3">
          {logo ? <div className="shrink-0">{logo}</div> : null}
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold leading-none">
              {title}
            </div>
            {description ? (
              <div className="mt-1 truncate text-sm text-muted-foreground">
                {description}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ProfileMenu name={name} />
        </div>
      </div>
    </header>
  );
}
