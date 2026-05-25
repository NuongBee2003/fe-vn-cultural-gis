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
      { label: "Triển lãm ảo", href: PATHS.EXHIBITION },
      { label: "Tạo ảnh", href: PATHS.STUDIO },
    ],
  },
  { label: "Cộng đồng", icon: Users, href: "#" },
  { label: "Hành trình lịch sử Việt Nam", icon: Clock, href: PATHS.HISTORY },
  {
    label: "Văn hóa",
    icon: Palette,
    children: [
      { label: "Ẩm thực", href: PATHS.CULTURE_FOOD },
      { label: "Phong tục tập quán", href: PATHS.CULTURE_CUSTOMS },
      { label: "Nghệ thuật dân gian", href: PATHS.CULTURE_FOLK_ART },
    ],
  },
];
