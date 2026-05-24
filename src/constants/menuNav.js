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
  { label: "Trang chủ", icon: Home, href: PATHS.HOME },
  { label: "Lịch lễ", icon: Calendar, href: PATHS.HOLIDAYS },
  {
    label: "Trải nghiệm",
    icon: Sparkles,
    children: [
      { label: "Triển lãm ảo", href: "#" },
      { label: "Tạo ảnh", href: PATHS.STUDIO },
    ],
  },
  { label: "Cộng đồng", icon: Users, href: "#" },
  { label: "Hành trình lịch sử Việt Nam", icon: Clock, href: PATHS.HISTORY },
  {
    label: "Văn hóa",
    icon: Palette,
    children: [
      { label: "Ẩm thực", href: "#" },
      { label: "Phong tục tập quán", href: "#" },
      { label: "Nghệ thuật dân gian", href: "#" },
    ],
  },
];
