import * as React from "react";
import { KeyRound, LogOut } from "lucide-react";

import ProfileAvatar from "@/components/dashboard/profile/ProfileAvatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popup/popover";
import { cn } from "@/lib/utils";

function MenuItem({ icon: Icon, children, className, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-foreground hover:bg-muted",
        className,
      )}
    >
      {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}

export default function ProfileMenu({
  name,
  className,
  onChangePassword,
  onLogout,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            className,
          )}
        >
          <ProfileAvatar name={name} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-1" align="end" sideOffset={8}>
        <MenuItem
          icon={KeyRound}
          onSelect={() => {
            setOpen(false);
            onChangePassword?.();
          }}
        >
          Đổi mật khẩu
        </MenuItem>
        <MenuItem
          icon={LogOut}
          className="text-destructive"
          onSelect={() => {
            setOpen(false);
            onLogout?.();
          }}
        >
          Đăng xuất
        </MenuItem>
      </PopoverContent>
    </Popover>
  );
}
