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
      restaurants: [
        { name: "Phở Hòa Pasteur", address: "260C Pasteur, Phường Võ Thị Sáu, Quận 3, TP.HCM", price: "75.000đ - 90.000đ" },
        { name: "Phở Lệ", address: "415 Nguyễn Trãi, Phường 7, Quận 5, TP.HCM", price: "80.000đ - 95.000đ" },
        { name: "Phở Phú Vương", address: "339 Lê Văn Sỹ, Phường 1, Quận Tân Bình, TP.HCM", price: "70.000đ - 85.000đ" }
      ]
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
      restaurants: [
        { name: "Bún chả Hoa Đông", address: "121 Lý Tự Trọng, Phường Bến Thành, Quận 1, TP.HCM", price: "60.000đ - 80.000đ" },
        { name: "Bún chả Ánh Hồng", address: "140B Lý Chính Thắng, Phường 7, Quận 3, TP.HCM", price: "55.000đ - 75.000đ" }
      ]
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
      restaurants: [
        { name: "Cốm Mộc Sài Gòn", address: "Chợ hoa Hồ Thị Kỷ, Quận 10, TP.HCM", price: "40.000đ - 60.000đ" },
        { name: "Tiệm Trà & Cốm Hà Nội", address: "18 Lê Thị Riêng, Phường Bến Thành, Quận 1, TP.HCM", price: "35.000đ - 50.000đ" }
      ]
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
      restaurants: [
        { name: "Bún bò Nhân Trí", address: "295 Lê Hồng Phong, Phường 2, Quận 10, TP.HCM", price: "55.000đ - 75.000đ" },
        { name: "Bún bò Út Hưng", address: "113 Bà Huyện Thanh Quan, Phường Võ Thị Sáu, Quận 3, TP.HCM", price: "60.000đ - 80.000đ" },
        { name: "Bún bò Huế Tây Đô", address: "24 Nguyễn Văn Tiết, Lái Thiêu, Thuận An, Bình Dương", price: "45.000đ - 60.000đ" }
      ]
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
      restaurants: [
        { name: "Mì Quảng Sâm", address: "8 Ca Văn Thỉnh, Phường 11, Quận Tân Bình, TP.HCM", price: "40.000đ - 55.000đ" },
        { name: "Mì Quảng Mỹ Sơn", address: "38 Đinh Tiên Hoàng, Phường Đa Kao, Quận 1, TP.HCM", price: "45.000đ - 65.000đ" }
      ]
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
      restaurants: [
        { name: "Bánh bèo Thanh Nga", address: "43 Rạch Bùng Binh, Phường 9, Quận 3, TP.HCM", price: "25.000đ - 40.000đ" },
        { name: "Bánh bèo chén Ngọc Dung", address: "65 Lâm Văn Bền, Phường Tân Kiểng, Quận 7, TP.HCM", price: "30.000đ - 50.000đ" }
      ]
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
      restaurants: [
        { name: "Bún mắm Cô Ba Chợ Lớn", address: "444 Nguyễn Tri Phương, Phường 4, Quận 10, TP.HCM", price: "65.000đ - 85.000đ" },
        { name: "Bún mắm 444", address: "375 Lê Quang Định, Phường 5, Quận Bình Thạnh, TP.HCM", price: "70.000đ - 90.000đ" }
      ]
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
      restaurants: [
        { name: "Bánh canh cua Út Lệ", address: "210 Tô Hiến Thành, Phường 15, Quận 10, TP.HCM", price: "50.000đ - 70.000đ" },
        { name: "Bánh canh cua Hoàng Lan", address: "484 Vĩnh Viễn, Phường 8, Quận 10, TP.HCM", price: "60.000đ - 85.000đ" },
        { name: "Bánh canh cua Bà Ba", address: "Bình Dương Đại Lộ, Phú Hòa, Thủ Dầu Một, Bình Dương", price: "45.000đ - 60.000đ" }
      ]
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
      restaurants: [
        { name: "Bánh lọc O Xuân", address: "22 Nguyễn Hữu Cầu, Phường Tân Định, Quận 1, TP.HCM", price: "30.000đ - 50.000đ" },
        { name: "Chè & Bánh Huế Cố Đô", address: "25 Lê Hồng Phong, Biên Hòa, Đồng Nai", price: "25.000đ - 40.000đ" }
      ]
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
      restaurants: [
        { name: "Xe hủ tiếu gõ Hẻm 150", address: "150 Nguyễn Trãi, Quận 1, TP.HCM", price: "20.000đ - 30.000đ" },
        { name: "Hủ tiếu gõ Bình Dân", address: "Bờ kè Trường Sa, Quận 3, TP.HCM", price: "20.000đ - 25.000đ" }
      ]
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
      restaurants: [
        { name: "Bò nhúng giấm 555 Sài Gòn", address: "229 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM", price: "150.000đ - 250.000đ" },
        { name: "Bò nhúng giấm Cô Ba", address: "42 Trương Công Định, Phường 3, Vũng Tàu", price: "120.000đ - 220.000đ" }
      ]
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
      restaurants: [
        { name: "Hủ tiếu Nhân Quán", address: "122D Nguyễn Trãi, Phường 3, Quận 5, TP.HCM", price: "70.000đ - 90.000đ" },
        { name: "Hủ tiếu Quỳnh", address: "84 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM", price: "80.000đ - 110.000đ" },
        { name: "Hủ tiếu Nam Vang Mỹ Tho", address: "45 Lê Lợi, Biên Hòa, Đồng Nai", price: "50.000đ - 70.000đ" }
      ]
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
      restaurants: [
        { name: "Bánh xèo Ăn Là Ghiền", address: "74 Sương Nguyệt Ánh, Phường Bến Thành, Quận 1, TP.HCM", price: "80.000đ - 150.000đ" },
        { name: "Bánh xèo Mười Xiềm", address: "190 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, TP.HCM", price: "90.000đ - 160.000đ" }
      ]
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
      restaurants: [
        { name: "Cơm tấm Ba Ghiền", address: "84 Đặng Văn Ngữ, Phường 10, Quận Phú Nhuận, TP.HCM", price: "70.000đ - 120.000đ" },
        { name: "Cơm tấm Thuận Kiều", address: "54 Thuận Kiều, Phường 4, Quận 11, TP.HCM", price: "60.000đ - 100.000đ" },
        { name: "Cơm tấm Hướng Dương", address: "34 Nguyễn Văn Tiết, Thủ Dầu Một, Bình Dương", price: "45.000đ - 70.000đ" }
      ]
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
      restaurants: [
        { name: "Ẩm thực Pleiku Quán", address: "10A Trường Sơn, Phường 2, Quận Tân Bình, TP.HCM", price: "50.000đ - 150.000đ" },
        { name: "Tây Nguyên Quán", address: "15 Song Hành, Thảo Điền, Quận 2, TP.HCM", price: "60.000đ - 180.000đ" }
      ]
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
      restaurants: [
        { name: "Gà nướng Núi Rừng", address: "22 Song Hành, Thảo Điền, Quận 2, TP.HCM", price: "180.000đ - 250.000đ" },
        { name: "Quán Gà nướng Tây Nguyên", address: "305 Võ Thị Sáu, Biên Hòa, Đồng Nai", price: "150.000đ - 220.000đ" }
      ]
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
      restaurants: [
        { name: "Bánh mì Huỳnh Hoa", address: "26 Lê Thị Riêng, Phường Bến Thành, Quận 1, TP.HCM", price: "45.000đ - 65.000đ" },
        { name: "Bánh mì Hồng Hoa", address: "54 Nguyễn Văn Tráng, Phường Bến Thành, Quận 1, TP.HCM", price: "30.000đ - 45.000đ" },
        { name: "Bánh mì Tuấn Mập", address: "12 Cách Mạng Tháng Tám, Biên Hòa, Đồng Nai", price: "25.000đ - 35.000đ" }
      ]
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
      restaurants: [
        { name: "Gỏi cuốn Cô Hạnh", address: "420 Hòa Hảo, Phường 5, Quận 10, TP.HCM", price: "8.000đ - 12.000đ/cuốn" },
        { name: "Gỏi cuốn Minh Lâm", address: "25 Trần Hưng Đạo, Phường 1, Vũng Tàu", price: "6.000đ - 10.000đ/cuốn" }
      ]
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
      restaurants: [
        { name: "Cao lầu nướng Đo Đo", address: "10/14 Lương Hữu Khánh, Phường Phạm Ngũ Lão, Quận 1, TP.HCM", price: "45.000đ - 60.000đ" },
        { name: "Hội An Quán", address: "285/12 CMT8, Phường 12, Quận 10, TP.HCM", price: "50.000đ - 70.000đ" }
      ]
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
      restaurants: [
        { name: "Bún đậu Homemade", address: "6 Hồng Hà, Phường 2, Quận Tân Bình, TP.HCM", price: "65.000đ - 90.000đ" },
        { name: "Bún đậu A Vừng", address: "53AB Nguyễn Du, Phường Bến Nghé, Quận 1, TP.HCM", price: "60.000đ - 85.000đ" },
        { name: "Bún đậu mắm tôm Hà Nội", address: "89 Nguyễn Văn Tiết, Lái Thiêu, Bình Dương", price: "40.000đ - 65.000đ" }
      ]
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
      restaurants: [
        { name: "Nem Bắc Quán", address: "15B Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM", price: "45.000đ - 60.000đ" },
        { name: "Bún chả & Nem Hà Nội 26", address: "26/1 Lê Thánh Tôn, Quận 1, TP.HCM", price: "35.000đ - 50.000đ" }
      ]
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
      restaurants: [
        { name: "Chả cá Lã Vọng Hà Nội", address: "36 Tôn Thất Thiệp, Phường Bến Nghé, Quận 1, TP.HCM", price: "150.000đ - 220.000đ" },
        { name: "Chả cá Lã Vọng Hải Vị", address: "24 Thảo Điền, Quận 2, TP.HCM", price: "180.000đ - 250.000đ" }
      ]
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
      restaurants: [
        { name: "Cà phê Vợt Phan Đình Phùng", address: "330 Phan Đình Phùng, Quận Phú Nhuận, TP.HCM", price: "15.000đ - 20.000đ" },
        { name: "Cà phê bệt nhà thờ", address: "Công viên 30/4, Quận 1, TP.HCM", price: "15.000đ - 25.000đ" },
        { name: "Cà phê Vy", address: "277 Lê Thánh Tôn, Quận 1, TP.HCM", price: "25.000đ - 45.000đ" }
      ]
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
      restaurants: [
        { name: "Đặc sản Tây Nguyên Sài Gòn", address: "420 Nguyễn Tri Phương, Quận 10, TP.HCM", price: "120.000đ - 180.000đ/bình" },
        { name: "Quán Ăn Tây Nguyên", address: "12 Võ Thị Sáu, Biên Hòa, Đồng Nai", price: "100.000đ - 150.000đ/bình" }
      ]
    },
  },

  {
    id: "food-25",
    title: "Bánh khọt Vũng Tàu",
    summary: "Những chiếc bánh tròn nhỏ vàng giòn rụm, ôm trọn nhân tôm tươi roi rói, rắc thêm mỡ hành béo ngậy.",
    image: "",
    region: "south",
    province: "Bà Rịa - Vũng Tàu",
    tags: ["Chiên", "Đặc sản", "Ăn chơi"],
    detail: {
      description: "Bánh khọt là món ăn bình dân đặc sản nổi tiếng của Vũng Tàu, có lớp vỏ giòn tan, thơm nước cốt dừa và tôm tươi ngọt lịm.",
      highlights: ["Vỏ giòn rụm màu nghệ", "Nhân tôm ngọt tự nhiên", "Cuốn kèm rau cải, rau xà lách và đu đủ bào"],
      ingredients: ["Bột gạo", "Tôm tươi", "Bột nghệ", "Nước cốt dừa", "Mỡ hành", "Đu đủ bào"],
      restaurants: [
        { name: "Bánh khọt Cô Ba Vũng Tàu", address: "1 Hoàng Hoa Thám, Phường 3, Vũng Tàu", price: "60.000đ - 100.000đ" },
        { name: "Bánh khọt Gốc Vú Sữa", address: "14 Nguyễn Trường Tộ, Phường 2, Vũng Tàu", price: "55.000đ - 90.000đ" },
        { name: "Bánh khọt Cô Ba Vũng Tàu (Sài Gòn)", address: "402 Cao Thắng, Phường 12, Quận 10, TP.HCM", price: "70.000đ - 120.000đ" }
      ]
    }
  },

  {
    id: "food-26",
    title: "Lẩu cá đuối Vũng Tàu",
    summary: "Nồi lẩu chua thanh cay nhẹ với những lát cá đuối tươi mềm sụn giòn sần sật.",
    image: "",
    region: "south",
    province: "Bà Rịa - Vũng Tàu",
    tags: ["Món nước", "Lẩu", "Hải sản"],
    detail: {
      description: "Món lẩu trứ danh của thành phố biển Vũng Tàu, nước lẩu có vị chua ngọt thanh từ măng chua, cá đuối tươi rói thịt săn mềm ăn kèm bắp chuối bào.",
      highlights: ["Thịt cá đuối mềm ngọt kèm sụn giòn", "Nước lẩu chua cay măng chua mặn mà", "Ăn nóng kèm bún tươi bờ biển"],
      ingredients: ["Cá đuối tươi", "Măng chua", "Cà chua", "Bắp chuối", "Bún tươi", "Rau thơm"],
      restaurants: [
        { name: "Lẩu cá đuối Út Mười", address: "16A Trương Công Định, Phường 3, Vũng Tàu", price: "150.000đ - 220.000đ" },
        { name: "Lẩu cá đuối Trận", address: "42 Nguyễn Trường Tộ, Phường 3, Vũng Tàu", price: "140.000đ - 200.000đ" }
      ]
    }
  },

  {
    id: "food-27",
    title: "Gỏi măng cụt đất Bình Dương",
    summary: "Sự kết hợp hoàn hảo giữa măng cụt xanh giòn ngọt chua dịu và thịt gà ta xé phay bùi ngậy.",
    image: "",
    region: "south",
    province: "Bình Dương",
    tags: ["Gỏi", "Mùa vụ", "Trái cây"],
    detail: {
      description: "Món gỏi đặc sản độc đáo của vùng đất Lái Thiêu (Bình Dương), chỉ có vào mùa măng cụt xanh từ tháng 4 đến tháng 6 âm lịch hàng năm.",
      highlights: ["Măng cụt xanh giòn sần sật độc đáo", "Thịt gà ta luộc dai ngọt xé phay", "Nước mắm trộn gỏi chua ngọt thơm tỏi ớt"],
      ingredients: ["Măng cụt xanh", "Gà ta luộc", "Đậu phộng", "Rau răm", "Hành tây", "Nước mắm chua ngọt"],
      restaurants: [
        { name: "Vườn măng cụt Hồng Nam", address: "Lái Thiêu 17, Bình Nhâm, Thuận An, Bình Dương", price: "250.000đ - 350.000đ/dĩa" },
        { name: "Quán ăn Vườn Xưa", address: "An Thạnh N2, Thuận An, Bình Dương", price: "200.000đ - 300.000đ/dĩa" }
      ]
    }
  },

  {
    id: "food-28",
    title: "Lẩu cá kèo lá giang",
    summary: "Lẩu chua lá giang đậm đà ăn kèm cá kèo tươi ngọt thịt và các loại rau sông nước.",
    image: "",
    region: "south",
    province: "TP. Hồ Chí Minh",
    tags: ["Món nước", "Lẩu", "Đặc sản"],
    detail: {
      description: "Lẩu cá kèo lá giang là món ăn vô cùng được ưa chuộng ở Sài Gòn, đặc trưng bởi vị chua thanh của lá giang, vị chát nhẹ của rau đắng và thịt cá kèo mềm ngọt béo ngậy.",
      highlights: ["Nước lẩu chua thanh lá giang", "Cá kèo tươi ngọt thịt béo ngậy", "Ăn kèm rau đắng, rau muống và hoa thiên lý"],
      ingredients: ["Cá kèo tươi", "Lá giang", "Rau đắng", "Bún tươi", "Nước mắm tỏi ớt"],
      restaurants: [
        { name: "Lẩu cá kèo Bà Huyện", address: "18 Bà Huyện Thanh Quan, Phường Võ Thị Sáu, Quận 3, TP.HCM", price: "120.000đ - 180.000đ" },
        { name: "Lẩu cá kèo Mưa Chiều", address: "4 Bà Huyện Thanh Quan, Quận 3, TP.HCM", price: "100.000đ - 160.000đ" }
      ]
    }
  },

  {
    id: "food-29",
    title: "Cháo lòng Bình Dương",
    summary: "Mâm cháo lòng nóng hổi với lòng heo làm sạch luộc chín tới giòn dai ăn kèm cháo huyết đậm vị.",
    image: "",
    region: "south",
    province: "Bình Dương",
    tags: ["Ăn sáng", "Bình dân", "Đặc sản"],
    detail: {
      description: "Đặc sản cháo lòng Bình Dương nổi tiếng với lòng heo tươi ngon được làm sạch tỉ mỉ, luộc chín giòn dai đặt trên mâm ăn cùng bát cháo huyết nóng hổi rắc tiêu hành thơm lừng.",
      highlights: ["Lòng heo luộc giòn dai thơm ngọt", "Cháo huyết ninh nhừ sánh ngọt xương", "Ăn cùng bánh quẩy giòn tan"],
      ingredients: ["Gạo tẻ", "Lòng heo thập cẩm", "Huyết heo", "Hành lá", "Tiêu", "Bánh quẩy"],
      restaurants: [
        { name: "Cháo lòng Phú Long", address: "Quốc lộ 13, Lái Thiêu, Thuận An, Bình Dương", price: "40.000đ - 70.000đ" },
        { name: "Cháo lòng mâm Bình Dương", address: "Phú Cường, Thủ Dầu Một, Bình Dương", price: "35.000đ - 60.000đ" }
      ]
    }
  },

  {
    id: "food-30",
    title: "Bánh bông lan trứng muối",
    summary: "Bánh bông lan nướng lò nhỏ xinh xốp mềm, vị ngọt dịu kết hợp trứng muối bùi béo và chà bông mặn mòi.",
    image: "",
    region: "south",
    province: "Bà Rịa - Vũng Tàu",
    tags: ["Ăn vặt", "Bánh ngọt", "Quà tặng"],
    detail: {
      description: "Bông lan trứng muối là món ăn vặt trứ danh của Vũng Tàu. Những chiếc bánh nhỏ thơm lừng mùi bơ sữa kết hợp hài hòa với vị mặn bùi của trứng muối và phô mai béo ngậy.",
      highlights: ["Cốt bánh nướng xốp mềm thơm bơ", "Trứng muối bùi béo kết hợp chà bông mặn mòi", "Thức quà du lịch Vũng Tàu quen thuộc"],
      ingredients: ["Bột mì", "Trứng gà", "Trứng muối", "Phô mai", "Chà bông", "Bơ nhạt"],
      restaurants: [
        { name: "Bánh bông lan trứng muối Gốc Cột Điện", address: "17B Nguyễn Trường Tộ, Phường 2, Vũng Tàu", price: "25.000đ - 40.000đ/hộp" },
        { name: "Bông lan trứng muối Tấn Phát", address: "129 Lê Lai, Phường 3, Vũng Tàu", price: "20.000đ - 35.000đ/hộp" }
      ]
    }
  },

  {
    id: "food-31",
    title: "Bánh bèo bì Bình Dương",
    summary: "Bánh bèo mềm mướt ăn kèm bì heo dai giòn trộn thính thơm và nước mắm chua ngọt đặc chế.",
    image: "",
    region: "south",
    province: "Bình Dương",
    tags: ["Ăn chơi", "Đặc sản", "Di sản"],
    detail: {
      description: "Bánh bèo bì Chợ Búng là di sản văn hóa phi vật thể quốc gia của tỉnh Bình Dương. Món ăn kết hợp đĩa bánh bèo nhỏ dai mịn với bì heo ram cắt sợi trộn thính gạo, rau thơm và nước mắm tỏi ớt chua ngọt.",
      highlights: ["Bì heo trộn thính gạo rang thơm lừng", "Nước mắm chua ngọt pha tỏi ớt đặc trưng", "Bánh bèo dẻo mịn rưới mỡ hành"],
      ingredients: ["Bột gạo", "Bì heo", "Thịt heo nạc", "Thính gạo", "Mỡ hành", "Nước mắm tỏi ớt"],
      restaurants: [
        { name: "Bánh bèo bì Mỹ Hương (Chợ Búng)", address: "174 Khu phố Thạnh Hòa A, An Thạnh, Thuận An, Bình Dương", price: "30.000đ - 50.000đ" },
        { name: "Bánh bèo bì Ngọc Hương", address: "188 Tỉnh lộ 745, An Thạnh, Thuận An, Bình Dương", price: "25.000đ - 45.000đ" }
      ]
    }
  },

  {
    id: "food-32",
    title: "Phá lấu bò Sài Gòn",
    summary: "Lòng bò ninh mềm trong nước cốt dừa béo ngậy, dậy mùi ngũ vị hương ăn kèm bánh mì hoặc mì gói.",
    image: "",
    region: "south",
    province: "TP. Hồ Chí Minh",
    tags: ["Ăn vặt", "Đường phố", "Bình dân"],
    detail: {
      description: "Phá lấu bò là món ăn đường phố kinh điển của học sinh, sinh viên Sài Gòn. Lòng bò được sơ chế kỹ lưỡng, hầm mềm với nước cốt dừa và các loại gia vị tạo nên nước dùng màu cam sệt, thơm béo đặc trưng chấm cùng nước mắm tắc chua ngọt.",
      highlights: ["Lòng bò dai sần sật được ninh mềm thấm vị", "Nước phá lấu béo ngậy mùi nước cốt dừa và ngũ vị hương", "Chấm mắm tắc chua ngọt chống ngấy cực tốt"],
      ingredients: ["Lòng bò (lá sách, tổ ong, lá mía...)", "Nước cốt dừa", "Ngũ vị hương", "Tắc (quất)", "Bánh mì hoặc mì gói"],
      restaurants: [
        { name: "Phá lấu bò Cô Thảo", address: "243/29G Tôn Đản, Phường 15, Quận 4, TP.HCM", price: "30.000đ - 45.000đ" },
        { name: "Phá lấu Dì Núi", address: "243/30 Tôn Đản, Phường 15, Quận 4, TP.HCM", price: "30.000đ - 50.000đ" },
        { name: "Phá lấu bò Marie Curie", address: "433 Ngô Thời Nhiệm, Phường 6, Quận 3, TP.HCM", price: "25.000đ - 40.000đ" }
      ]
    }
  },

  {
    id: "food-33",
    title: "Gỏi cá mai Vũng Tàu",
    summary: "Cá mai phi lê trong suốt trộn thính, đậu phộng, mè rang thơm phức ăn kèm nước chấm đậu phộng béo ngậy.",
    image: "",
    region: "south",
    province: "Bà Rịa - Vũng Tàu",
    tags: ["Gỏi", "Hải sản", "Đặc sản"],
    detail: {
      description: "Gỏi cá mai là đặc sản vùng biển Vũng Tàu. Loài cá mai thịt trong suốt, ít tanh được rút xương, bóp tái chanh rồi trộn cùng thính, đậu phộng, mè rang. Điểm nhấn là nước sốt chấm sệt pha từ nước cốt me, đậu phộng xay nhuyễn thơm bùi béo ngọt.",
      highlights: ["Cá mai ngọt thanh dai giòn tự nhiên", "Nước chấm mè đậu phộng béo bùi đậm đà", "Cuốn bánh tráng cùng nhiều loại rau thơm vùng biển"],
      ingredients: ["Cá mai tươi", "Thính gạo", "Đậu phộng", "Mè rang", "Chanh", "Rau thơm các loại", "Bánh tráng"],
      restaurants: [
        { name: "Gỏi cá mai Vườn Xoài", address: "34/4 Hoàng Hoa Xám, Phường 2, Vũng Tàu", price: "100.000đ - 150.000đ/phần" },
        { name: "Quán gỏi cá mai Ba Hưng", address: "A7/14 Trung tâm đô thị Chí Linh, Phường 10, Vũng Tàu", price: "80.000đ - 130.000đ/phần" }
      ]
    }
  }
];
