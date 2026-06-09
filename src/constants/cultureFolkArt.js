import tranhDongHo from "@/assets/img/exhibition/tranhdongho.webp";

import CaTru from "@/assets/img/cuisine/CaTru.jpg";
import ChauVan from "@/assets/img/cuisine/ChauVan.jpg";
import Cheo from "@/assets/img/cuisine/Cheo.jpg";
import DetTC from "@/assets/img/cuisine/DetTC.jpg";
import GomBT from "@/assets/img/cuisine/GomBT.jpg";
import HatXam from "@/assets/img/cuisine/HatXam.jpg";
import MuaLan from "@/assets/img/cuisine/MuaLan.jpg"

export const FOLK_TYPE_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "art", label: "Loại hình" },
  { key: "village", label: "Làng nghề" },
];

export const FOLK_CATEGORY_LABELS = {
  painting: "Tranh",
  dance: "Múa",
  theater: "Sân khấu",
  music: "Âm nhạc",
  craft: "Thủ công",
  ritual: "Nghi lễ",
};

/** @type {import("./cultureTypes").CultureItem[]} */
export const CULTURE_FOLK_ART_ITEMS = [
  {
    id: "folk-1",
    title: "Tranh dân gian Đông Hồ",
    summary:
      "Tranh in từ khắc gỗ, màu tự nhiên, nội dung dân gian và cát tường.",
    image: tranhDongHo,
    folkType: "art",
    category: "painting",
    province: "Bắc Ninh",
    tags: ["UNESCO", "Làng nghề"],
    detail: {
      description:
        "Tranh Đông Hồ dùng giấy điệp, màu từ đất, than, lá… Chủ đề lợn đàn, chăn trâu, chữ Phúc Lộc Thọ rất phổ biến.",
      highlights: ["In khắc gỗ", "Màu tự nhiên", "Trang trí Tết"],
      province: "Làng Đông Hồ, Bắc Ninh",
    },
  },

  {
    id: "folk-2",
    title: "Múa lân",
    summary: "Múa rồng – lân trong lễ hội, Tết, khai trương cầu may.",
    image: MuaLan,
    folkType: "art",
    category: "dance",
    province: "Toàn quốc",
    tags: ["Lễ hội", "Tết"],
    detail: {
      description:
        "Đội múa lân gồm sư tử, trống chiêng, người cầm lân đầu. Biểu tượng đuổi tà, rước may mắn.",
      highlights: [
        "Trống chiêng rộn ràng",
        "Nhảy trên cột",
        "Biểu diễn đường phố",
      ],
      province: "Phổ biến khắp Việt Nam",
    },
  },

  {
    id: "folk-3",
    title: "Chèo",
    summary:
      "Kịch hát dân gian Bắc Bộ, hài hước, gần gũi đời sống nông thôn.",
    image: Cheo,
    folkType: "art",
    category: "theater",
    province: "Nam Định",
    tags: ["Di sản", "Hát"],
    detail: {
      description:
        "Chèo có các vai chèo, lão, mụ, thị. Nghệ thuật được Nhà nước công nhận di sản văn hóa phi vật thể.",
      highlights: ["Hát chèo", "Múa phụ họa", "Đàn nhị, đàn bầu"],
      province: "Đồng bằng Bắc Bộ",
    },
  },

  {
    id: "folk-4",
    title: "Ca trù",
    summary: "Hát ả đào — loại hình âm nhạc cung đình và tài tử xưa.",
    image: CaTru,
    folkType: "art",
    category: "music",
    province: "Hà Nội",
    tags: ["UNESCO", "Cung đình"],
    detail: {
      description:
        "Ca trù gồm giọng hát, đàn đáy, phách trống chầu, quản ca. Được UNESCO ghi danh di sản.",
      highlights: ["Hát đối đáp", "Phách trống chầu", "Không gian inton"],
      province: "Hà Nội, Bắc Ninh",
    },
  },

  {
    id: "folk-5",
    title: "Hát xẩm",
    summary: "Hát rong đường phố, kể chuyện bằng giọng và nhịp trống.",
    image: HatXam,
    folkType: "art",
    category: "music",
    province: "Hà Nội",
    tags: ["Đường phố", "Dân gian"],
    detail: {
      description:
        "Xẩm xưa do người khiếm thị hát rong, nay được phục dựng trong không gian văn hóa.",
      highlights: ["Đàn bầu, trống", "Lời kể chuyện", "Hát đối đáp"],
      province: "Hà Nội",
    },
  },

  {
    id: "folk-6",
    title: "Dệt thổ cẩm",
    summary:
      "Vải thổ cẩm của các dân tộc Tây Nguyên, Tây Bắc — hoa văn kể chuyện.",
    image: DetTC,
    folkType: "art",
    category: "craft",
    province: "Tây Nguyên",
    tags: ["Dân tộc", "Thủ công"],
    detail: {
      description:
        "Thổ cẩm dùng trong trang phục lễ hội, khăn piêu, váy cưới. Màu nhuộm thực vật.",
      highlights: [
        "Khung dệt thủ công",
        "Hoa văn tượng trưng",
        "Trang phục lễ hội",
      ],
      province: "Gia Lai, Đắk Lắk, Lào Cai",
    },
  },

  {
    id: "folk-7",
    title: "Gốm Bát Tràng",
    summary: "Gốm men lam, đồ thờ, ấm chén — làng nghề gần nghìn năm.",
    image: GomBT,
    folkType: "art",
    category: "craft",
    province: "Hà Nội",
    tags: ["Gốm", "Thủ công"],
    detail: {
      description:
        "Gốm Bát Tràng nung than hoa, men lam cobalt đặc trưng. Sản phẩm từ đồ gia dụng đến nghệ thuật.",
      highlights: ["Men lam", "Tô hoa văn", "Du lịch làng gốm"],
      province: "Gia Lâm, Hà Nội",
    },
  },

  {
    id: "folk-8",
    title: "Chầu văn",
    summary:
      "Hát văn trong lễ hầu đồng — kết hợp âm nhạc, múa, trang phục.",
    image: ChauVan,
    folkType: "art",
    category: "ritual",
    province: "Nam Định",
    tags: ["Tín ngưỡng", "Hát văn"],
    detail: {
      description:
        "Chầu văn là phần quan trọng hầu đồng Mẫu, có bả chầu, chiêng trống, đồng hành múa.",
      highlights: ["Hầu đồng", "Trang phục sặc sỡ", "Hát chầu"],
      province: "Nam Định, Hà Nội",
    },
  },

  {
    id: "folk-9",
    title: "Làng tranh Đông Hồ",
    summary:
      "Làng nghề in tranh trên sông Cầu, nghề truyền từ đời này sang đời khác.",
    image: tranhDongHo,
    folkType: "village",
    category: "painting",
    province: "Bắc Ninh",
    tags: ["Làng nghề", "Du lịch"],
    detail: {
      description:
        "Cả làng làm tranh, có hộ nghệ nhân nổi tiếng. Du khách tham quan quy trình khắc gỗ và in.",
      highlights: [
        "Hộ nghệ nhân",
        "Chợ tranh Tết",
        "Bảo tàng làng nghề",
      ],
      province: "Thuận Thành, Bắc Ninh",
    },
  },

  {
    id: "folk-10",
    title: "Làng gốm Bát Tràng",
    summary: "Bên sông Hồng, xưởng gốm và chợ gốm sầm uất.",
    image: GomBT,
    folkType: "village",
    category: "craft",
    province: "Hà Nội",
    tags: ["Làng nghề", "Gốm"],
    detail: {
      description:
        "Du khách thử tay nặn gốm, mua ấm chén men lam. Làng có lịch sử từ thời Lý.",
      highlights: [
        "Tour làng nghề",
        "Nặn gốm trải nghiệm",
        "Chợ gốm",
      ],
      province: "Gia Lâm, Hà Nội",
    },
  },

  {
    id: "folk-11",
    title: "Làng dệt Zèng Hoa",
    summary:
      "Làng dệt thổ cẩm Ba Na ở Gia Lai — khăn piêu và váy thổ cẩm.",
    image: DetTC,
    folkType: "village",
    category: "craft",
    province: "Gia Lai",
    tags: ["Tây Nguyên", "Dân tộc"],
    detail: {
      description:
        "Phụ nữ Ba Na dệt zèng trên khung gỗ, hoa văn hình học đậm chất núi rừng.",
      highlights: [
        "Khung dệt truyền thống",
        "Nhuộm thực vật",
        "Chợ phiên",
      ],
      province: "Gia Lai",
    },
  },
];