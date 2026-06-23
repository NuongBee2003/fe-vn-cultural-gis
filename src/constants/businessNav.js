import {
  BarChart3,
  MapPinned,
  LayoutGrid,
  Settings
} from "lucide-react";

/**
 * @typedef {{ label: string; to: string }} BusinessNavChild
 * @typedef {{ label: string; icon: any; to?: string; base?: string; children?: BusinessNavChild[] }} BusinessNavItem
 */

/** @type {BusinessNavItem[]} */
export const BUSINESS_NAV_ITEMS = [
  {
    label: "Tổng quan doanh nghiệp",
    labelKey: "dashboard.nav.businessOverview",
    icon: BarChart3,
    to: "/business/overview",
  },
  {
    label: "Quản lý địa điểm của tôi",
    labelKey: "dashboard.nav.myPlaces",
    icon: MapPinned,
    to: "/business/places",
  },
  {
    label: "Quản lý sản phẩm shop",
    labelKey: "dashboard.nav.myProducts",
    icon: LayoutGrid,
    to: "/business/products",
  },
  {
    label: "Nâng cấp dịch vụ",
    labelKey: "dashboard.nav.pricing",
    icon: Settings,
    to: "/business/pricing",
  },
];
