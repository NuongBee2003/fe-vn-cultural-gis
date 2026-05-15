import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/features/dash/components/DashboardSidebar";
import DashboardTopbar from "@/features/dash/components/DashboardTopbar";
import ViewHeader from "@/components/ViewHeader";
import logoVcm from "@/assets/logo-VCM.png";
import { useState } from "react";

export default function DashboardLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <ViewHeader
        logo={
          <img
            src={logoVcm}
            alt="Logo"
            className="h-10 w-auto max-w-[180px] object-contain"
          />
        }
        title="VietCulture Map"
        description="Bản đồ văn hóa Việt Nam"
        name={"Nguyễn Thành Đạt"}
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
