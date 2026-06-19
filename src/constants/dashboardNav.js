import {
  BarChart3,
  CalendarDays,
  LayoutGrid,
  MapPinned,
  MessageSquareText,
  Palette,
  Tags,
  Users,
} from "lucide-react";

/**
 * @typedef {{ label: string; to: string }} DashboardNavChild
 * @typedef {{ label: string; icon: any; to?: string; base?: string; children?: DashboardNavChild[] }} DashboardNavItem
 */

/** @type {DashboardNavItem[]} */
export const DASHBOARD_NAV_ITEMS = [
  {
    label: "Quản lý địa điểm",
    labelKey: "dashboard.nav.places",
    icon: MapPinned,
    to: "/dashboard/places",
  },
  {
    label: "Quản lý nội dung cộng đồng",
    labelKey: "dashboard.nav.community",
    icon: MessageSquareText,
    children: [
      { label: "Quản lý bài viết", labelKey: "dashboard.nav.posts", to: "/dashboard/community/posts" },
      { label: "Quản lý đánh giá", labelKey: "dashboard.nav.reviews", to: "/dashboard/community/reviews" },
    ],
  },
  {
    label: "Quản lý người dùng",
    labelKey: "dashboard.nav.users",
    icon: Users,
    base: "/dashboard/users",
    children: [
      { label: "Quản lý quyền", labelKey: "dashboard.nav.roles", to: "/dashboard/users/roles" },
      { label: "Quản lý tài khoản", labelKey: "dashboard.nav.accounts", to: "/dashboard/users/accounts" },
    ],
  },
  {
    label: "Quản lý danh mục địa điểm",
    labelKey: "dashboard.nav.categories",
    icon: Tags,
    to: "/dashboard/categories",
  },
  {
    label: "Quản lý triển lãm ảo",
    labelKey: "dashboard.nav.exhibitions",
    icon: LayoutGrid,
    to: "/dashboard/exhibitions",
  },
  {
    label: "Quản lý văn hóa",
    labelKey: "dashboard.nav.culture",
    icon: Palette,
    base: "/dashboard/culture",
    children: [
      { label: "Quản lý ẩm thực", labelKey: "dashboard.nav.cultureCuisines", to: "/dashboard/culture/cuisines" },
      { label: "Quản lý phong tục", labelKey: "dashboard.nav.cultureCustoms", to: "/dashboard/culture/customs" },
      { label: "Quản lý nghệ thuật dân gian", labelKey: "dashboard.nav.cultureFolkArts", to: "/dashboard/culture/folk-arts" },
    ],
  },
  {
    label: "Báo cáo",
    labelKey: "dashboard.nav.reports",
    icon: BarChart3,
    base: "/dashboard/reports",
    children: [{ label: "Địa điểm hot", labelKey: "dashboard.nav.hotPlaces", to: "/dashboard/reports/hot-places" }],
  },
];

function stripDashboardPrefix(to) {
  return to.replace(/^\/dashboard\/?/, "");
}

export function getDashboardLeafRoutes() {
  /** @type {{ path: string; title: string }[]} */
  const leaves = [];

  for (const item of DASHBOARD_NAV_ITEMS) {
    if (item.children?.length) {
      for (const child of item.children) {
        leaves.push({ path: stripDashboardPrefix(child.to), title: child.label });
      }
    } else if (item.to) {
      leaves.push({ path: stripDashboardPrefix(item.to), title: item.label });
    }
  }

  return leaves;
}

export function getDashboardRoutes() {
  /** @type {{ path: string; title: string }[]} */
  const routes = [];

  for (const item of DASHBOARD_NAV_ITEMS) {
    if (item.children?.length) {
      if (item.base) {
        routes.push({ path: stripDashboardPrefix(item.base), title: item.label });
      }
      for (const child of item.children) {
        routes.push({ path: stripDashboardPrefix(child.to), title: child.label });
      }
    } else if (item.to) {
      routes.push({ path: stripDashboardPrefix(item.to), title: item.label });
    }
  }

  return routes;
}

export function getDashboardBreadcrumbs(pathname) {
  for (const item of DASHBOARD_NAV_ITEMS) {
    if (item.children?.length) {
      const match = item.children.find((c) => c.to === pathname);
      if (match) {
        return [
          { label: item.label, to: item.base || undefined },
          { label: match.label },
        ];
      }

      if (item.base && pathname.startsWith(item.base)) {
        return [{ label: item.label }];
      }
    } else if (item.to === pathname) {
      return [{ label: item.label }];
    }
  }

  return [];
}
