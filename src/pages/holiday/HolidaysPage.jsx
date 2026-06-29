import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { holidayApi } from "@/api/holidayApi";
import InfoHoliday from "@/components/user/holiday/InfoHoliday";
import HolidayDetailModal from "@/components/user/holiday/HolidayDetailModal";

// Import local image assets
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
import TetHanThuc from "@/assets/img/holiday/Tết Hàn thực.jpg";
import TetDoanNgo from "@/assets/img/holiday/tết đoan ngọ.jpg";
import OngCongOngTao from "@/assets/img/holiday/ông công ông táo.jpg";
import NghinhOng from "@/assets/img/holiday/nghinh ông.jpg";
import LeDinhKyYen from "@/assets/img/holiday/Lễ đình kỳ yên.jpg";
import GiangSinh from "@/assets/img/holiday/Giansg sinh.jpg";
import ThuongBinhLS from "@/assets/img/holiday/Thương Binh LS.jpg";
import QuanDoiND from "@/assets/img/holiday/TL Quân đôi ND VN.jpg";
import TetNguyenTieu from "@/assets/img/holiday/Tết nguyên tiêu.jpg";

const HOLIDAY_IMAGES = {
  "firework.jpg": Firework,
  "lunar-newyear.jpg": LunarNewYear,
  "ngay-giai-phong-mien-nam.jpg": GiaiPhong,
  "nha-giao-viet-nam.jpg": NhaGiao,
  "phu-nu-vn.jpg": PhuNuVN,
  "qt-phu-nu.jpg": QTPhuNu,
  "qt-thieu-nhi.jpg": QTThieuNhi,
  "Quoc-khanh.jpg": QuocKhanh,
  "quoc-te-lao-dong.png": QTLaoDong,
  "trung-thu.jpg": TrungThu,
  "valentine.jpg": Valungtung,
  "gio-to-hung-vuong.jpg": GioTo,
  "VuLan.webp": VuLan,
  "HaiLoc.jpg": HaiLoc,
  "CungToNghe.jpg": CungToNghe,
  "Tết Hàn thực.jpg": TetHanThuc,
  "tết đoan ngọ.jpg": TetDoanNgo,
  "ông công ông táo.jpg": OngCongOngTao,
  "nghinh ông.jpg": NghinhOng,
  "Lễ đình kỳ yên.jpg": LeDinhKyYen,
  "Giansg sinh.jpg": GiangSinh,
  "Thương Binh LS.jpg": ThuongBinhLS,
  "TL Quân đôi ND VN.jpg": QuanDoiND,
  "Tết nguyên tiêu.jpg": TetNguyenTieu,
};

export default function HolidaysPage() {
  const [holidayGroups, setHolidayGroups] = useState([]);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await holidayApi.getAllHolidays();
        const data = res.data || [];
        
        // Nhóm dữ liệu theo category theo thứ tự mong muốn
        const categoriesOrder = [
          "Ngày lễ quốc gia",
          "Lễ Tết & lễ hội truyền thống",
          "Ngày kỷ niệm văn hóa - xã hội"
        ];
        
        const groupsMap = {};
        categoriesOrder.forEach(cat => {
          groupsMap[cat] = [];
        });

        data.forEach(item => {
          const image = HOLIDAY_IMAGES[item.image_url] || item.image_url;
          
          const formattedItem = {
            date: item.date_label,
            label: item.name,
            description: item.description,
            image: image,
            location_ids: item.location_ids,
            locations: item.locations,
            details: {
              history: item.history,
              activities: Array.isArray(item.activities) ? item.activities : JSON.parse(item.activities || "[]"),
              foods: Array.isArray(item.foods) ? item.foods : JSON.parse(item.foods || "[]")
            }
          };

          const cat = item.category;
          if (groupsMap[cat]) {
            groupsMap[cat].push(formattedItem);
          } else {
            groupsMap[cat] = [formattedItem];
          }
        });

        const formattedGroups = Object.keys(groupsMap).map(title => ({
          title,
          items: groupsMap[title]
        })).filter(g => g.items.length > 0);

        setHolidayGroups(formattedGroups);
      } catch (error) {
        console.error("Lỗi khi tải lịch lễ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 min-w-0 h-full w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-slate-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <header className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Lịch lễ Việt Nam
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Các ngày lễ & kỷ niệm quan trọng
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 max-w-2xl">
              Tổng hợp những ngày lễ chính và các ngày kỷ niệm phổ biến tại Việt Nam. Nhấp vào mỗi ngày lễ để xem ý nghĩa, hoạt động và các gợi ý du lịch, ẩm thực chi tiết.
            </p>
          </header>

          {/* Groups */}
          <div className="space-y-12">
            {holidayGroups.map((group) => (
              <section key={group.title}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-semibold text-slate-800">{group.title}</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((item) => (
                    <InfoHoliday 
                      key={item.label} 
                      item={item} 
                      onClick={setSelectedHoliday}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {selectedHoliday && (
        <HolidayDetailModal
          item={selectedHoliday}
          onClose={() => setSelectedHoliday(null)}
        />
      )}
    </div>
  );
}