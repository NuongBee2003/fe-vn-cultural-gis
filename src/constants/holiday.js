import Firework from "@/assets/img/holiday/firework.jpg";
import LunarNewYear from "@/assets/img/holiday/lunar-newyear.jpg";
import GiaiPhong from "@/assets/img/holiday/ngay-giai-phong-mien-nam.jpg";
import NhaGiao from "@/assets/img/holiday/nha-giao-viet-nam.jpg";
import PhuNuVN from "@/assets/img/holiday/phu-nu-vn.jpg";
import QTPhuNu from "@/assets/img/holiday/qt-phu-nu.jpg";
import QTThieuNhi from "@/assets/img/holiday/qt-thieu-nhi.jpg";
import QuocKhanh from "@/assets/img/holiday/Quoc-khanh.jpg";
import QTLaoDong from "@/assets/img/holiday/quoc-te-lao-dong.png";
import TrungThu from "@/assets/img/holiday/trung-thu.jpg";
import Valungtung from "@/assets/img/holiday/valentine.jpg";
import GioTo from "@/assets/img/holiday/gio-to-hung-vuong.jpg";
import VuLan from "@/assets/img/holiday/VuLan.webp";
import HaiLoc from "@/assets/img/holiday/HaiLoc.jpg";
import CungToNghe from "@/assets/img/holiday/CungToNghe.jpg";

export const HOLIDAYS = [
  {
    title: "Ngày lễ quốc gia",
    items: [
      {
        date: "1/1",
        label: "Tết Dương lịch",
        description: "Ngày đầu năm theo lịch Gregorius",
        image: Firework,
      },
      {
        date: "Tết âm lịch",
        label: "Tết Nguyên đán",
        description: "Ngày lễ lớn nhất của người Việt",
        image: LunarNewYear,
      },
      {
        date: "10/3 âm lịch",
        label: "Giỗ Tổ Hùng Vương",
        description: "Ngày tưởng nhớ các Vua Hùng dựng nước",
        image: GioTo,
      },
      {
        date: "30/4",
        label: "Ngày Giải phóng miền Nam",
        description: "Kỷ niệm ngày đất nước thống nhất",
        image: GiaiPhong,
      },
      {
        date: "1/5",
        label: "Ngày Quốc tế Lao động",
        description: "Ngày dành cho người lao động",
        image: QTLaoDong,
      },
      {
        date: "2/9",
        label: "Ngày Quốc khánh",
        description: "Kỷ niệm ngày thành lập nước Việt Nam",
        image: QuocKhanh,
      },
    ],
  },

  {
    title: "Lễ Tết & lễ hội truyền thống",
    items: [
      {
        date: "Rằm tháng Giêng",
        label: "Tết Nguyên Tiêu",
        description: "Lễ rằm đầu tiên của năm mới âm lịch",
        image: HaiLoc,
      },
      {
        date: "3/3 âm lịch",
        label: "Tết Hàn Thực",
        description: "Ngày làm bánh trôi bánh chay tưởng nhớ tổ tiên",
        image: LunarNewYear,
      },
      {
        date: "5/5 âm lịch",
        label: "Tết Đoan Ngọ",
        description: "Tết diệt sâu bọ theo phong tục dân gian Việt Nam",
        image: LunarNewYear,
      },
      {
        date: "15/8 âm lịch",
        label: "Tết Trung thu",
        description: "Ngày hội thiếu nhi và đoàn viên",
        image: TrungThu,
      },
      {
        date: "15/7 âm lịch",
        label: "Lễ Vu Lan",
        description: "Ngày lễ báo hiếu trong Phật giáo",
        image: VuLan,
      },
      {
        date: "23 tháng Chạp",
        label: "Ông Công Ông Táo",
        description: "Lễ tiễn Táo quân về trời trước Tết",
        image: LunarNewYear,
      },
      {
        date: "Rằm tháng Giêng",
        label: "Lễ hội Hái Lộc",
        description: "Phong tục cầu may đầu năm mới",
        image: HaiLoc,
      },
      {
        date: "Đầu xuân",
        label: "Lễ Cúng Tổ Nghề",
        description: "Tưởng nhớ tổ nghề truyền thống",
        image: CungToNghe,
      },
    ],
  },

  {
    title: "Ngày kỷ niệm văn hóa - xã hội",
    items: [
      {
        date: "14/2",
        label: "Ngày Lễ tình nhân",
        description: "Ngày dành cho tình yêu và đôi lứa",
        image: Valungtung,
      },
      {
        date: "8/3",
        label: "Ngày Quốc tế Phụ nữ",
        description: "Tôn vinh phụ nữ trên toàn thế giới",
        image: QTPhuNu,
      },
      {
        date: "1/6",
        label: "Ngày Quốc tế Thiếu nhi",
        description: "Ngày dành cho trẻ em",
        image: QTThieuNhi,
      },
      {
        date: "20/10",
        label: "Ngày Phụ nữ Việt Nam",
        description: "Tôn vinh phụ nữ Việt Nam",
        image: PhuNuVN,
      },
      {
        date: "20/11",
        label: "Ngày Nhà giáo Việt Nam",
        description: "Ngày tri ân thầy cô giáo",
        image: NhaGiao,
      },
    ],
  },
];