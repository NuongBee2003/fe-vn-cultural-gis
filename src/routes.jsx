import { PATHS } from "@/constants/paths";
import { Navigate } from "react-router-dom";

import MapLayout from "@/layouts/MapLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardSectionPage from "@/pages/dashboard/DashboardSectionPage";
import PlacesManagementPage from "@/pages/dashboard/PlacesManagementPage";
import CategoriesManagementPage from "@/pages/dashboard/CategoriesManagementPage";
import PostsManagementPage from "@/pages/dashboard/PostsManagementPage";
import UsersManagementPage from "@/pages/dashboard/UsersManagementPage";
import CuisineManagementPage from "@/pages/dashboard/CuisineManagementPage";
import CustomManagementPage from "@/pages/dashboard/CustomManagementPage";
import FolkArtManagementPage from "@/pages/dashboard/FolkArtManagementPage";
import ExhibitionsManagementPage from "@/pages/dashboard/ExhibitionsManagementPage";
import HolidaysPage from "@/pages/holiday/HolidaysPage";
import HistoryPage from "@/pages/history/HistoryPage";
import ExhibitionPage from "@/pages/exhibition/ExhibitionPage";
import ShopPage from "@/pages/shop/ShopPage";
import CultureFoodPage from "@/pages/culture/CultureFoodPage";
import CultureCustomsPage from "@/pages/culture/CultureCustomsPage";
import CultureFolkArtPage from "@/pages/culture/CultureFolkArtPage";
import CommunityPage from "@/pages/community/CommunityPage";
import LoginPage from "@/pages/login&register/login";
import RegisterPage from "@/pages/login&register/register";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";

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
    path: PATHS.HOLIDAYS,
    element: (
      <MapLayout>
        <HolidaysPage />
      </MapLayout>
    ),
    title: "Lịch lễ Việt Nam",
  },
  {
    path: PATHS.COMMUNITY,
    element: (
      <MapLayout>
        <CommunityPage />
      </MapLayout>
    ),
    title: "Cộng đồng",
  },
  {
    path: PATHS.LOGIN,
    element: (
      <LoginPage />
    ),
    title: "ĐĂNG NHẬP",
  },
  {
    path: PATHS.REGISTER,
    element: (
      <RegisterPage />
    ),
    title: "ĐĂNG KÝ",
  },
  {
    path: PATHS.ADMIN_LOGIN,
    element: <AdminLoginPage />,
    title: "ĐĂNG NHẬP ADMIN",
  },
  {
    path: PATHS.HISTORY,
    element: (
      <MapLayout>
        <HistoryPage />
      </MapLayout>
    ),
    title: "Hành trình lịch sử Việt Nam",
  },
  {
    path: PATHS.EXHIBITION,
    element: (
      <MapLayout>
        <ExhibitionPage />
      </MapLayout>
    ),
    title: "Triển lãm ảo",
  },
  {
    path: PATHS.SHOP,
    element: (
      <MapLayout>
        <ShopPage />
      </MapLayout>
    ),
    title: "Mua sắm văn hóa",
  },
  {
    path: PATHS.CULTURE_FOOD,
    element: (
      <MapLayout>
        <CultureFoodPage />
      </MapLayout>
    ),
    title: "Ẩm thực Việt Nam",
  },
  {
    path: PATHS.CULTURE_CUSTOMS,
    element: (
      <MapLayout>
        <CultureCustomsPage />
      </MapLayout>
    ),
    title: "Phong tục tập quán",
  },
  {
    path: PATHS.CULTURE_FOLK_ART,
    element: (
      <MapLayout>
        <CultureFolkArtPage />
      </MapLayout>
    ),
    title: "Nghệ thuật dân gian",
  },
  {
    path: PATHS.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    title: "Dashboard",
    protected: true,
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
        element: <CategoriesManagementPage />,
        title: "Quản lý danh mục địa điểm",
      },
      {
        path: PATHS.DASHBOARD_REPORTS,
        element: <Navigate to={PATHS.DASHBOARD_REPORTS_HOT_PLACES} replace />,
        title: "Báo cáo",
      },
      {
        path: PATHS.DASHBOARD_PLACES,
        element: <PlacesManagementPage />,
        title: "Quản lý địa điểm",
      },
      {
        path: PATHS.DASHBOARD_COMMUNITY_POSTS,
        element: <PostsManagementPage />,
        title: "Quản lý bài viết",
      },
      {
        path: PATHS.DASHBOARD_COMMUNITY_REVIEWS,
        element: dashPage("Quản lý đánh giá", "Đánh giá từ người dùng"),
        title: "Quản lý đánh giá",
      },
      {
        path: PATHS.DASHBOARD_USERS_ROLES,
        element: <UsersManagementPage />,
        title: "Quản lý tài khoản",
      },
      {
        path: PATHS.DASHBOARD_USERS_ACCOUNTS,
        element: <UsersManagementPage />,
        title: "Quản lý tài khoản",
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
        path: PATHS.DASHBOARD_EXHIBITIONS,
        element: <ExhibitionsManagementPage />,
        title: "Quản lý triển lãm ảo",
      },
      {
        path: PATHS.DASHBOARD_CULTURE,
        element: <Navigate to={PATHS.DASHBOARD_CULTURE_CUISINES} replace />,
        title: "Quản lý văn hóa",
      },
      {
        path: PATHS.DASHBOARD_CULTURE_CUISINES,
        element: <CuisineManagementPage />,
        title: "Quản lý ẩm thực",
      },
      {
        path: PATHS.DASHBOARD_CULTURE_CUSTOMS,
        element: <CustomManagementPage />,
        title: "Quản lý phong tục",
      },
      {
        path: PATHS.DASHBOARD_CULTURE_FOLK_ARTS,
        element: <FolkArtManagementPage />,
        title: "Quản lý nghệ thuật dân gian",
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
