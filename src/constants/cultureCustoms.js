import LunarNewYear from "@/assets/img/holiday/lunar-newyear.jpg";
import GioTo from "@/assets/img/holiday/gio-to-hung-vuong.jpg";
import TrungThu from "@/assets/img/holiday/trung-thu.jpg";
import tetVietNam from "@/assets/img/generate-picture/tetvietnam.jpg";
import cungDinhHue from "@/assets/img/generate-picture/cungdinhhue.webp";
import coPhuc from "@/assets/img/generate-picture/cophuctrieunguyen.jpg";
import tranhDongHo from "@/assets/img/generate-picture/tranhdongho.webp";
import tayBac from "@/assets/img/generate-picture/taybac.jpg";

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
    summary: "Gia đình trai gửi lễ qua cô dâu, thể hiện uy tín và thiện chí hai bên.",
    image: coPhuc,
    group: "wedding",
    province: "Toàn quốc",
    tags: ["Hôn nhân", "Lễ nghi"],
    detail: {
      description:
        "Lễ ăn hỏi là bước chính thức đánh dấu quan hệ hôn nhân, mâm lễ gồm trầu cau, bánh cốm, rượu, heo quay tùy vùng miền.",
      highlights: ["Trầu cau cầu hôn", "Số lễ chẵn", "Người đại diện hai họ"],
      steps: [
        "Chọn ngày giờ tốt theo tuổi",
        "Chuẩn bị mâm lễ theo phong tục địa phương",
        "Đoàn nhà trai sang nhà gái",
        "Trưởng đoàn trình lễ và nhận lời",
        "Trao quà và ăn mừng gia đình",
      ],
    },
  },
  {
    id: "custom-2",
    title: "Rước dâu",
    summary: "Đưa cô dâu về nhà chồng — nghi thức công khai quan trọng nhất đám cưới.",
    image: cungDinhHue,
    group: "wedding",
    province: "Toàn quốc",
    tags: ["Đám cưới", "Lễ nghi"],
    detail: {
      description:
        "Rước dâu có thể bằng xe hoa hiện đại hoặc kiệu, mâm quả, đội nhạc tùy vùng. Ở Huế còn giữ nét cung đình.",
      highlights: ["Lễ xin dâu", "Mâm quả đón dâu", "Lạy tổ tiên nhà chồng"],
      steps: [
        "Đón dâu tại nhà gái",
        "Lễ xin phép tổ tiên",
        "Đưa dâu về nhà trai",
        "Lạy gia tiên và mời khách",
        "Tiệc cưới và chúc mừng",
      ],
    },
  },
  {
    id: "custom-3",
    title: "Lễ tang truyền thống",
    summary: "Nghi thức tiễn người đã khuất, thể hiện hiếu nghĩa và đoàn kết dòng họ.",
    image: tayBac,
    group: "funeral",
    province: "Toàn quốc",
    tags: ["Tang lễ", "Gia đình"],
    detail: {
      description:
        "Tang lễ Việt Nam nhấn mạnh sự trang nghiêm, thời gian tang có thể 3–5 ngày hoặc hơn tùy vùng và đạo giáo.",
      highlights: ["Mặc tang", "Cúng cơm nước", "Đám tang cộng đồng"],
      steps: [
        "Báo tang và chuẩn bị nghi thức",
        "Quàn tang, viếng và cúng",
        "Đưa tang và an táng",
        "Giao tang và kết thúc tang",
        "Giỗ đầu và tưởng nhớ",
      ],
    },
  },
  {
    id: "custom-4",
    title: "Hái lộc đầu xuân",
    summary: "Rước may mắn năm mới từ đình chùa hoặc nhà người có phúc.",
    image: LunarNewYear,
    group: "festival",
    province: "Miền Bắc",
    tags: ["Tết", "Đầu năm"],
    detail: {
      description:
        "Hái lộc thường diễn ra đêm giao thừa hoặc sáng mùng 1, cành lộc cắm trước bàn thờ tổ tiên.",
      highlights: ["Chọn giờ xuất hành", "Cành xuân đẹp", "Cầu bình an"],
      steps: [
        "Chọn người hái lộc theo tuổi hợp",
        "Đi đình chùa hoặc vườn",
        "Hái cành và mang về im lặng",
        "Cắm lộc trước bàn thờ",
        "Cầu phúc lộc cả năm",
      ],
    },
  },
  {
    id: "custom-5",
    title: "Giỗ Tổ Hùng Vương",
    summary: "Ngày 10/3 âm lịch — tưởng nhớ các Vua Hùng dựng nước.",
    image: GioTo,
    group: "festival",
    province: "Phú Thọ",
    tags: ["Quốc lễ", "Tổ tiên"],
    detail: {
      description:
        "Lễ hội Đền Hùng thu hút hàng triệu người về nguồn, thể hiện đạo lý “Uống nước nhớ nguồn”.",
      highlights: ["Dâng hương tổ tiên", "Bánh chưng dâng lễ", "Hội lễ lớn nhất"],
      steps: [
        "Dâng hương khai lễ",
        "Dâng bánh chưng, hoa quả",
        "Xếp hàng trẩy lễ",
        "Dâng hương và khấn",
        "Tham quan khu di tích",
      ],
    },
  },
  {
    id: "custom-6",
    title: "Mâm cỗ cúng Tết",
    summary: "Chuẩn bị mâm cỗ ba ngày Tết — bày tỏ lòng thành với tổ tiên.",
    image: tetVietNam,
    group: "festival",
    province: "Toàn quốc",
    tags: ["Tết", "Gia đình"],
    detail: {
      description:
        "Mâm cỗ Tết gồm xôi, giò, canh, hoa quả… tùy miền. Mùng 1 cúng tổ tiên, mùng 2 cúng thần linh, mùng 3 cúng.",
      highlights: ["Cỗ chay và mặn", "Bánh chưng bánh tét", "Cúng đúng giờ"],
      steps: [
        "Dọn bàn thờ sạch sẽ",
        "Nấu cỗ và bày mâm",
        "Thắp hương khấn vái",
        "Hóa vàng và dọn mâm",
        "Cả nhà sum họp",
      ],
    },
  },
  {
    id: "custom-7",
    title: "Chào hỏi theo thế hệ",
    summary: "Con cháu chào ông bà, cha mẹ — thể hiện lễ nghĩa gia đình.",
    image: coPhuc,
    group: "daily",
    province: "Toàn quốc",
    tags: ["Gia đình", "Ứng xử"],
    detail: {
      description:
        "Trẻ em chào hỏi người lớn khi gặp, nhận lì xì Tết; người lớn dạy con cách xưng hô theo vai vế.",
      highlights: ["Xưng hô đúng vai", "Không chào ngược thế hệ", "Lễ phép khi vào nhà"],
      steps: [
        "Chào khi gặp người lớn",
        "Hỏi thăm sức khỏe",
        "Báo cáo chuyện học/hành",
        "Nhận lời dặn dò",
        "Cảm ơn khi được cho quà",
      ],
    },
  },
  {
    id: "custom-8",
    title: "Cúng giỗ tổ tiên",
    summary: "Ngày giỗ ông bà cha mẹ — dòng họ sum họp và nhớ nguồn.",
    image: tranhDongHo,
    group: "daily",
    province: "Toàn quốc",
    tags: ["Giỗ", "Dòng họ"],
    detail: {
      description:
        "Giỗ được tổ chức đúng ngày mất âm lịch, con cháu về dâng hương, chuẩn bị mâm cỗ theo khả năng.",
      highlights: ["Mâm cỗ giỗ", "Con cháu về đông", "Kể chuyện tổ tiên"],
      steps: [
        "Dọn bàn thờ và chuẩn bị cỗ",
        "Dâng hương khấn giỗ",
        "Mời con cháu lạy",
        "Cùng ăn cỗ giỗ",
        "Dọn dẹp và chia quà",
      ],
    },
  },
  {
    id: "custom-9",
    title: "Cúng Tổ nghề",
    summary: "Thợ thủ công tưởng nhớ người sáng lập nghề trước khi khai trương.",
    image: tranhDongHo,
    group: "belief",
    province: "Bắc Ninh",
    tags: ["Làng nghề", "Nghề truyền thống"],
    detail: {
      description:
        "Nghề tranh Đông Hồ, gốm Bát Tràng… đều có lễ cúng Tổ nghề, thường vào ngày 14/3 âm lịch hoặc riêng từng làng.",
      highlights: ["Lễ dâng hương", "Mời nghệ nhân", "Cầu may mắn nghề"],
      steps: [
        "Chọn ngày lễ Tổ nghề",
        "Dâng hương hoa quả",
        "Khấn vái Tổ",
        "Mời họ nghề dùng cỗ",
        "Khai trương hoạt động",
      ],
    },
  },
  {
    id: "custom-10",
    title: "Lễ Vu Lan",
    summary: "Ngày báo hiếu cha mẹ — tháng 7 âm lịch, chùa đông người dâng lễ.",
    image: TrungThu,
    group: "belief",
    province: "Toàn quốc",
    tags: ["Phật giáo", "Hiếu thảo"],
    detail: {
      description:
        "Vu Lan gắn truyện Mục Kiền Liên, con cài bông hồng đỏ (mẹ còn) hoặc trắng (mẹ mất) trên áo.",
      highlights: ["Cài hoa hồng", "Dâng lễ chùa", "Từ thiện và chay"],
      steps: [
        "Đến chùa dâng lễ",
        "Nghe kinh Vu Lan",
        "Cài hoa hồng báo hiếu",
        "Cúng dường và phóng sinh",
        "Về nhà chăm sóc cha mẹ",
      ],
    },
  },
];
