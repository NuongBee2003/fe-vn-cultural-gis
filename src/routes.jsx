import { PATHS } from "@/constants/paths";
import { Navigate } from "react-router-dom";

import MapLayout from "@/layouts/MapLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardSectionPage from "@/pages/dashboard/DashboardSectionPage";

function dashPage(title, description) {
  return <DashboardSectionPage title={title} description={description} />;
}

export const routeConfig = [
  {
    path: PATHS.HOME,
    element: <MapLayout />,
    title: "Di Sản Việt — Bản đồ văn hóa",
  },

  {
    path: PATHS.DASHBOARD,
    element: <DashboardLayout />,
    title: "Dashboard",
    protected: false, // TODO: đổi thành true khi có AuthGuard
    children: [
      {
        index: true,
        element: dashPage("Dashboard", "Chào mừng đến bảng quản trị"),
        title: "Tổng quan",
      },
      {
        path: PATHS.DASHBOARD_USERS,
        element: <Navigate to={PATHS.DASHBOARD_USERS_ROLES} replace />,
        title: "Quản lý người dùng",
      },
      {
        path: PATHS.DASHBOARD_CATEGORIES,
        element: <Navigate to={PATHS.DASHBOARD_CATEGORIES_FOODS} replace />,
        title: "Quản lý thể loại",
      },
      {
        path: PATHS.DASHBOARD_REPORTS,
        element: <Navigate to={PATHS.DASHBOARD_REPORTS_HOT_PLACES} replace />,
        title: "Báo cáo",
      },
      {
        path: PATHS.DASHBOARD_PLACES,
        element: dashPage(
          "Quản lý địa điểm",
          "Danh sách và quản lý các địa điểm",
        ),
        title: "Quản lý địa điểm",
      },
      {
        path: PATHS.DASHBOARD_COMMUNITY_POSTS,
        element: dashPage("Quản lý bài viết", "Bài viết từ cộng đồng"),
        title: "Quản lý bài viết",
      },
      {
        path: PATHS.DASHBOARD_COMMUNITY_REVIEWS,
        element: dashPage("Quản lý đánh giá", "Đánh giá từ người dùng"),
        title: "Quản lý đánh giá",
      },
      {
        path: PATHS.DASHBOARD_USERS_ROLES,
        element: dashPage("Quản lý quyền", "Phân quyền hệ thống"),
        title: "Quản lý quyền",
      },
      {
        path: PATHS.DASHBOARD_USERS_ACCOUNTS,
        element: dashPage("Quản lý tài khoản", "Danh sách tài khoản người dùng"),
        title: "Quản lý tài khoản",
      },
      {
        path: PATHS.DASHBOARD_CATEGORIES_FOODS,
        element: dashPage("Quản lý ẩm thực", "Danh mục ẩm thực Việt Nam"),
        title: "Quản lý ẩm thực",
      },
      {
        path: PATHS.DASHBOARD_CATEGORIES_HISTORICAL,
        element: dashPage(
          "Quản lý di tích lịch sử",
          "Di tích và địa danh lịch sử",
        ),
        title: "Quản lý di tích lịch sử",
      },
      {
        path: PATHS.DASHBOARD_EXPERIENCES,
        element: dashPage("Quản lý trải nghiệm", "Các trải nghiệm văn hóa"),
        title: "Quản lý trải nghiệm",
      },
      {
        path: PATHS.DASHBOARD_EVENTS,
        element: dashPage("Quản lý sự kiện", "Lịch sự kiện văn hóa"),
        title: "Quản lý sự kiện",
      },
      {
        path: PATHS.DASHBOARD_REPORTS_HOT_PLACES,
        element: dashPage("Địa điểm hot", "Báo cáo địa điểm phổ biến"),
        title: "Báo cáo — Địa điểm hot",
      },
    ],
  },

  // 404 Path
  // {
  //   path: PATHS.NOT_FOUND,
  //   element: <ErrorPage />,
  //   title: "Trang không tồn tại",
  // },
];
