import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ProfileMenu from "@/components/dashboard/profile/ProfileMenu";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContext";

export default function ViewHeader({
  logo,
  className,
  name,
}) {
  const { t } = useTranslation();
  const { appName } = useSettings();
  return (
    <header
      className={cn(
        "sticky top-0 z-10 w-full border-b border-border bg-background",
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-3">
          {logo ? (
            <Link to="/" className="shrink-0 hover:opacity-85 transition-opacity cursor-pointer">
              {logo}
            </Link>
          ) : null}
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold leading-none">
              {appName || t('app.title')}
            </div>
            <div className="mt-1 truncate text-sm text-muted-foreground">
              {t('app.subtitle')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ProfileMenu name={name} />
        </div>
      </div>
    </header>
  );
}
