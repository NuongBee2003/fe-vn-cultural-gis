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
export const HOLIDAYS = [
  {
    title: "Ngày lễ chính",
    items: [
      {
        date: "1/1",
        label: "Tết Dương lịch",
        description: "Ngày đầu năm theo lịch Gregorius",
        image: Firework,
      },
      {
        date: "Giáp Tết",
        label: "Tết Nguyên đán",
        description: "Ngày lễ lớn nhất của người Việt, thay đổi theo lịch âm",
        image: LunarNewYear,
      },
      {
        date: "30/4",
        label: "Ngày Giải phóng miền Nam",
        description: "Kỷ niệm ngày miền Nam hoàn toàn giải phóng",
        image: GiaiPhong,
      },
      {
        date: "1/5",
        label: "Ngày Quốc tế Lao động",
        description: "Ngày nghỉ chung cho người lao động",
        image: QTLaoDong,
      },
      {
        date: "2/9",
        label: "Ngày Quốc khánh",
        description: "Kỷ niệm ngày nước Việt Nam Dân chủ Cộng hòa thành lập",
        image: QuocKhanh,
      },
      {
        date: "10/3 âm lịch",
        label: "Giỗ Tổ Hùng Vương",
        description: "Kỷ niệm ngày giỗ Quốc Tổ ở đền Hùng",
        image: GioTo,
      },
      {
        date: "15/8 âm lịch",
        label: "Tết Trung thu",
        description: "Ngày hội thiếu nhi và đoàn viên gia đình",
        image: TrungThu,
      },
      {
        date: "20/10",
        label: "Ngày Phụ nữ Việt Nam",
        description: "Tôn vinh vai trò và đóng góp của phụ nữ",
        image: PhuNuVN,
      },
    ],
  },
  {
    title: "Các ngày kỷ niệm phổ biến",
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
        description: "Tôn vinh phụ nữ toàn cầu",
        image: QTPhuNu,
      },
      {
        date: "1/6",
        label: "Ngày Quốc tế Thiếu nhi",
        description: "Ngày dành cho trẻ em",
        image:QTThieuNhi,
      },
      {
        date: "20/11",
        label: "Ngày Nhà giáo Việt Nam",
        description: "Tôn vinh thầy cô giáo",
        image: NhaGiao,
      },
    ],
  },
];