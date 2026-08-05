import { PATHS } from "@/constants/paths";
import { Navigate } from "react-router-dom";

import MapLayout from "@/layouts/MapLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardSectionPage from "@/pages/admin/DashboardSectionPage";
import PlacesManagementPage from "@/pages/admin/PlacesManagementPage";
import CategoriesManagementPage from "@/pages/admin/CategoriesManagementPage";
import PostsManagementPage from "@/pages/admin/PostsManagementPage";
import UsersManagementPage from "@/pages/admin/UsersManagementPage";
import CuisineManagementPage from "@/pages/admin/CuisineManagementPage";
import CustomManagementPage from "@/pages/admin/CustomManagementPage";
import FolkArtManagementPage from "@/pages/admin/FolkArtManagementPage";
import ExhibitionsManagementPage from "@/pages/admin/ExhibitionsManagementPage";
import HolidaysPage from "@/pages/user/holiday/HolidaysPage";
import HistoryPage from "@/pages/user/history/HistoryPage";
import ExhibitionPage from "@/pages/user/exhibition/ExhibitionPage";
import ShopPage from "@/pages/user/shop/ShopPage";
import CultureFoodPage from "@/pages/user/culture/CultureFoodPage";
import CultureCustomsPage from "@/pages/user/culture/CultureCustomsPage";
import CultureFolkArtPage from "@/pages/user/culture/CultureFolkArtPage";
import CommunityPage from "@/pages/user/community/CommunityPage";
import PostModalPage from "@/pages/user/community/PostModalPage";
import LoginPage from "@/pages/user/auth/LoginPage";
import RegisterPage from "@/pages/user/auth/RegisterPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import SettingsManagementPage from "@/pages/admin/SettingsManagementPage";
import ReviewsManagementPage from "@/pages/admin/ReviewsManagementPage";
import HolidaysManagementPage from "@/pages/admin/HolidaysManagementPage";
import ProductsManagementPage from "@/pages/admin/ProductsManagementPage";
import ReportsManagementPage from "@/pages/admin/ReportsManagementPage";

import BusinessOverviewPage from "@/pages/business/BusinessOverviewPage";
import BusinessProductsPage from "@/pages/business/BusinessProductsPage";
import SubscriptionPackagesPage from "@/pages/business/SubscriptionPackagesPage";
import PaymentResultPage from "@/pages/business/PaymentResultPage";
import BusinessLayout from "@/layouts/BusinessLayout";
import LandingPage from "@/pages/user/shop/LandingPage";

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
    path: "/post/:id",
    element: (
      <MapLayout>
        <PostModalPage />
      </MapLayout>
    ),
    title: "Chi tiết bài viết",
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
      <ProtectedRoute allowedRoles={["admin"]}>
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
        element: <Navigate to={PATHS.DASHBOARD_REPORTS_USER} replace />,
        title: "Báo cáo",
      },
      {
        path: PATHS.DASHBOARD_REPORTS_USER,
        element: <ReportsManagementPage />,
        title: "Quản lý báo cáo vi phạm",
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
        element: <ReviewsManagementPage />,
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
        path: PATHS.DASHBOARD_HOLIDAYS,
        element: <HolidaysManagementPage />,
        title: "Quản lý lịch lễ",
      },
      {
        path: PATHS.DASHBOARD_PRODUCTS,
        element: <ProductsManagementPage />,
        title: "Quản lý sản phẩm",
      },
      {
        path: PATHS.DASHBOARD_REPORTS_HOT_PLACES,
        element: dashPage("Địa điểm hot", "Báo cáo địa điểm phổ biến"),
        title: "Báo cáo — Địa điểm hot",
      },
      {
        path: PATHS.DASHBOARD_SETTINGS,
        element: <SettingsManagementPage />,
        title: "Cài đặt hệ thống",
      }
    ],
  },
  {
    path: PATHS.LANDING,
    element: <LandingPage />,
    title: "Giải pháp doanh nghiệp - Di Sản Việt",
  },
  {
    path: PATHS.BUSINESS_PRICING,
    element: <SubscriptionPackagesPage />,
    title: "Gói dịch vụ",
  },
  {
    path: PATHS.BUSINESS_PAYMENT_RESULT,
    element: <PaymentResultPage />,
    title: "Kết quả thanh toán",
  },
  {
    path: PATHS.BUSINESS_DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={["business", "admin"]}>
        <BusinessLayout />
      </ProtectedRoute>
    ),
    title: "Business Portal",
    protected: true,
    children: [
      {
        index: true,
        element: <Navigate to={PATHS.BUSINESS_OVERVIEW} replace />,
      },
      {
        path: "overview",
        element: <BusinessOverviewPage />,
        title: "Tổng quan doanh nghiệp",
      },
      {
        path: "products",
        element: (
          <ProtectedRoute allowedRoles={["business", "admin"]}>
            <BusinessProductsPage />
          </ProtectedRoute>
        ),
        title: "Quản lý sản phẩm",
      },
      {
        path: "places",
        element: <PlacesManagementPage />,
        title: "Quản lý địa điểm của tôi",
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
