import { cn } from "@/lib/utils";

function getInitials(name) {
  if (!name) return "?";

  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfileAvatar({
  name,
  avatar,
  size = "md",
  className,
  showName = true,
}) {
  const initials = getInitials(name);

  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-sm"
      : size === "lg"
        ? "h-11 w-11 text-base"
        : "h-9 w-9 text-sm";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "grid shrink-0 place-items-center rounded-full border border-border bg-muted text-foreground font-medium overflow-hidden",
          sizeClass,
        )}
        aria-label={name ? `User ${name}` : "User"}
        title={name}
      >
        {avatar ? (
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>

      {showName ? (
        <div className="max-w-[220px] truncate text-sm font-medium">
          {name || "Unknown"}
        </div>
      ) : null}
    </div>
  );
}
