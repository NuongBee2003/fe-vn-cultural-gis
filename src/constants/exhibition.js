import phoCoHoiAn from "@/assets/img/exhibition/phocohoian.jpg";
import tetVietNam from "@/assets/img/exhibition/tetvietnam.jpg";
import mienTaySongNuoc from "@/assets/img/exhibition/mientaysongnuoc.jpg";

/** @typedef {"all" | "place" | "food" | "festival"} ExhibitionCategory */

/** @type {{ key: ExhibitionCategory | "all"; label: string }[]} */
export const EXHIBITION_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "place", label: "Địa điểm" },
  { key: "food", label: "Ẩm thực" },
  { key: "festival", label: "Lễ hội" },
];

/** @type {{ key: "newest" | "likes"; label: string }[]} */
export const EXHIBITION_SORT_OPTIONS = [
  { key: "newest", label: "Mới nhất" },
  { key: "likes", label: "Nhiều tim nhất" },
];

/**
 * @typedef {Object} ExhibitionItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} imageUrl
 * @property {string} author
 * @property {ExhibitionCategory} category
 * @property {string} [styleTag]
 * @property {string} [placeName]
 * @property {string} province
 * @property {number} likes
 * @property {string} createdAt ISO date
 * @property {"upload"} source
 */

/** @type {ExhibitionItem[]} */
export const EXHIBITION_ITEMS = [
  {
    id: "ex-2",
    title: "Đêm phố cổ Hội An",
    description:
      "Dãi đèn lồng soi bóng trên mặt nước sông Hoài — khoảnh khắc được chia sẻ từ chuyến đi cuối tuần.",
    imageUrl: phoCoHoiAn,
    author: "Trần Bảo Ngọc",
    category: "place",
    styleTag: "Phố Cổ Hội An",
    placeName: "Phố cổ Hội An",
    province: "Quảng Nam",
    likes: 412,
    createdAt: "2025-05-18",
    source: "upload",
  },
  {
    id: "ex-7",
    title: "Sông nước miền Tây",
    description:
      "Chiếc xuồng nhỏ len lỏi giữa dừa nước — chia sẻ từ hành trình khám phá vùng sông nước.",
    imageUrl: mienTaySongNuoc,
    author: "Đặng Kim Liên",
    category: "place",
    styleTag: "Miền Tây Sông Nước",
    placeName: "Chợ nổi Cái Răng",
    province: "Cần Thơ",
    likes: 243,
    createdAt: "2025-05-05",
    source: "upload",
  },
  {
    id: "ex-9",
    title: "Bánh chưng ngày Tết",
    description:
      "Góc bếp sum vầy gói bánh chưng — ảnh cộng đồng ghi lại nghi thức ẩm thực truyền thống.",
    imageUrl: tetVietNam,
    author: "Trương Lan Phương",
    category: "food",
    placeName: null,
    province: "Hà Nội",
    likes: 134,
    createdAt: "2025-04-28",
    source: "upload",
  },
  {
    id: "ex-10",
    title: "Cafe phố cổ",
    description:
      "Ly cà phê phin trên bàn gỗ cũ, phía sau là dãy nhà vàng Hội An — khoảnh khắc chậm rãi.",
    imageUrl: phoCoHoiAn,
    author: "Trần Bảo Ngọc",
    category: "food",
    placeName: "Phố cổ Hội An",
    province: "Quảng Nam",
    likes: 276,
    createdAt: "2025-04-25",
    source: "upload",
  },
  {
    id: "ex-11",
    title: "Lễ hội đèn lồng",
    description:
      "Đêm rằm tháng giêng, hàng ngàn đèn lồng thả trôi trên sông — không khí lễ hội rực rỡ.",
    imageUrl: phoCoHoiAn,
    author: "Lê Hoàng Nam",
    category: "festival",
    placeName: "Phố cổ Hội An",
    province: "Quảng Nam",
    likes: 445,
    createdAt: "2025-04-20",
    source: "upload",
  },
  {
    id: "ex-12",
    title: "Bữa cơm miền Tây",
    description:
      "Mâm cơm với lẩu mắm, bông điên điển — ẩm thực địa phương qua góc máy cộng đồng.",
    imageUrl: mienTaySongNuoc,
    author: "Đặng Kim Liên",
    category: "food",
    placeName: "Chợ nổi Cái Răng",
    province: "Cần Thơ",
    likes: 98,
    createdAt: "2025-04-15",
    source: "upload",
  },
];
