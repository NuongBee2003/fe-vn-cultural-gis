import {
  BarChart3,
  CalendarDays,
  LayoutGrid,
  MapPinned,
  MessageSquareText,
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
    icon: MapPinned,
    to: "/dashboard/places",
  },
  {
    label: "Quản lý nội dung cộng đồng",
    icon: MessageSquareText,
    base: "/dashboard/community",
    children: [
      { label: "Quản lý bài viết", to: "/dashboard/community/posts" },
      { label: "Quản lý đánh giá", to: "/dashboard/community/reviews" },
    ],
  },
  {
    label: "Quản lý người dùng",
    icon: Users,
    base: "/dashboard/users",
    children: [
      { label: "Quản lý quyền", to: "/dashboard/users/roles" },
      { label: "Quản lý tài khoản", to: "/dashboard/users/accounts" },
    ],
  },
  {
    label: "Quản lý thể loại",
    icon: Tags,
    base: "/dashboard/categories",
    children: [
      { label: "Quản lý ẩm thực", to: "/dashboard/categories/foods" },
      { label: "Quản lý di tích lịch sử", to: "/dashboard/categories/historical-places" },
    ],
  },
  {
    label: "Quản lý trải nghiệm",
    icon: LayoutGrid,
    to: "/dashboard/experiences",
  },
  {
    label: "Quản lý sự kiện",
    icon: CalendarDays,
    to: "/dashboard/events",
  },
  {
    label: "Báo cáo",
    icon: BarChart3,
    base: "/dashboard/reports",
    children: [{ label: "Địa điểm hot", to: "/dashboard/reports/hot-places" }],
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
