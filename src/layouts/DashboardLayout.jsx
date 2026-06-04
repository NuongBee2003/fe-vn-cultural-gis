import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import DashboardSidebar from "@/layouts/dashboard/DashboardSidebar";
import DashboardTopbar from "@/layouts/dashboard/DashboardTopbar";
import ViewHeader from "@/layouts/dashboard/ViewHeader";
import logoVcm from "@/assets/logo-vcm.png";

export default function DashboardLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      const user = JSON.parse(adminUser);
      setUsername(user.username || "Admin");
    }
  }, []);

  return (
    <div
      data-theme="dashboard"
      className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground"
    >
      <ViewHeader
        logo={
          <img
            src={logoVcm}
            alt="Logo"
            className="h-10 w-auto max-w-[180px] object-contain"
          />
        }
        name={username}
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
