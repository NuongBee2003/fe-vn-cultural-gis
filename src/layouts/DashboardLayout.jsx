import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import DashboardSidebar from "@/layouts/dashboard/DashboardSidebar";
import DashboardTopbar from "@/layouts/dashboard/DashboardTopbar";
import ViewHeader from "@/layouts/dashboard/ViewHeader";
import logoVcm from "@/assets/logo-vcm.png";
import { useSettings } from "@/context/SettingsContext";

export default function DashboardLayout() {
  const { appLogo } = useSettings();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const getStoredUserInfo = () => {
    const adminUser = localStorage.getItem("adminUser") || localStorage.getItem("user");
    if (adminUser) {
      try {
        return JSON.parse(adminUser);
      } catch {
        return null;
      }
    }
    return null;
  };

  const [userInfo, setUserInfo] = useState(getStoredUserInfo);

  useEffect(() => {
    const handleUpdate = () => {
      setUserInfo(getStoredUserInfo());
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("local-storage-update", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("local-storage-update", handleUpdate);
    };
  }, []);

  return (
    <div
      data-theme="dashboard"
      className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground"
    >
      <ViewHeader
        logo={
          <img
            src={appLogo || logoVcm}
            alt="Logo"
            className="h-10 w-auto max-w-[180px] object-contain"
          />
        }
        name={userInfo?.username || "User"}
        avatar={userInfo?.avatar}
      />

      <DashboardTopbar onToggleSidebar={() => setSidebarVisible((v) => !v)} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {sidebarVisible ? <DashboardSidebar /> : null}
        <div className="min-w-0 flex-1 overflow-auto bg-muted/40">
          <div className="mx-auto w-full p-4">
            <div className="min-h-full rounded-xl border bg-background">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
