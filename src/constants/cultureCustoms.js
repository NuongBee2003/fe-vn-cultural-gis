import CungGio from "@/assets/img/holiday/CungGio.jpg";
import HaiLoc from "@/assets/img/holiday/HaiLoc.jpg";
import CungToNghe from "@/assets/img/holiday/CungToNghe.jpg";
import LeAnHoi from "@/assets/img/holiday/LeAnHoi.jpg";
import LeTang from "@/assets/img/holiday/LeTang.png";
import RuocDau from "@/assets/img/holiday/RuocDau.jpg";
import VuLan from "@/assets/img/holiday/VuLan.webp";

export const CUSTOM_GROUP_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "wedding", label: "Cưới hỏi" },
  { key: "funeral", label: "Tang lễ" },
  { key: "festival", label: "Lễ hội" },
  { key: "daily", label: "Đời thường" },
  { key: "belief", label: "Tín ngưỡng" },
];

export const CUSTOM_GROUP_LABELS = {
  wedding: "Cưới hỏi",
  funeral: "Tang lễ",
  festival: "Lễ hội",
  daily: "Đời thường",
  belief: "Tín ngưỡng",
};

/** @type {import("./cultureTypes").CultureItem[]} */
export const CULTURE_CUSTOMS_ITEMS = [
  {
    id: "custom-1",
    title: "Lễ ăn hỏi",
    summary:
      "Gia đình trai gửi lễ qua cô dâu, thể hiện uy tín và thiện chí hai bên.",
    image: LeAnHoi,
    group: "wedding",
    province: "Toàn quốc",
    tags: ["Hôn nhân", "Lễ nghi"],
    detail: {
      description:
        "Lễ ăn hỏi là bước chính thức đánh dấu quan hệ hôn nhân.",
      highlights: [
        "Trầu cau cầu hôn",
        "Số lễ chẵn",
        "Người đại diện hai họ",
      ],
      steps: [
        "Chọn ngày giờ tốt",
        "Chuẩn bị mâm lễ",
        "Đoàn nhà trai sang nhà gái",
        "Trao lễ",
        "Ăn mừng gia đình",
      ],
    },
  },

  {
    id: "custom-2",
    title: "Rước dâu",
    summary:
      "Đưa cô dâu về nhà chồng — nghi thức quan trọng nhất đám cưới.",
    image: RuocDau,
    group: "wedding",
    province: "Toàn quốc",
    tags: ["Đám cưới", "Lễ nghi"],
    detail: {
      description:
        "Rước dâu có thể bằng xe hoa hiện đại hoặc nghi lễ truyền thống.",
      highlights: [
        "Lễ xin dâu",
        "Mâm quả đón dâu",
        "Lạy tổ tiên",
      ],
      steps: [
        "Đón dâu",
        "Xin phép tổ tiên",
        "Đưa dâu về nhà trai",
        "Lạy gia tiên",
        "Tiệc cưới",
      ],
    },
  },

  {
    id: "custom-3",
    title: "Lễ tang truyền thống",
    summary:
      "Nghi thức tiễn người đã khuất, thể hiện hiếu nghĩa gia đình.",
    image: LeTang,
    group: "funeral",
    province: "Toàn quốc",
    tags: ["Tang lễ", "Gia đình"],
    detail: {
      description:
        "Tang lễ Việt Nam mang tính trang nghiêm và cộng đồng.",
      highlights: [
        "Mặc tang",
        "Cúng cơm nước",
        "Đưa tang",
      ],
      steps: [
        "Báo tang",
        "Quàn tang",
        "Viếng",
        "Đưa tang",
        "An táng",
      ],
    },
  },

  {
    id: "custom-4",
    title: "Hái lộc đầu xuân",
    summary:
      "Rước may mắn năm mới từ đình chùa hoặc cây lộc đầu năm.",
    image: HaiLoc,
    group: "festival",
    province: "Miền Bắc",
    tags: ["Tết", "Đầu năm"],
    detail: {
      description:
        "Hái lộc thường diễn ra đêm giao thừa hoặc sáng mùng 1.",
      highlights: [
        "Xuất hành đầu năm",
        "Cầu bình an",
        "Mang lộc về nhà",
      ],
      steps: [
        "Đi lễ chùa",
        "Hái cành lộc",
        "Mang về bàn thờ",
        "Cầu may mắn",
        "Chúc Tết",
      ],
    },
  },

  {
    id: "custom-5",
    title: "Giỗ Tổ Hùng Vương",
    summary:
      "Ngày 10/3 âm lịch — tưởng nhớ các Vua Hùng dựng nước.",
    image: CungGio,
    group: "festival",
    province: "Phú Thọ",
    tags: ["Quốc lễ", "Tổ tiên"],
    detail: {
      description:
        "Lễ hội Đền Hùng thể hiện truyền thống uống nước nhớ nguồn.",
      highlights: [
        "Dâng hương",
        "Bánh chưng bánh giầy",
        "Trẩy hội",
      ],
      steps: [
        "Khai lễ",
        "Dâng lễ vật",
        "Dâng hương",
        "Tham quan",
        "Cầu quốc thái dân an",
      ],
    },
  },

  {
    id: "custom-6",
    title: "Mâm cỗ cúng Tết",
    summary:
      "Chuẩn bị mâm cỗ ba ngày Tết — bày tỏ lòng thành với tổ tiên.",
    image: HaiLoc,
    group: "festival",
    province: "Toàn quốc",
    tags: ["Tết", "Gia đình"],
    detail: {
      description:
        "Mâm cỗ Tết thay đổi theo từng vùng miền Việt Nam.",
      highlights: [
        "Bánh chưng bánh tét",
        "Cúng tổ tiên",
        "Sum họp gia đình",
      ],
      steps: [
        "Dọn bàn thờ",
        "Nấu cỗ",
        "Cúng tổ tiên",
        "Hóa vàng",
        "Ăn Tết",
      ],
    },
  },

  {
    id: "custom-7",
    title: "Chào hỏi theo thế hệ",
    summary:
      "Con cháu chào ông bà cha mẹ — thể hiện lễ nghĩa gia đình.",
    image: RuocDau,
    group: "daily",
    province: "Toàn quốc",
    tags: ["Gia đình", "Ứng xử"],
    detail: {
      description:
        "Người Việt coi trọng xưng hô và lễ phép trong gia đình.",
      highlights: [
        "Xưng hô đúng vai",
        "Lễ phép",
        "Kính trên nhường dưới",
      ],
      steps: [
        "Chào người lớn",
        "Hỏi thăm",
        "Nghe dặn dò",
        "Cảm ơn",
        "Giữ phép lịch sự",
      ],
    },
  },

  {
    id: "custom-8",
    title: "Cúng giỗ tổ tiên",
    summary:
      "Ngày giỗ ông bà cha mẹ — dòng họ sum họp và nhớ nguồn.",
    image: CungGio,
    group: "daily",
    province: "Toàn quốc",
    tags: ["Giỗ", "Dòng họ"],
    detail: {
      description:
        "Giỗ tổ tiên là nét văn hóa gia đình lâu đời của người Việt.",
      highlights: [
        "Dâng hương",
        "Mâm cỗ giỗ",
        "Con cháu sum họp",
      ],
      steps: [
        "Chuẩn bị mâm cỗ",
        "Thắp hương",
        "Khấn giỗ",
        "Ăn cỗ",
        "Dọn dẹp",
      ],
    },
  },

  {
    id: "custom-9",
    title: "Cúng Tổ nghề",
    summary:
      "Thợ thủ công tưởng nhớ người sáng lập nghề truyền thống.",
    image: CungToNghe,
    group: "belief",
    province: "Bắc Ninh",
    tags: ["Làng nghề", "Nghề truyền thống"],
    detail: {
      description:
        "Các làng nghề Việt Nam đều có tục cúng Tổ nghề.",
      highlights: [
        "Dâng hương",
        "Mời nghệ nhân",
        "Cầu may nghề nghiệp",
      ],
      steps: [
        "Chuẩn bị lễ",
        "Khấn Tổ nghề",
        "Dâng hương",
        "Dùng cỗ",
        "Khai nghề",
      ],
    },
  },

  {
    id: "custom-10",
    title: "Lễ Vu Lan",
    summary:
      "Ngày báo hiếu cha mẹ — lễ lớn của Phật giáo Việt Nam.",
    image: VuLan,
    group: "belief",
    province: "Toàn quốc",
    tags: ["Phật giáo", "Hiếu thảo"],
    detail: {
      description:
        "Vu Lan là dịp con cháu báo hiếu và tưởng nhớ tổ tiên.",
      highlights: [
        "Cài hoa hồng",
        "Đi chùa",
        "Làm từ thiện",
      ],
      steps: [
        "Đi lễ chùa",
        "Nghe kinh Vu Lan",
        "Cài hoa hồng",
        "Phóng sinh",
        "Chăm sóc cha mẹ",
      ],
    },
  },
];