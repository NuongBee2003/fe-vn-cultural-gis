import {
  Home,
  Sparkles,
  Users,
  Clock,
  Palette,
  Calendar,
} from "lucide-react";

import { PATHS } from "@/constants/paths";

/**
 * @typedef {{ label: string; href?: string; icon?: any; children?: { label: string; href: string }[] }} MenuNavItem
 */

/** @type {MenuNavItem[]} */
export const MENU_NAV_ITEMS = [
  { label: "Trang chủ", labelKey: "nav.home", icon: Home, href: PATHS.HOME },
  { label: "Lịch lễ", labelKey: "nav.holiday", icon: Calendar, href: PATHS.HOLIDAYS },
  {
    label: "Trải nghiệm",
    labelKey: "nav.experience",
    icon: Sparkles,
    children: [
      { label: "Triển lãm ảo", labelKey: "nav.exhibition", href: PATHS.EXHIBITION },
      { label: "Mua sắm", labelKey: "nav.shop", href: PATHS.SHOP },
      { label: "Giải pháp doanh nghiệp", labelKey: "nav.businessLanding", href: PATHS.LANDING },
    ],
  },
  { label: "Cộng đồng", labelKey: "nav.community", icon: Users, href: PATHS.COMMUNITY },
  { label: "Hành trình lịch sử Việt Nam", labelKey: "nav.history", icon: Clock, href: PATHS.HISTORY },
  {
    label: "Văn hóa",
    labelKey: "nav.culture",
    icon: Palette,
    children: [
      { label: "Ẩm thực", labelKey: "nav.cultureFood", href: PATHS.CULTURE_FOOD },
      { label: "Phong tục tập quán", labelKey: "nav.cultureCustoms", href: PATHS.CULTURE_CUSTOMS },
      { label: "Nghệ thuật dân gian", labelKey: "nav.cultureFolkArt", href: PATHS.CULTURE_FOLK_ART },
    ],
  },
];
