import tetVietNam from "@/assets/img/generate-picture/tetvietnam.jpg";
import cungDinhHue from "@/assets/img/generate-picture/cungdinhhue.webp";
import phoCoHoiAn from "@/assets/img/generate-picture/phocohoian.jpg";
import tayBac from "@/assets/img/generate-picture/taybac.jpg";
import mienTay from "@/assets/img/generate-picture/mientaysongnuoc.jpg";
import saigonXua from "@/assets/img/generate-picture/saigonxua.jpg";
import tranhDongHo from "@/assets/img/generate-picture/tranhdongho.webp";
import coPhuc from "@/assets/img/generate-picture/cophuctrieunguyen.jpg";
import defaultImg from "@/assets/img/generate-picture/default-img.png";

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
    summary: "Món quốc dân với nước dùng trong veo, bánh phở mềm và thịt bò tái chín.",
    image: defaultImg,
    region: "north",
    province: "Hà Nội",
    tags: ["Món nước", "Ăn sáng"],
    detail: {
      description:
        "Phở ra đời và phát triển mạnh ở Hà Nội đầu thế kỷ XX, trở thành biểu tượng ẩm thực Việt. Mỗi quán có bí quyết ninh xương và pha nước mắm riêng.",
      highlights: ["Nước dùng ninh từ xương bò", "Ăn kèm rau thơm, chanh, ớt", "Có phở bò và phở gà"],
      ingredients: ["Bánh phở", "Thịt bò", "Hành lá", "Gừng", "Quế, hồi", "Nước mắm"],
    },
  },
  {
    id: "food-2",
    title: "Bún chả Hà Nội",
    summary: "Thịt nướng than hoa, nước mắm pha chua ngọt và bún tươi.",
    image: tayBac,
    region: "north",
    province: "Hà Nội",
    tags: ["Nướng", "Đặc sản"],
    detail: {
      description:
        "Bún chả từng được giới thiệu trên truyền thông quốc tế như món ăn đường phố đặc trưng Thủ đô, thường dùng vào bữa trưa.",
      highlights: ["Chả nướng than", "Nước chấm có thìa", "Ăn kèm rau sống"],
      ingredients: ["Thịt ba chỉ", "Bún tươi", "Nước mắm", "Đường", "Tỏi", "Ớt"],
    },
  },
  {
    id: "food-3",
    title: "Cốm làng Vòng",
    summary: "Cốm non dẻo thơm, món quà thu Hà Nội gắn với văn hóa mùa vàng.",
    image: tetVietNam,
    region: "north",
    province: "Hà Nội",
    tags: ["Mùa vụ", "Truyền thống"],
    detail: {
      description:
        "Cốm làng Vòng được làm từ lúa non, có hương thơm đặc trưng. Thường ăn trực tiếp hoặc làm cốm xào, bánh cốm.",
      highlights: ["Thu hoạch lúa non", "Mùa thu Hà Nội", "Quà biếu truyền thống"],
      ingredients: ["Lúa nếp non", "Lá sen bọc", "Ăn kèm xôi", "Hạt sen"],
    },
  },
  {
    id: "food-4",
    title: "Bún bò Huế",
    summary: "Vị cay nồng, nước dùng đậm đà đặc trưng xứ Huế.",
    image: cungDinhHue,
    region: "central",
    province: "Thừa Thiên Huế",
    tags: ["Cay", "Món nước"],
    detail: {
      description:
        "Bún bò Huế có nguồn gốc từ cung đình và dân gian Huế, nổi bật với sả, ớt và mắm ruốc trong nước lèo.",
      highlights: ["Cay và thơm sả", "Chả cua, giò heo", "Ăn sáng phổ biến ở Huế"],
      ingredients: ["Bún to", "Bắp bò", "Sả", "Ớt", "Mắm ruốc", "Rau chuối"],
    },
  },
  {
    id: "food-5",
    title: "Mì Quảng",
    summary: "Mì vàng nghệ, ít nước, topping đa dạng của Quảng Nam.",
    image: phoCoHoiAn,
    region: "central",
    province: "Quảng Nam",
    tags: ["Địa phương", "Mì"],
    detail: {
      description:
        "Mì Quảng ăn khô hơn phở, nước dùng sệt và vàng từ nghệ. Thường có tôm, thịt heo, trứng cút.",
      highlights: ["Mì vàng nghệ", "Ăn kèm bánh tráng", "Rau sống đủ loại"],
      ingredients: ["Mì Quảng", "Tôm", "Thịt heo", "Nghệ", "Đậu phộng", "Bánh tráng"],
    },
  },
  {
    id: "food-6",
    title: "Bánh bèo chén",
    summary: "Bánh nhỏ trong chén, rắc tôm cháy và mỡ hành.",
    image: tranhDongHo,
    region: "central",
    province: "Huế",
    tags: ["Ăn vặt", "Cung đình"],
    detail: {
      description:
        "Bánh bèo là món ăn vặt Huế, bày trên khay nhiều chén nhỏ, chấm nước mắm pha loãng.",
      highlights: ["Bánh mỏng trong chén", "Tôm cháy, mỡ hành", "Ăn nhiều chén một lúc"],
      ingredients: ["Bột gạo", "Tôm khô", "Mỡ hành", "Nước mắm", "Hành lá"],
    },
  },
  {
    id: "food-7",
    title: "Hủ tiếu Nam Vang",
    summary: "Hủ tiếu trong, topping phong phú — biểu tượng ẩm thực miền Nam.",
    image: saigonXua,
    region: "south",
    province: "TP. Hồ Chí Minh",
    tags: ["Món nước", "Đường phố"],
    detail: {
      description:
        "Hủ tiếu Nam Vang chịu ảnh hưởng ẩm thực Campuchia – Trung Hoa, phổ biến ở Sài Gòn từ đầu thế kỷ XX.",
      highlights: ["Nước lèo trong ngọt", "Tôm, thịt băm, trứng cút", "Ăn kèm giá, hẹ"],
      ingredients: ["Hủ tiếu", "Tôm", "Thịt heo", "Gan", "Trứng cút", "Hành phi"],
    },
  },
  {
    id: "food-8",
    title: "Bánh xèo miền Tây",
    summary: "Bánh vàng giòn rụm, nhân tôm thịt, cuốn rau đủ địa.",
    image: mienTay,
    region: "south",
    province: "Cần Thơ",
    tags: ["Chiên", "Cuốn"],
    detail: {
      description:
        "Bánh xèo miền Tây thường to hơn, dùng nước cốt dừa, ăn cuốn bánh tráng với nhiều loại rau vườn.",
      highlights: ["Vỏ giòn vàng", "Nhân tôm thịt giá", "Cuốn bánh tráng"],
      ingredients: ["Bột gạo", "Nước cốt dừa", "Tôm", "Giá đỗ", "Rau sống", "Nước mắm chua ngọt"],
    },
  },
  {
    id: "food-9",
    title: "Cơm tấm Sài Gòn",
    summary: "Cơm gạo tấm, sườn nướng, bì chả — bữa sáng đặc trưng phố thị.",
    image: saigonXua,
    region: "south",
    province: "TP. Hồ Chí Minh",
    tags: ["Cơm", "Ăn sáng"],
    detail: {
      description:
        "Cơm tấm phát triển từ món ăn bình dân, trở thành đặc sản Sài Gòn với nhiều biến thể sườn, đùi, bì.",
      highlights: ["Gạo tấm dẻo", "Sườn nướng mật ong", "Đồ chấm mắm tỏi ớt"],
      ingredients: ["Gạo tấm", "Sườn heo", "Bì", "Chả trứng", "Đồ chua", "Mắm tỏi ớt"],
    },
  },
  {
    id: "food-10",
    title: "Cơm lam Tây Nguyên",
    summary: "Cơm nếp nấu trong ống tre, hương khói núi rừng.",
    image: tayBac,
    region: "highland",
    province: "Gia Lai",
    tags: ["Dân tộc", "Nếp"],
    detail: {
      description:
        "Cơm lam là món truyền thống nhiều dân tộc Tây Nguyên, thường dùng trong lễ hội và tiếp khách.",
      highlights: ["Nấu trong ống tre", "Ăn bóc vỏ tre", "Đi kèm muối vừng"],
      ingredients: ["Gạo nếp", "Ống tre", "Muối vừng", "Thịt nướng"],
    },
  },
  {
    id: "food-11",
    title: "Gà nướng cơm lam",
    summary: "Gà ướp gia vị núi rừng, nướng than hoa cùng cơm lam.",
    image: coPhuc,
    region: "highland",
    province: "Đắk Lắk",
    tags: ["Nướng", "Tiệc"],
    detail: {
      description:
        "Món tiệc phổ biến khi đồng bào Tây Nguyên đón khách, gà nướng whole hoặc từng phần với rượu cần.",
      highlights: ["Ướp lá é", "Nướng than", "Dùng trong lễ cúng"],
      ingredients: ["Gà ta", "Lá é", "Muối ớt", "Cơm lam", "Rượu cần"],
    },
  },
  {
    id: "food-12",
    title: "Rượu cần",
    summary: "Rượu men lá, uống chung cần — nét văn hóa cộng đồng Tây Nguyên.",
    image: mienTay,
    region: "highland",
    province: "Kon Tum",
    tags: ["Đồ uống", "Lễ hội"],
    detail: {
      description:
        "Rượu cần không chỉ là đồ uống mà còn gắn nghi lễ cúng, lễ hội cồng chiêng và tiếp đã khách quý.",
      highlights: ["Ủ trong jar", "Uống qua cần tre", "Dùng trong lễ hội"],
      ingredients: ["Gạo nếp", "Men lá", "Nước suối", "Jar ủ"],
    },
  },
];
