import cungDinhHue from "@/assets/img/generate-picture/cungdinhhue.webp";
import phoCoHoiAn from "@/assets/img/generate-picture/phocohoian.jpg";
import tetVietNam from "@/assets/img/generate-picture/tetvietnam.jpg";
import tayBac from "@/assets/img/generate-picture/taybac.jpg";
import tranhDongHo from "@/assets/img/generate-picture/tranhdongho.webp";
import saigonXua from "@/assets/img/generate-picture/saigonxua.jpg";
import mienTaySongNuoc from "@/assets/img/generate-picture/mientaysongnuoc.jpg";
import coPhucTrieuNguyen from "@/assets/img/generate-picture/cophuctrieunguyen.jpg";

/** @typedef {"all" | "studio" | "place" | "food" | "festival"} ExhibitionCategory */

/** @type {{ key: ExhibitionCategory | "all"; label: string }[]} */
export const EXHIBITION_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "studio", label: "Studio AI" },
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
 * @property {"studio" | "upload"} source
 */

/** @type {ExhibitionItem[]} */
export const EXHIBITION_ITEMS = [
  {
    id: "ex-1",
    title: "Hoàng hôn trong Đại Nội Huế",
    description:
      "Góc nhìn AI tái hiện sắc vàng hoàng hôn trên mái ngói triều Nguyễn, gợi không khí cung đình xưa.",
    imageUrl: cungDinhHue,
    author: "Nguyễn Minh An",
    category: "studio",
    styleTag: "Cung Đình Huế",
    placeName: "Kinh thành Huế",
    province: "Thừa Thiên Huế",
    likes: 284,
    createdAt: "2025-05-20",
    source: "studio",
  },
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
    id: "ex-3",
    title: "Sắc xuân miền Bắc",
    description:
      "Studio AI mô phỏng không khí Tết: hoa đào, câu đối đỏ và sắc vàng ấm áp của ngày đầu năm.",
    imageUrl: tetVietNam,
    author: "Lê Hoàng Nam",
    category: "festival",
    styleTag: "Tết Việt Nam",
    placeName: null,
    province: "Hà Nội",
    likes: 356,
    createdAt: "2025-05-15",
    source: "studio",
  },
  {
    id: "ex-4",
    title: "Mùa vàng Tây Bắc",
    description:
      "Ruộng bậc thang ôm sườn núi trong sương sớm — tác phẩm AI theo phong cách vùng cao.",
    imageUrl: tayBac,
    author: "Phạm Thu Hà",
    category: "studio",
    styleTag: "Tây Bắc",
    placeName: "Mù Cang Chải",
    province: "Yên Bái",
    likes: 198,
    createdAt: "2025-05-12",
    source: "studio",
  },
  {
    id: "ex-5",
    title: "Tranh Đông Hồ trên giấy dó",
    description:
      "Lối vẽ dân gian Đông Hồ được AI diễn giải lại với màu phẳng đặc trưng và nhân vật dân gian.",
    imageUrl: tranhDongHo,
    author: "Võ Đức Thịnh",
    category: "studio",
    styleTag: "Tranh Đông Hồ",
    placeName: "Làng tranh Đông Hồ",
    province: "Bắc Ninh",
    likes: 167,
    createdAt: "2025-05-10",
    source: "studio",
  },
  {
    id: "ex-6",
    title: "Sài Gòn một thuở",
    description:
      "Góc phố xe cổ, biển hiệu neon mờ — cảm giác thành phố xưa qua lớp phủ cinematic.",
    imageUrl: saigonXua,
    author: "Huỳnh Quốc Bảo",
    category: "place",
    styleTag: "Sài Gòn Xưa",
    placeName: "Chợ Bến Thành",
    province: "TP. Hồ Chí Minh",
    likes: 521,
    createdAt: "2025-05-08",
    source: "studio",
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
    id: "ex-8",
    title: "Cổ phục triều Nguyễn",
    description:
      "Tái hiện trang phục cung đình và không gian điện thờ qua phong cách Studio Văn Hóa.",
    imageUrl: coPhucTrieuNguyen,
    author: "Nguyễn Minh An",
    category: "festival",
    styleTag: "Cổ Phục Triều Nguyễn",
    placeName: "Điện Thái Hòa",
    province: "Thừa Thiên Huế",
    likes: 189,
    createdAt: "2025-05-02",
    source: "studio",
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
