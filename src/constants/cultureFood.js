import BanhBeo from "@/assets/img/cuisine/banhbeo.jpg";
import BanhXeo from "@/assets/img/cuisine/BanhXeo.jpg";
import BunBoHue from "@/assets/img/cuisine/BunBoHue.jpg";
import BunChaHN from "@/assets/img/cuisine/BunChaHN.jpg";
import ComLam from "@/assets/img/cuisine/ComLam.jpg";
import ComLV from "@/assets/img/cuisine/ComLV.jpg";
import ComTam from "@/assets/img/cuisine/ComTam.jpg";
import GaNuongCL from "@/assets/img/cuisine/GaNuongCL.jpg";
import HuTieuNamVang from "@/assets/img/cuisine/hutieunamvang.jpg";
import MiQuang from "@/assets/img/cuisine/MiQuang.jpg";
import PhoHN from "@/assets/img/cuisine/PhoHN.jpg";
import RuouCan from "@/assets/img/cuisine/RuouCan.jpg";

import BanhMiVN from "@/assets/img/cuisine/BanhMiVN.jpg";
import GoiCuon from "@/assets/img/cuisine/GoiCuon.jpg";
import CaoLau from "@/assets/img/cuisine/CaoLau.jpg";
import BunDauMamTom from "@/assets/img/cuisine/BunDauMamTom.jpg";
import NemRan from "@/assets/img/cuisine/NemRan.jpg";
import ChaCaLaVong from "@/assets/img/cuisine/ChaCaLaVong.jpg";
import CafeSuaDa from "@/assets/img/cuisine/CafeSuaDa.jpg";
import BunMam from "@/assets/img/cuisine/BunMam.jpg";
import BanhCanhCua from "@/assets/img/cuisine/BanhCanhCua.jpg";
import BanhBotLoc from "@/assets/img/cuisine/BanhBotLoc.jpg";
import HuTieuGo from "@/assets/img/cuisine/HuTieuGo.jpg";
import BoNhungGiam from "@/assets/img/cuisine/BoNhungGiam.jpg";

/** @typedef {"all" | "north" | "central" | "south" | "highland"} FoodRegion */

export const FOOD_REGION_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "north", label: "Miền Bắc" },
  { key: "central", label: "Miền Trung" },
  { key: "south", label: "Miền Nam" },
  { key: "highland", label: "Tây Nguyên" },
];

export const FOOD_REGION_LABELS = {
  north: "Miền Bắc",
  central: "Miền Trung",
  south: "Miền Nam",
  highland: "Tây Nguyên",
};

/** @type {import("./cultureTypes").CultureItem[]} */
export const CULTURE_FOOD_ITEMS = [
  {
    id: "food-1",
    title: "Phở Hà Nội",
    summary:
      "Món quốc dân với nước dùng trong veo, bánh phở mềm và thịt bò tái chín.",
    image: PhoHN,
    region: "north",
    province: "Hà Nội",
    tags: ["Món nước", "Ăn sáng"],
    detail: {
      description:
        "Phở ra đời và phát triển mạnh ở Hà Nội đầu thế kỷ XX, trở thành biểu tượng ẩm thực Việt.",
      highlights: [
        "Nước dùng ninh từ xương bò",
        "Ăn kèm rau thơm, chanh, ớt",
        "Có phở bò và phở gà",
      ],
      ingredients: [
        "Bánh phở",
        "Thịt bò",
        "Hành lá",
        "Gừng",
        "Quế, hồi",
        "Nước mắm",
      ],
    },
  },

  {
    id: "food-2",
    title: "Bún chả Hà Nội",
    summary:
      "Thịt nướng than hoa, nước mắm pha chua ngọt và bún tươi.",
    image: BunChaHN,
    region: "north",
    province: "Hà Nội",
    tags: ["Nướng", "Đặc sản"],
    detail: {
      description:
        "Bún chả là món ăn đường phố nổi tiếng của Hà Nội.",
      highlights: [
        "Chả nướng than",
        "Nước chấm chua ngọt",
        "Ăn kèm rau sống",
      ],
      ingredients: [
        "Thịt ba chỉ",
        "Bún tươi",
        "Nước mắm",
        "Tỏi",
        "Ớt",
      ],
    },
  },

  {
    id: "food-3",
    title: "Cốm làng Vòng",
    summary:
      "Cốm non dẻo thơm, món quà thu Hà Nội gắn với văn hóa mùa vàng.",
    image: ComLV,
    region: "north",
    province: "Hà Nội",
    tags: ["Mùa vụ", "Truyền thống"],
    detail: {
      description:
        "Cốm làng Vòng được làm từ lúa non, có hương thơm đặc trưng.",
      highlights: [
        "Thu hoạch lúa non",
        "Mùa thu Hà Nội",
        "Quà biếu truyền thống",
      ],
      ingredients: [
        "Lúa nếp non",
        "Lá sen",
        "Hạt sen",
      ],
    },
  },

  {
    id: "food-4",
    title: "Bún bò Huế",
    summary:
      "Vị cay nồng, nước dùng đậm đà đặc trưng xứ Huế.",
    image: BunBoHue,
    region: "central",
    province: "Thừa Thiên Huế",
    tags: ["Cay", "Món nước"],
    detail: {
      description:
        "Bún bò Huế nổi bật với sả, ớt và mắm ruốc.",
      highlights: [
        "Cay và thơm sả",
        "Chả cua, giò heo",
        "Ăn sáng phổ biến",
      ],
      ingredients: [
        "Bún",
        "Bắp bò",
        "Sả",
        "Ớt",
        "Mắm ruốc",
      ],
    },
  },

  {
    id: "food-5",
    title: "Mì Quảng",
    summary:
      "Mì vàng nghệ, ít nước, topping đa dạng của Quảng Nam.",
    image: MiQuang,
    region: "central",
    province: "Quảng Nam",
    tags: ["Địa phương", "Mì"],
    detail: {
      description:
        "Mì Quảng có nước dùng sệt và màu vàng đặc trưng từ nghệ.",
      highlights: [
        "Mì vàng nghệ",
        "Ăn kèm bánh tráng",
        "Rau sống phong phú",
      ],
      ingredients: [
        "Mì Quảng",
        "Tôm",
        "Thịt heo",
        "Nghệ",
      ],
    },
  },

  {
    id: "food-6",
    title: "Bánh bèo chén",
    summary:
      "Bánh nhỏ trong chén, rắc tôm cháy và mỡ hành.",
    image: BanhBeo,
    region: "central",
    province: "Huế",
    tags: ["Ăn vặt", "Cung đình"],
    detail: {
      description:
        "Bánh bèo là món ăn vặt nổi tiếng của Huế.",
      highlights: [
        "Bánh mỏng trong chén",
        "Tôm cháy, mỡ hành",
        "Ăn nhiều chén",
      ],
      ingredients: [
        "Bột gạo",
        "Tôm khô",
        "Mỡ hành",
      ],
    },
  },
  {
  id: "food-20",
  title: "Bún mắm",
  summary:
    "Món bún miền Tây với nước lèo mắm cá đậm đà và hải sản phong phú.",
  image: BunMam,
  region: "south",
  province: "Sóc Trăng",
  tags: ["Món nước", "Miền Tây"],
  detail: {
    description:
      "Bún mắm là đặc sản miền Tây Nam Bộ nổi bật với hương vị mắm cá đặc trưng.",
    highlights: [
      "Nước lèo đậm vị",
      "Ăn cùng hải sản",
      "Rau sống phong phú",
    ],
    ingredients: [
      "Bún",
      "Mắm cá",
      "Tôm",
      "Mực",
      "Cà tím",
      "Rau sống",
    ],
  },
},

{
  id: "food-21",
  title: "Bánh canh cua",
  summary:
    "Sợi bánh canh dai mềm ăn cùng nước cua đậm đà.",
  image: BanhCanhCua,
  region: "south",
  province: "TP. Hồ Chí Minh",
  tags: ["Món nước", "Hải sản"],
  detail: {
    description:
      "Bánh canh cua nổi tiếng với nước dùng sánh và topping phong phú.",
    highlights: [
      "Nước dùng cua",
      "Sợi bánh dai",
      "Chả cua hấp dẫn",
    ],
    ingredients: [
      "Bánh canh",
      "Cua",
      "Tôm",
      "Trứng cút",
      "Hành ngò",
    ],
  },
},

{
  id: "food-22",
  title: "Bánh bột lọc",
  summary:
    "Bánh trong suốt nhân tôm thịt nổi tiếng xứ Huế.",
  image: BanhBotLoc,
  region: "central",
  province: "Thừa Thiên Huế",
  tags: ["Ăn vặt", "Huế"],
  detail: {
    description:
      "Bánh bột lọc được làm từ bột năng với nhân tôm thịt đậm đà.",
    highlights: [
      "Vỏ bánh dai",
      "Nhân tôm thịt",
      "Ăn với nước mắm cay",
    ],
    ingredients: [
      "Bột năng",
      "Tôm",
      "Thịt ba chỉ",
      "Nước mắm",
      "Ớt",
    ],
  },
},

{
  id: "food-23",
  title: "Hủ tiếu gõ",
  summary:
    "Món ăn đêm quen thuộc trên đường phố Sài Gòn.",
  image: HuTieuGo,
  region: "south",
  province: "TP. Hồ Chí Minh",
  tags: ["Đường phố", "Ăn khuya"],
  detail: {
    description:
      "Hủ tiếu gõ gắn liền với văn hóa ăn đêm của người Sài Gòn.",
    highlights: [
      "Xe đẩy ven đường",
      "Nước lèo thanh",
      "Giá bình dân",
    ],
    ingredients: [
      "Hủ tiếu",
      "Thịt heo",
      "Gan",
      "Hẹ",
      "Hành phi",
    ],
  },
},

{
  id: "food-24",
  title: "Bò nhúng giấm",
  summary:
    "Món bò nóng hổi ăn kèm rau sống và bánh tráng.",
  image: BoNhungGiam,
  region: "south",
  province: "TP. Hồ Chí Minh",
  tags: ["Lẩu", "Cuốn"],
  detail: {
    description:
      "Bò nhúng giấm có vị chua thanh đặc trưng từ nước dùng giấm.",
    highlights: [
      "Thịt bò mềm",
      "Cuốn bánh tráng",
      "Nước chấm đậm vị",
    ],
    ingredients: [
      "Thịt bò",
      "Giấm",
      "Rau sống",
      "Bánh tráng",
      "Bún",
    ],
  },
},

  {
    id: "food-7",
    title: "Hủ tiếu Nam Vang",
    summary:
      "Hủ tiếu trong, topping phong phú — biểu tượng ẩm thực miền Nam.",
    image: HuTieuNamVang,
    region: "south",
    province: "TP. Hồ Chí Minh",
    tags: ["Món nước", "Đường phố"],
    detail: {
      description:
        "Hủ tiếu Nam Vang chịu ảnh hưởng Campuchia – Trung Hoa.",
      highlights: [
        "Nước lèo trong ngọt",
        "Tôm, thịt băm",
        "Ăn kèm giá, hẹ",
      ],
      ingredients: [
        "Hủ tiếu",
        "Tôm",
        "Thịt heo",
      ],
    },
  },

  {
    id: "food-8",
    title: "Bánh xèo miền Tây",
    summary:
      "Bánh vàng giòn rụm, nhân tôm thịt, cuốn rau đủ loại.",
    image: BanhXeo,
    region: "south",
    province: "Cần Thơ",
    tags: ["Chiên", "Cuốn"],
    detail: {
      description:
        "Bánh xèo miền Tây thường to và giòn hơn.",
      highlights: [
        "Vỏ giòn vàng",
        "Nhân tôm thịt",
        "Cuốn bánh tráng",
      ],
      ingredients: [
        "Bột gạo",
        "Nước cốt dừa",
        "Tôm",
      ],
    },
  },

  {
    id: "food-9",
    title: "Cơm tấm Sài Gòn",
    summary:
      "Cơm gạo tấm, sườn nướng, bì chả — bữa sáng đặc trưng phố thị.",
    image: ComTam,
    region: "south",
    province: "TP. Hồ Chí Minh",
    tags: ["Cơm", "Ăn sáng"],
    detail: {
      description:
        "Cơm tấm là món ăn bình dân nổi tiếng của Sài Gòn.",
      highlights: [
        "Sườn nướng mật ong",
        "Đồ chua",
        "Mắm tỏi ớt",
      ],
      ingredients: [
        "Gạo tấm",
        "Sườn heo",
        "Bì",
      ],
    },
  },

  {
    id: "food-10",
    title: "Cơm lam Tây Nguyên",
    summary:
      "Cơm nếp nấu trong ống tre, hương khói núi rừng.",
    image: ComLam,
    region: "highland",
    province: "Gia Lai",
    tags: ["Dân tộc", "Nếp"],
    detail: {
      description:
        "Cơm lam là món truyền thống nhiều dân tộc Tây Nguyên.",
      highlights: [
        "Nấu trong ống tre",
        "Ăn bóc vỏ tre",
        "Đi kèm muối vừng",
      ],
      ingredients: [
        "Gạo nếp",
        "Ống tre",
        "Muối vừng",
      ],
    },
  },

  {
    id: "food-11",
    title: "Gà nướng cơm lam",
    summary:
      "Gà ướp gia vị núi rừng, nướng than hoa cùng cơm lam.",
    image: GaNuongCL,
    region: "highland",
    province: "Đắk Lắk",
    tags: ["Nướng", "Tiệc"],
    detail: {
      description:
        "Món ăn đặc trưng trong các lễ hội Tây Nguyên.",
      highlights: [
        "Ướp lá é",
        "Nướng than",
        "Ăn cùng cơm lam",
      ],
      ingredients: [
        "Gà ta",
        "Lá é",
        "Muối ớt",
      ],
    },
  },
    {
    id: "food-13",
    title: "Bánh mì Việt Nam",
    summary:
      "Ổ bánh mì giòn với pate, thịt, rau và nước sốt đậm vị.",
    image: BanhMiVN,
    region: "south",
    province: "TP. Hồ Chí Minh",
    tags: ["Đường phố", "Fast food"],
    detail: {
      description:
        "Bánh mì Việt Nam là món ăn đường phố nổi tiếng thế giới.",
      highlights: [
        "Vỏ bánh giòn",
        "Nhân đa dạng",
        "Ăn nhanh tiện lợi",
      ],
      ingredients: [
        "Bánh mì",
        "Pate",
        "Chả lụa",
        "Đồ chua",
        "Rau ngò",
      ],
    },
  },

  {
    id: "food-14",
    title: "Gỏi cuốn",
    summary:
      "Món cuốn thanh mát với tôm, thịt và rau sống.",
    image: GoiCuon,
    region: "south",
    province: "TP. Hồ Chí Minh",
    tags: ["Cuốn", "Healthy"],
    detail: {
      description:
        "Gỏi cuốn là món ăn nhẹ nổi tiếng của miền Nam.",
      highlights: [
        "Cuốn bánh tráng",
        "Ăn kèm nước chấm",
        "Ít dầu mỡ",
      ],
      ingredients: [
        "Bánh tráng",
        "Tôm",
        "Thịt luộc",
        "Bún",
        "Rau sống",
      ],
    },
  },

  {
    id: "food-15",
    title: "Cao lầu Hội An",
    summary:
      "Mì cao lầu với thịt xíu, rau sống và nước dùng ít.",
    image: CaoLau,
    region: "central",
    province: "Quảng Nam",
    tags: ["Đặc sản", "Mì"],
    detail: {
      description:
        "Cao lầu là món ăn đặc trưng phố cổ Hội An.",
      highlights: [
        "Sợi mì dai",
        "Ăn ít nước",
        "Rau Trà Quế",
      ],
      ingredients: [
        "Mì cao lầu",
        "Thịt xíu",
        "Rau sống",
        "Da heo chiên",
      ],
    },
  },

  {
    id: "food-16",
    title: "Bún đậu mắm tôm",
    summary:
      "Mẹt bún đậu với chả cốm, thịt luộc và mắm tôm.",
    image: BunDauMamTom,
    region: "north",
    province: "Hà Nội",
    tags: ["Đặc sản", "Mắm tôm"],
    detail: {
      description:
        "Bún đậu là món ăn dân dã rất phổ biến ở miền Bắc.",
      highlights: [
        "Đậu phụ chiên giòn",
        "Mắm tôm đậm vị",
        "Ăn theo mẹt",
      ],
      ingredients: [
        "Bún lá",
        "Đậu hũ",
        "Mắm tôm",
        "Thịt luộc",
        "Rau thơm",
      ],
    },
  },

  {
    id: "food-17",
    title: "Nem rán",
    summary:
      "Nem chiên giòn với nhân thịt, mộc nhĩ và rau củ.",
    image: NemRan,
    region: "north",
    province: "Hà Nội",
    tags: ["Chiên", "Truyền thống"],
    detail: {
      description:
        "Nem rán thường xuất hiện trong mâm cỗ và dịp lễ Tết.",
      highlights: [
        "Vỏ giòn rụm",
        "Nhân đậm đà",
        "Ăn kèm rau sống",
      ],
      ingredients: [
        "Bánh đa nem",
        "Thịt heo",
        "Mộc nhĩ",
        "Miến",
        "Cà rốt",
      ],
    },
  },

  {
    id: "food-18",
    title: "Chả cá Lã Vọng",
    summary:
      "Cá lăng nướng nghệ ăn cùng bún và rau thơm.",
    image: ChaCaLaVong,
    region: "north",
    province: "Hà Nội",
    tags: ["Đặc sản", "Cá"],
    detail: {
      description:
        "Chả cá Lã Vọng là món ăn nổi tiếng lâu đời của Hà Nội.",
      highlights: [
        "Cá nướng nghệ",
        "Ăn nóng tại bàn",
        "Kèm thì là",
      ],
      ingredients: [
        "Cá lăng",
        "Nghệ",
        "Hành lá",
        "Thì là",
        "Bún",
      ],
    },
  },

  {
    id: "food-19",
    title: "Cà phê sữa đá",
    summary:
      "Cà phê phin đậm vị hòa cùng sữa đặc ngọt béo.",
    image: CafeSuaDa,
    region: "south",
    province: "TP. Hồ Chí Minh",
    tags: ["Đồ uống", "Cà phê"],
    detail: {
      description:
        "Cà phê sữa đá là thức uống biểu tượng của văn hóa cà phê Việt Nam.",
      highlights: [
        "Pha bằng phin",
        "Vị đậm mạnh",
        "Uống với đá",
      ],
      ingredients: [
        "Cà phê rang",
        "Sữa đặc",
        "Đá viên",
      ],
    },
  },

  {
    id: "food-12",
    title: "Rượu cần",
    summary:
      "Rượu men lá, uống chung cần — nét văn hóa cộng đồng Tây Nguyên.",
    image: RuouCan,
    region: "highland",
    province: "Kon Tum",
    tags: ["Đồ uống", "Lễ hội"],
    detail: {
      description:
        "Rượu cần gắn liền với lễ hội cồng chiêng Tây Nguyên.",
      highlights: [
        "Ủ trong chum",
        "Uống qua cần tre",
        "Dùng trong lễ hội",
      ],
      ingredients: [
        "Gạo nếp",
        "Men lá",
        "Nước suối",
      ],
    },
  },
];
