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

// New imports matching specific assets
import TetHanThuc from "@/assets/img/holiday/Tết Hàn thực.jpg";
import TetDoanNgo from "@/assets/img/holiday/tết đoan ngọ.jpg";
import OngCongOngTao from "@/assets/img/holiday/ông công ông táo.jpg";
import NghinhOng from "@/assets/img/holiday/nghinh ông.jpg";
import LeDinhKyYen from "@/assets/img/holiday/Lễ đình kỳ yên.jpg";
import GiangSinh from "@/assets/img/holiday/Giansg sinh.jpg";
import ThuongBinhLS from "@/assets/img/holiday/Thương Binh LS.jpg";
import QuanDoiND from "@/assets/img/holiday/TL Quân đôi ND VN.jpg";
import TetNguyenTieu from "@/assets/img/holiday/Tết nguyên tiêu.jpg";

export const HOLIDAYS = [
  {
    title: "Ngày lễ quốc gia",
    items: [
      {
        date: "1/1",
        label: "Tết Dương lịch",
        description: "Ngày đầu năm theo lịch Gregorius",
        image: Firework,
        details: {
          history: "Tết Dương lịch đánh dấu khởi đầu năm mới theo lịch Gregorius. Đây là ngày nghỉ lễ toàn quốc và tại khu vực quanh Sài Gòn, thời tiết đầu năm vô cùng ôn hòa mát mẻ, lý tưởng để tham gia các sự kiện countdown ngoài trời sôi động hoặc du lịch biển ngắn ngày.",
          activities: [
            "Hòa mình vào lễ hội âm nhạc đếm ngược (countdown) tại phố đi bộ Nguyễn Huệ.",
            "Xem bắn pháo hoa mừng năm mới bên bờ sông Sài Gòn.",
            "Du lịch dã ngoại ngắm biển Vũng Tàu cùng gia đình.",
            "Tổ chức tiệc nướng BBQ hoặc liên hoan cuối tuần tại gia."
          ],
          destinations: [
            { name: "Phố đi bộ Nguyễn Huệ (TP.HCM)", reason: "Trung tâm tổ chức sự kiện âm nhạc đếm ngược (countdown) hoành tráng và bắn pháo hoa đón năm mới nhộn nhịp nhất." },
            { name: "Bãi Sau (Vũng Tàu)", reason: "Tận hưởng làn nước biển trong mát đầu năm, thưởng thức hải sản biển tươi ngon chỉ cách Sài Gòn 2 giờ lái xe." },
            { name: "Khu du lịch sinh thái Thủy Châu (Bình Dương)", reason: "Không gian dã ngoại rộng rãi với hồ nước và suối nhân tạo mát lạnh giải nhiệt ngày nghỉ lễ lý tưởng." }
          ],
          foods: [
            { name: "Bánh khọt Vũng Tàu", reason: "Bánh nhỏ chiên vàng giòn rụm nhân tôm tươi ăn kèm rau cải xanh chấm nước mắm chua ngọt đặc trưng biển." },
            { name: "Hủ tiếu gõ Sài Gòn", reason: "Món ăn đêm bình dân nóng hổi ấm lòng thực khách trên các ngõ phố Sài thành ngày nghỉ lễ." },
            { name: "Lẩu cua đồng bắp bò", reason: "Nồi lẩu đậm đà riêu cua thanh mát thích hợp cho bữa cơm quây quần gia đình dịp lễ." }
          ]
        }
      },
      {
        date: "Tết âm lịch",
        label: "Tết Nguyên đán",
        description: "Ngày lễ lớn nhất của người Việt",
        image: LunarNewYear,
        details: {
          history: "Tết Nguyên Đán là Tết cổ truyền thiêng liêng nhất của dân tộc, là khoảnh khắc giao hòa giữa năm cũ và năm mới. Tại khu vực Nam Bộ nói chung và Sài Gòn nói riêng, ngày Tết mang đặc trưng mai vàng rực rỡ và những nét tâm linh cầu may mắn, sung túc.",
          activities: [
            "Trang hoàng nhà cửa với nhành mai vàng rực rỡ cầu tài lộc.",
            "Đi lễ chùa thắp hương cầu an lành, nhận lì xì đầu năm.",
            "Dạo phố ngắm hoa xuân nghệ thuật được trang hoàng lộng lẫy.",
            "Sum họp gia đình quây quần bên bữa cơm trưa mùng 1 Tết ấm cúng."
          ],
          destinations: [
            { name: "Đường hoa Nguyễn Huệ (TP.HCM)", reason: "Tâm điểm trưng bày hoa nghệ thuật quy mô lớn nhất Đông Nam Bộ mở xuyên suốt dịp Tết cổ truyền." },
            { name: "Chùa Bà Thiên Hậu (Bình Dương)", reason: "Ngôi chùa linh thiêng thu hút đông đảo khách thập phương hành hương cầu an lành đầu xuân mới." },
            { name: "Chùa Linh Sơn Cổ Tự (Vũng Tàu)", reason: "Ngôi cổ tự tĩnh lặng giữa lòng thành phố biển, thích hợp để cầu bình an cho gia đạo." }
          ],
          foods: [
            { name: "Thịt kho hột vịt nước dừa Sài Gòn", reason: "Món ăn cốt lõi mang đậm vị ngọt ngào của nước dừa trong mâm cỗ Tết Sài Gòn và Đông Nam Bộ." },
            { name: "Bánh tét nhân thịt mỡ trứng muối", reason: "Đòn bánh nếp dẻo thơm gói lá chuối tượng trưng cho sự no ấm xum vầy ngày Tết miền Nam." },
            { name: "Củ kiệu tôm khô ngọt dịu", reason: "Món ăn kèm chua ngọt đặc trưng giúp kích thích vị giác và chống ngấy ngày Tết." }
          ]
        }
      },
      {
        date: "10/3 âm lịch",
        label: "Giỗ Tổ Hùng Vương",
        description: "Ngày tưởng nhớ các Vua Hùng dựng nước",
        image: GioTo,
        details: {
          history: "Giỗ Tổ Hùng Vương là dịp toàn dân hướng về nguồn cội dân tộc. Dù ở cách xa đất Tổ Phú Thọ, người dân khu vực quanh Sài Gòn vẫn hướng lòng kính nhớ công lao dựng nước qua các đền thờ Vua Hùng khang trang ngay tại địa phương.",
          activities: [
            "Dâng hương tưởng niệm vua Hùng tại các đền thờ Vua Hùng ở Sài Gòn.",
            "Xem các chương trình biểu diễn nghệ thuật, múa lân sư rồng chào mừng.",
            "Dã ngoại, tắm thác, cắm trại ngắn ngày tại các khu du lịch lân cận."
          ],
          destinations: [
            { name: "Đền thờ Vua Hùng tại Thảo Cầm Viên (TP.HCM)", reason: "Nơi dâng hương tri ân nguồn cội vua Hùng cổ kính, thuận tiện di chuyển ngay trung tâm thành phố." },
            { name: "Khu tưởng niệm các Vua Hùng Quận 9 (TP.HCM)", reason: "Khu đền thờ quy mô hoành tráng, trang nghiêm nhất khu vực Đông Nam Bộ phục vụ lễ giỗ tổ." },
            { name: "Khu du lịch sinh thái Thủy Châu (Bình Dương)", reason: "Tận hưởng làn nước suối mát trong xanh và cắm trại dã ngoại dưới bóng cây cùng gia đình." }
          ],
          foods: [
            { name: "Bánh tét ngũ sắc miền Nam", reason: "Món bánh cúng truyền thống được nhuộm màu từ lá cẩm, lá dứa dâng tổ tiên cầu may mắn." },
            { name: "Gà ta luộc xé phay", reason: "Lễ vật mộc mạc dâng cúng tổ tiên cầu chúc gia đạo bình an hanh thông." }
          ]
        }
      },
      {
        date: "30/4",
        label: "Ngày Giải phóng miền Nam",
        description: "Kỷ niệm ngày đất nước thống nhất",
        image: GiaiPhong,
        details: {
          history: "Ngày 30/4/1975 là mốc son chói lọi giải phóng hoàn toàn miền Nam, thống nhất đất nước. Đây là dịp kỷ niệm hào hùng của dân tộc và tại Sài Gòn, đây là thời khắc vô cùng ý nghĩa để tham quan các di tích lịch sử chiến thắng.",
          activities: [
            "Viếng Dinh Độc Lập để ngắm hiện vật lịch sử chiến thắng ngày 30/4/1975.",
            "Treo cờ Tổ quốc đỏ rực khắp các nẻo đường, ban công ngõ phố.",
            "Xem chương trình bắn pháo hoa tầm cao nghệ thuật bên sông Sài Gòn."
          ],
          destinations: [
            { name: "Dinh Độc Lập (TP.HCM)", reason: "Nơi chứng kiến thời khắc lịch sử xe tăng húc đổ cổng Dinh thống nhất đất nước non sông một dải." },
            { name: "Địa đạo Củ Chi (TP.HCM)", reason: "Khám phá mạng lưới hầm ngầm quân sự kỳ vĩ dưới lòng đất, ghi dấu ý chí kháng chiến kiên cường." },
            { name: "Bảo tàng Chứng tích Chiến tranh (TP.HCM)", reason: "Trưng bày những tài liệu, hiện vật lịch sử chiến tranh hào hùng ngay trung tâm Sài Gòn." }
          ],
          foods: [
            { name: "Cơm tấm sườn bì chả Sài Gòn", reason: "Món ăn đặc trưng mang đậm phong vị ẩm thực đường phố của đô thị Nam Bộ tự hào." },
            { name: "Lẩu thả hải sản Vũng Tàu", reason: "Nồi lẩu nóng hổi tôm cua tươi ngon gắn kết gia đình trong ngày nghỉ lễ thống nhất." }
          ]
        }
      },
      {
        date: "1/5",
        label: "Ngày Quốc tế Lao động",
        description: "Ngày dành cho người lao động",
        image: QTLaoDong,
        details: {
          history: "Ngày Quốc tế Lao động là ngày biểu dương tinh thần đoàn kết của người lao động toàn cầu. Tại Việt Nam, ngày này nối tiếp ngày 30/4 tạo nên kỳ nghỉ lễ vàng đầu hè lý tưởng để người dân quanh Sài Gòn đi tránh nóng.",
          activities: [
            "Vui chơi tại các hồ bơi, biển nhân tạo giải nhiệt ngày hè nóng nực.",
            "Thưởng thức các món lẩu cá, hải sản chua cay bên bờ biển lộng gió.",
            "Cắm trại dã ngoại khám phá thiên nhiên hoang dã tại rừng quốc gia."
          ],
          destinations: [
            { name: "Khu du lịch Đại Nam (Bình Dương)", reason: "Tổ hợp giải trí quy mô lớn bậc nhất với đền thờ dát vàng, vườn thú mở và biển nhân tạo mát lạnh." },
            { name: "Mũi Nghinh Phong (Vũng Tàu)", reason: "Điểm lộng gió đón sóng biển từ trên cao tuyệt đẹp, thích hợp chụp ảnh check-in dạo biển cùng bạn bè." },
            { name: "Rừng ngập mặn Cần Giờ (TP.HCM)", reason: "Điểm dã ngoại trong lành rợp bóng mát cây xanh, thích hợp khám phá thiên nhiên rừng sác sát cạnh Sài Gòn." }
          ],
          foods: [
            { name: "Lẩu cá đuối Vũng Tàu", reason: "Thưởng thức lẩu cá đuối chua cay măng chua ăn kèm rau mầm giòn ngọt bên bờ biển mát gió." },
            { name: "Bánh tráng phơi sương cuốn bắp bò", reason: "Thịt bắp bò mềm cuốn bánh tráng phơi sương, rau rừng mắm nêm đậm đà cực đưa miệng." }
          ]
        }
      },
      {
        date: "2/9",
        label: "Ngày Quốc khánh",
        description: "Kỷ niệm ngày thành lập nước Việt Nam",
        image: QuocKhanh,
        details: {
          history: "Ngày 2/9/1945 khai sinh ra nước Việt Nam độc lập. Đối với người dân Sài Gòn, đây là dịp tự hào hướng về Bác Hồ tại địa danh lịch sử cảng Nhà Rồng và tận hưởng không khí cờ hoa rực rỡ phố phường.",
          activities: [
            "Dâng hương kính nhớ Bác Hồ tại di tích lịch sử Bến Nhà Rồng.",
            "Đi thuyền dạo chơi ngắm cảnh phố phường rợp cờ hoa mừng ngày Quốc khánh.",
            "Thư thả ngắm bình minh biển Vũng Tàu thanh bình trong ngày nghỉ lễ."
          ],
          destinations: [
            { name: "Bến Nhà Rồng (TP.HCM)", reason: "Nơi Bác Hồ ra đi tìm đường cứu nước, di tích lịch sử thiêng liêng giàu ý nghĩa nằm ven sông Sài Gòn." },
            { name: "Kênh Nhiêu Lộc (TP.HCM)", reason: "Trải nghiệm đi thuyền ngắm phố phường Sài Gòn đổi mới lung linh cờ hoa mừng ngày Quốc khánh." },
            { name: "Bãi Trước (Vũng Tàu)", reason: "Ngắm hoàng hôn biển lộng gió ngày lễ Quốc khánh thanh bình thư thái đầu thu." }
          ],
          foods: [
            { name: "Bánh mì Huỳnh Hoa Sài Gòn", reason: "Ổ bánh mì kẹp ngập nhân thịt nguội patê béo ngậy nức tiếng ẩm thực Sài thành ngày lễ." },
            { name: "Bánh canh cua nước sệt Sài Gòn", reason: "Bát bánh canh cua gạch cua ngọt lịm xua tan mệt mỏi sau ngày vui chơi lễ." }
          ]
        }
      }
    ]
  },

  {
    title: "Lễ Tết & lễ hội truyền thống",
    items: [
      {
        date: "Rằm tháng Giêng",
        label: "Tết Nguyên Tiêu",
        description: "Lễ rằm đầu tiên của năm mới âm lịch",
        image: TetNguyenTieu,
        details: {
          history: "Tết Nguyên Tiêu hay Rằm tháng Giêng là ngày lễ lớn cầu an đầu năm mới. Lễ hội này tại Sài Gòn cực kỳ sôi động, mang đậm màu sắc văn hóa đặc trưng người Hoa vùng Chợ Lớn với các lễ diễu hành đường phố rực rỡ.",
          activities: [
            "Đi chùa thắp hương cầu an lành đầu năm mới cho gia đình.",
            "Xem diễu hành nghệ thuật đường phố và múa lân sư rồng nhộn nhịp phố Hoa Quận 5.",
            "Hành hương cầu tài lộc tại chùa Bà Thiên Hậu nổi tiếng linh thiêng."
          ],
          destinations: [
            { name: "Khu vực Chợ Lớn - Quận 5 (TP.HCM)", reason: "Trung tâm lễ hội Nguyên Tiêu lớn nhất Nam Bộ với các nghi thức diễu hành hóa trang múa lân sư rồng sôi động." },
            { name: "Chùa Bà Thiên Hậu Bình Dương", reason: "Điểm hành hương cầu tài lộc, bình an đầu năm nổi tiếng thu hút hàng vạn khách thập phương." }
          ],
          foods: [
            { name: "Sui cảo chiên/nước Hà Tôn Quyền", reason: "Viên sủi cảo nhân tôm mực ngọt lịm giòn dai đặc trưng ẩm thực Trung Hoa Chợ Lớn ngày rằm." },
            { name: "Chè trôi nước cốt dừa dẻo ngọt", reason: "Viên bánh trôi nhân đậu xanh rưới nước cốt dừa béo ngậy mè rang tượng trưng cho sự trôi chảy viên mãn đầu xuân." }
          ]
        }
      },
      {
        date: "3/3 âm lịch",
        label: "Tết Hàn Thực",
        description: "Ngày làm bánh trôi bánh chay tưởng nhớ tổ tiên",
        image: TetHanThuc,
        details: {
          history: "Tết Hàn Thực tại miền Nam mang không khí sum họp gia đình ấm áp. Người dân quanh Sài Gòn làm chè trôi nước ngọt mát nước cốt dừa để cúng gia tiên, gửi gắm ước nguyện gia đình luôn gắn kết hòa thuận ngọt ngào.",
          activities: [
            "Tự tay làm chè trôi nước cùng con cháu trong gia đình ngày rằm.",
            "Dâng bát chè trôi nước ngọt thơm lên ban thờ cúng tổ tiên.",
            "Thưởng thức chè trôi nước béo ngậy cốt dừa mát ngọt ấm lòng."
          ],
          destinations: [
            { name: "Khu du lịch Bình Quới (TP.HCM)", reason: "Không gian tái hiện trọn vẹn làng quê Nam Bộ cỏ xanh rặng dừa thanh bình thích hợp họp mặt làm bánh sum họp." }
          ],
          foods: [
            { name: "Chè trôi nước cốt dừa gừng ấm", reason: "Viên bánh dẻo mịn nhân đậu xanh bùi béo chan nước gừng ấm rưới nước cốt dừa đặc sánh béo thơm." },
            { name: "Bánh ít trần nhân mặn tôm thịt", reason: "Bánh nếp dai dẻo nhân mặn mồi tôm thịt đậm đà, ăn kèm mỡ hành và nước mắm ớt." }
          ]
        }
      },
      {
        date: "5/5 âm lịch",
        label: "Tết Đoan Ngọ",
        description: "Tết diệt sâu bọ theo phong tục dân gian Việt Nam",
        image: TetDoanNgo,
        details: {
          history: "Tết Đoan Ngọ (5/5 âm lịch) là ngày diệt sâu bọ xua tan bệnh tật. Tại vùng Đông Nam Bộ, đây là dịp thu hoạch trái cây ngọt lành tại các nhà vườn dọc sông Đồng Nai và sông Sài Gòn, thời điểm thích hợp để dạo chơi vườn quả.",
          activities: [
            "Ăn cơm rượu nếp viên tròn và mận, vải chua để diệt sâu bọ sáng sơ.",
            "Dạo vườn hái trái cây chôm chôm măng cụt chín ngọt tại nhà vườn lân cận.",
            "Làm mâm ngũ quả tươi cúng gia tiên tạ ơn đất trời ban mùa quả chín."
          ],
          destinations: [
            { name: "Vườn trái cây Lái Thiêu (Bình Dương)", reason: "Thủ phủ măng cụt, chôm chôm chín đỏ trĩu quả sát cạnh Sài Gòn cực kỳ đông đúc ngày Tết Đoan Ngọ." },
            { name: "Vườn trái cây Trung An - Củ Chi (TP.HCM)", reason: "Vùng cây trái sum suê ven sông Sài Gòn lý tưởng để dạo vườn hái chôm chôm ngọt lịm dịp tết Đoan Ngọ." }
          ],
          foods: [
            { name: "Cơm rượu nếp viên tròn ngọt nồng", reason: "Viên nếp nương lên men ngọt lịm cay ấm lòng giúp tiêu hóa tốt diệt sâu bọ theo dân gian." },
            { name: "Bánh ú tro đậu xanh nhân ngọt", reason: "Chiếc bánh nếp tro lá tre nhỏ xinh mát lành ăn cùng mật mía ngọt thanh thanh thanh thanh nhiệt." }
          ]
        }
      },
      {
        date: "15/8 âm lịch",
        label: "Tết Trung thu",
        description: "Ngày hội thiếu nhi và đoàn viên",
        image: TrungThu,
        details: {
          history: "Tết Trung Thu tại Sài Gòn và Đông Nam Bộ là ngày hội trăng rằm lung linh sắc màu dành cho thiếu nhi và gia đình sum họp. Phố đèn lồng nhộn nhịp tiếng trống múa lân là nét văn hóa đêm rằm không thể thiếu.",
          activities: [
            "Rước lồng đèn giấy kính thủ công truyền thống rực rỡ ngoài phố.",
            "Xem múa lân sư rồng rộn ràng trống hội đêm rằm tháng 8.",
            "Bày mâm cỗ ngọt trông trăng ngắm ánh trăng tròn đầy bên gia đình."
          ],
          destinations: [
            { name: "Phố đèn lồng Lương Nhữ Học - Quận 5 (TP.HCM)", reason: "Con phố rực rỡ sắc màu đèn lồng giấy kính lung linh cổ truyền nhộn nhịp nhất Đông Nam Bộ dịp rằm tháng 8." },
            { name: "Cầu Ánh Sao - Quận 7 (TP.HCM)", reason: "Quảng trường hồ nước lộng gió ngắm trăng rằm phản chiếu mặt hồ lung linh thơ mộng." }
          ],
          foods: [
            { name: "Bánh trung thu truyền thống Chợ Lớn", reason: "Sự kết hợp ngọt ngào đậu xanh, thập cẩm hay hạt sen trứng muối trân quý gửi gắm lời chúc sum vầy viên mãn." },
            { name: "Bưởi da xanh Bình Dương", reason: "Múi bưởi mọng nước chua ngọt dịu thanh giúp giải ngấy hiệu quả sau khi thưởng thức bánh Trung thu ngọt." }
          ]
        }
      },
      {
        date: "15/7 âm lịch",
        label: "Lễ Vu Lan",
        description: "Ngày lễ báo hiếu trong Phật giáo",
        image: VuLan,
        details: {
          history: "Lễ Vu Lan báo hiếu diễn ra trang trọng vào rằm tháng 7 âm lịch. Đây là dịp để người dân Sài Gòn thể hiện lòng biết ơn đấng sinh thành qua nghi lễ cài bông hồng báo hiếu và những mâm cơm chay thanh đạm.",
          activities: [
            "Cài hoa hồng báo hiếu (hoa đỏ kính mừng cha mẹ còn sống, hoa trắng tưởng nhớ cha mẹ đã mất) tại các chùa lớn.",
            "Ăn chay tích đức, thắp nhang cầu nguyện sức khỏe dồi dào cho cha mẹ.",
            "Làm mâm cơm chay dâng cúng tổ tiên thành kính ngày rằm tháng 7."
          ],
          destinations: [
            { name: "Chùa Vĩnh Nghiêm (TP.HCM)", reason: "Ngôi cổ tự danh tiếng bậc nhất Sài Gòn, nơi tổ chức khóa lễ Vu Lan báo hiếu quy mô, trang nghiêm nhất." },
            { name: "Pháp viện Minh Đăng Quang (TP.HCM)", reason: "Kiến trúc Phật giáo uy uy nghi rộng lớn, thích hợp đi lễ chùa cầu nguyện bình an cho đấng sinh thành." }
          ],
          foods: [
            { name: "Cơm chay hạt sen bách thảo", reason: "Hạt cơm chay dẻo thơm hạt sen bùi ngậy gói lá sen thơm mát cầu sức khỏe cho cha mẹ." },
            { name: "Lẩu nấm chay thanh tịnh", reason: "Món ăn nóng hổi thanh đạm sưởi ấm lòng người ngày rằm tháng Bảy tĩnh tâm hướng thiện." }
          ]
        }
      },
      {
        date: "23 tháng Chạp",
        label: "Ông Công Ông Táo",
        description: "Lễ tiễn Táo quân về trời trước Tết",
        image: OngCongOngTao,
        details: {
          history: "Lễ tiễn Táo quân 23 tháng Chạp báo hiệu Tết Nguyên đán sắp đến. Người dân quanh Sài Gòn cúng ông Công ông Táo với chè trôi nước ngọt ngào dâng các vị thần bếp giữ lửa hạnh phúc gia đình.",
          activities: [
            "Dọn dẹp sạch sẽ bàn thờ gia tiên và lau chùi gian bếp tinh tươm đón Tết.",
            "Làm mâm cỗ ngọt tiễn Táo quân chầu trời báo cáo Ngọc Hoàng.",
            "Mua sắm bao lì xì đỏ chuẩn bị đón mừng năm mới."
          ],
          destinations: [
            { name: "Chợ hoa Tết Bến Bình Đông Quận 8 (TP.HCM)", reason: "Nơi bến sông tấp nập thuyền chở hoa Tết cập bến từ miền Tây chuẩn bị cho lễ tiễn ông Táo và đón xuân." }
          ],
          foods: [
            { name: "Chè trôi nước đường mật thốt nốt", reason: "Món chè dẻo mềm nước đường thốt nốt ngọt thơm tiễn Táo quân báo cáo mọi việc suôn sẻ điềm lành." },
            { name: "Xôi gấc đỏ tươi may mắn", reason: "Món xôi màu đỏ thắm cốt dừa béo ngậy cầu chúc gia đình vạn sự may mắn trong năm mới." }
          ]
        }
      },
      {
        date: "Rằm tháng Giêng",
        label: "Lễ hội Hái Lộc",
        description: "Phong tục cầu may đầu năm mới",
        image: HaiLoc,
        details: {
          history: "Hái lộc xuân đêm giao thừa là phong tục cầu may tốt đẹp đầu năm. Người dân Sài Gòn đi lễ chùa cầu lộc thường xin bao lì xì đỏ chúc phúc treo trên cây lộc chùa để rước vận may may mắn về nhà.",
          activities: [
            "Hành hương đi lễ chùa thắp hương cầu an lành vào thời khắc giao thừa.",
            "Xin bao lì xì đỏ may mắn cát tường treo trên cây cảnh sân chùa.",
            "Chúc Tết và xông đất đầu năm mang may mắn về cho gia đình."
          ],
          destinations: [
            { name: "Chùa Ngọc Hoàng Quận 1 (TP.HCM)", reason: "Ngôi điện thờ cổ kính linh thiêng nổi tiếng bậc nhất Sài thành, nơi người dân đi cầu lộc cầu con đầu năm đông đúc." }
          ],
          foods: [
            { name: "Mứt dừa sữa béo ngậy", reason: "Mứt dừa dẻo ngọt bùi cùng chén trà sen ấm áp đãi khách tới chúc Tết xông đất đầu năm mới." }
          ]
        }
      },
      {
        date: "Đầu xuân",
        label: "Lễ Cúng Tổ Nghề",
        description: "Tưởng nhớ tổ nghề truyền thống",
        image: CungToNghe,
        details: {
          history: "Lễ Cúng Tổ Nghề đầu năm tôn vinh ông tổ các nghề thủ công truyền thống vang danh Đông Nam Bộ như sơn mài, làm gốm... thể hiện đạo lý uống nước nhớ nguồn, tôn vinh nghệ thuật làng nghề truyền thống.",
          activities: [
            "Hội họp phường hội dâng lễ tế tổ nghề trang trọng cầu may mắn nghề nghiệp.",
            "Trình diễn công đoạn làm nghề tinh xảo của nghệ nhân Biên Hòa, Bình Dương.",
            "Giao lưu nghệ thuật ca tài tử họp mặt làng nghề truyền thống."
          ],
          destinations: [
            { name: "Làng sơn mài Tương Bình Hiệp (Bình Dương)", reason: "Cái nôi nghề sơn mài trứ danh Nam Bộ, dịp giỗ tổ nghề diễn ra hội làng tưng bừng lễ rước tổ kiệu uy nghiêm." },
            { name: "Làng gốm Lái Thiêu (Bình Dương)", reason: "Làng nghề gốm lâu đời tại Thuận An với các lò nung thủ công và sản phẩm vẽ họa tiết truyền thống độc đáo." }
          ],
          foods: [
            { name: "Heo quay cúng tổ nghề giòn bì", reason: "Lễ vật dâng cúng tổ nghề tôn kính cầu chúc công việc làm ăn phát tài phát lộc cả năm." },
            { name: "Xôi vò nước cốt dừa dẻo thơm", reason: "Sự hòa quyện dẻo thơm béo ngậy thể hiện tình đồng lòng của phường hội sản xuất." }
          ]
        }
      },
      {
        date: "16/8 âm lịch",
        label: "Lễ hội Nghinh Ông",
        description: "Lễ cúng cá Ông cầu mưa thuận gió hòa của ngư dân",
        image: NghinhOng,
        details: {
          history: "Lễ hội Nghinh Ông là lễ hội nước lớn nhất của ngư dân miền Nam nhằm tôn vinh thần Nam Hải (cá Ông), cầu cho mưa thuận gió hòa, sóng yên biển lặng và đánh bắt xa khơi an lành, trúng đậm luồng cá lớn.",
          activities: [
            "Hòa mình vào đoàn rước kiệu cá Ông uy nghi trên biển với hàng trăm tàu thuyền giăng đèn kết hoa.",
            "Làm lễ dâng hương, cúng bái trang trọng tại lăng Ông thờ xương cá voi.",
            "Tham gia trò chơi dân gian đi cà kheo, đua thuyền thúng sôi động trên cát."
          ],
          destinations: [
            { name: "Lăng Ông Thủy Tướng Cần Giờ (TP.HCM)", reason: "Nơi diễn ra lễ hội Nghinh Ông Cần Giờ vô cùng long trọng, đã được vinh danh là Di sản văn hóa phi vật thể quốc gia." },
            { name: "Đình thần Thắng Tam (Vũng Tàu)", reason: "Điểm thờ cúng bộ xương cá Ông khổng lồ và tổ chức lễ hội Nghinh Ông Vũng Tàu thu hút đông đảo ngư dân cúng bái." }
          ],
          foods: [
            { name: "Lẩu đầu cá bớp măng chua Vũng Tàu", reason: "Nồi lẩu nóng sốt cá bớp béo ngọt kết hợp măng chua cay xè mang hương vị đại dương đậm đà ngày hội." },
            { name: "Khô cá dứa một nắng Cần Giờ chiên", reason: "Món đặc sản khô cá dứa một nắng chiên giòn ăn cùng cơm cháy mỡ hành nóng giòn rụm cực hợp vị." }
          ]
        }
      },
      {
        date: "Đầu xuân / mùa Thu",
        label: "Lễ hội Kỳ Yên đình Nam Bộ",
        description: "Lễ cúng tế cầu an lành tại các đình làng",
        image: LeDinhKyYen,
        details: {
          history: "Lễ hội Kỳ Yên là lễ cúng tế Thành hoàng bổn cảnh của người dân Đông Nam Bộ, mang ý nghĩa tri ân công đức tiền nhân khai hoang lập ấp và cầu mong mưa thuận gió hòa, quốc thái dân an cho xóm làng.",
          activities: [
            "Xem các nghi thức dâng lễ tế hương trang nghiêm của ban quý tế đình thần.",
            "Thưởng thức các vở hát chầu tuồng (hát bội) đặc sắc cầu chúc thịnh vượng ngay tại sân đình.",
            "Hòa mình vào tiếng trống chiêng rộn rã của đoàn múa lân sư rồng cầu may."
          ],
          destinations: [
            { name: "Đình thần Phú Long - Lái Thiêu (Bình Dương)", reason: "Ngôi đình cổ kính linh thiêng, một trong những trung tâm tổ chức lễ Kỳ Yên quy mô lớn thu hút đông đảo người dân Bình Dương." },
            { name: "Đình Thông Tây Hội (TP.HCM)", reason: "Ngôi đình cổ xưa nhất vùng đất Gia Định nằm tại Gò Vấp, nơi diễn ra lễ tế Kỳ Yên trang trọng truyền thống." },
            { name: "Đình Bình Đông (Quận 8, TP.HCM)", reason: "Ngôi đình độc đáo nằm biệt lập trên cồn sông, điểm hành hương cúng bái thanh bình dịp lễ Kỳ Yên." }
          ],
          foods: [
            { name: "Thịt heo quay cúng đình kèm bánh hỏi", reason: "Món dâng cúng đình thần giòn bì thơm lừng chia lộc cho bà con, ăn kèm bánh hỏi mỡ hành nước mắm tỏi ớt." },
            { name: "Xôi vị nước cốt dừa", reason: "Món xôi ngọt dẻo thơm phức hương vị đại hồi, ngậy nước cốt dừa đặc trưng của ngày lễ cúng Nam Bộ." }
          ]
        }
      }
    ]
  },

  {
    title: "Ngày kỷ niệm văn hóa - xã hội",
    items: [
      {
        date: "14/2",
        label: "Ngày Lễ tình nhân",
        description: "Ngày dành cho tình yêu và đôi lứa",
        image: Valungtung,
        details: {
          history: "Ngày Valentine 14/2 tôn vinh tình yêu lứa đôi nồng cháy. Tại Sài Gòn, đây là dịp lãng mạn nhất để các cặp đôi dạo bước ngắm phố phường lên đèn lung linh lấp lánh và hẹn hò lãng mạn bên sông.",
          activities: [
            "Tặng hộp chocolate viết lời yêu thương ngọt ngào và bó hoa hồng đỏ cho nửa kia.",
            "Hẹn hò lãng mạn dạo bộ ngắm phun nước cầu vồng trên cầu Ánh Sao.",
            "Chụp hình đôi lưu giữ kỷ niệm tình yêu lãng mạn bên sông Sài Gòn."
          ],
          destinations: [
            { name: "Cầu Ánh Sao Quận 7 (TP.HCM)", reason: "Cầu đi bộ phun nước led cầu vồng rực rỡ lãng mạn dành riêng cho đôi lứa hẹn hò đêm Valentine." },
            { name: "Bờ kè Thủ Thiêm (TP.HCM)", reason: "Không gian ven sông thoáng đãng ngắm hoàng hôn lãng mạn view Landmark 81 lung linh về đêm." }
          ],
          foods: [
            { name: "Chocolate tươi truffle ngọt ngào", reason: "Món kẹo chocolate béo mịn đắng ngọt hòa quyện hoàn hảo đại diện tình cảm lứa đôi." },
            { name: "Steak bò nướng đá nóng", reason: "Bữa tối phương Tây sang trọng dưới ánh nến ấm cúng cho ngày Valentine thêm phần thăng hoa." }
          ]
        }
      },
      {
        date: "8/3",
        label: "Ngày Quốc tế Phụ nữ",
        description: "Tôn vinh phụ nữ trên toàn thế giới",
        image: QTPhuNu,
        details: {
          history: "Ngày Quốc tế Phụ nữ 8/3 tôn vinh những hiến dâng của phái đẹp. Đây là dịp để gia đình quanh Sài Gòn tổ chức những chuyến dã ngoại biển mát mẻ tặng riêng cho bà và mẹ.",
          activities: [
            "Gửi quà tặng thời trang, mỹ phẩm và hoa tươi chúc mừng bà, mẹ, vợ.",
            "Tổ chức liên hoan ngọt văn nghệ chào mừng phái đẹp tại công sở.",
            "Dành trọn ngày nghỉ ngơi thư giãn thưởng thức hải sản biển mát mẻ cùng gia đình."
          ],
          destinations: [
            { name: "Hồ Tràm (Bà Rịa - Vũng Tàu)", reason: "Bãi biển dài hoang sơ thanh bình yên ả, điểm nghỉ dưỡng thích hợp nhất tặng riêng phái đẹp thư giãn tâm hồn." }
          ],
          foods: [
            { name: "Bánh kem sữa chua việt quất", reason: "Món bánh mousse chua ngọt thanh nhẹ ít ngọt tốt cho sức khỏe của mẹ và vợ." },
            { name: "Lẩu cua đồng tôm càng Sài Gòn", reason: "Bữa tiệc lẩu hải sản cua đồng bắp bò tươi ngon ngọt nước chiêu đãi phái đẹp ngày 8/3." }
          ]
        }
      },
      {
        date: "1/6",
        label: "Ngày Quốc tế Thiếu nhi",
        description: "Ngày dành cho trẻ em",
        image: QTThieuNhi,
        details: {
          history: "Ngày Quốc tế Thiếu nhi 1/6 là ngày Tết của trẻ thơ. Tại Sài Gòn, đây là dịp đầu hè thích hợp nhất để đưa các bé đi chơi sở thú rợp bóng mát cây xanh hoặc công viên nước mát lạnh.",
          activities: [
            "Tặng sách truyện bổ ích, đồ chơi sáng tạo cho các em bé yêu.",
            "Đưa trẻ nhỏ đi vui chơi khám phá vườn bách thú, trượt nước mát lạnh.",
            "Tổ chức tiệc ngọt liên hoan văn nghệ thiếu nhi tại khu dân cư."
          ],
          destinations: [
            { name: "Thảo Cầm Viên Quận 1 (TP.HCM)", reason: "Vườn thú xanh mát cổ kính giữa lòng thành phố, địa điểm vui chơi học tập thiên nhiên yêu thích nhất của trẻ nhỏ Sài Gòn." },
            { name: "Công viên nước Đầm Sen (TP.HCM)", reason: "Thiên đường vui chơi giải nhiệt nước mát lạnh cực đã cùng các trò trượt nước thú vị cho bé ngày hè." }
          ],
          foods: [
            { name: "Kem bơ sầu riêng ngậy béo", reason: "Cốc kem bơ xay đặc béo mịn cùng sầu riêng thơm lừng mát lạnh giải nhiệt mùa hè cho trẻ nhỏ." },
            { name: "Pizza xúc xích phô mai giòn", reason: "Món bánh phô mai béo thơm giòn rụm được trẻ nhỏ vô cùng yêu thích trong tiệc liên hoan 1/6." }
          ]
        }
      },
      {
        date: "20/10",
        label: "Ngày Phụ nữ Việt Nam",
        description: "Tôn vinh phụ nữ Việt Nam",
        image: PhuNuVN,
        details: {
          history: "Ngày 20/10 tôn vinh vẻ đẹp, sự kiên cường và giỏi giang của phụ nữ Việt Nam. Đây là dịp ý nghĩa để con cháu bày tỏ lòng hiếu kính dâng tặng bà và mẹ qua những mâm lẩu gà ấm áp ngày mưa cuối năm.",
          activities: [
            "Gửi những lời chúc mừng và cử chỉ yêu thương chân thành tới phụ nữ thân yêu.",
            "Tổ chức tiệc dã ngoại gần gũi thiên nhiên rừng ngập mặn cuối tuần.",
            "Mua sắm mỹ phẩm hoặc tự tay nấu bữa tối ấm áp cho gia đình."
          ],
          destinations: [
            { name: "Khu du lịch sinh thái Cần Giờ (TP.HCM)", reason: "Khám phá rừng ngập mặn mát mẻ gần Sài Gòn cuối tuần, hít thở gió biển trong lành thư giãn cùng mẹ và gia đình." }
          ],
          foods: [
            { name: "Lẩu gà lá é ấm nồng", reason: "Nồi lẩu gà nóng hổi cay nhẹ lá é ấm áp lòng người ngày mưa mát Nam Bộ thích hợp sum họp gia đình." }
          ]
        }
      },
      {
        date: "20/11",
        label: "Ngày Nhà giáo Việt Nam",
        description: "Ngày tri ân thầy cô giáo",
        image: NhaGiao,
        details: {
          history: "Ngày Nhà giáo Việt Nam 20/11 tôn vinh sự nghiệp trồng người cao cả. Đây là dịp tốt để các thế hệ học sinh tụ họp thăm lại trường xưa, tri ân thầy cô giáo cũ theo đạo lý hiếu nghĩa.",
          activities: [
            "Tụ họp tập thể học sinh cũ về trường xưa thăm thầy cô giáo cũ kính yêu.",
            "Tặng bó hoa tươi thắm cùng những tấm thiệp tự viết lời tri ân gửi tặng người đưa đò.",
            "Hàn huyên tâm sự chuyện lớp cũ cùng thầy cô cũ bên ly trà ấm ngọt bánh dân dã."
          ],
          destinations: [
            { name: "Nhà truyền thống học sinh sinh viên (TP.HCM)", reason: "Điểm tìm hiểu lịch sử đấu tranh của học sinh Sài Gòn kiên cường oai hùng trong những năm tháng kháng chiến cũ." }
          ],
          foods: [
            { name: "Bánh da lợn lá dứa & Trà lài nóng", reason: "Sự kết hợp ngọt bùi mộc mạc bánh da lợn dai dai hương lá dứa nước cốt dừa và chén trà hoa lài nóng ấm trò chuyện tri ân thầy cô." }
          ]
        }
      },
      {
        date: "25/12",
        label: "Lễ Giáng sinh",
        description: "Ngày lễ kỷ niệm ngày sinh của Chúa Giêsu",
        image: GiangSinh,
        details: {
          history: "Giáng sinh (Noel) tuy là ngày lễ Công giáo nhưng từ lâu đã trở thành ngày hội văn hóa quen thuộc của người dân Việt Nam, đặc biệt là giới trẻ Sài Gòn, báo hiệu một mùa đông ấm áp và năm mới cận kề.",
          activities: [
            "Dạo phố ngắm nhìn các mô hình hang đá và cây thông Noel lung linh tại các giáo xứ.",
            "Check-in chụp hình cây thông khổng lồ trang hoàng lộng lẫy tại trung tâm quận 1.",
            "Gửi thiệp chúc mừng, quà tặng ấm áp tri ân bạn bè và người thương."
          ],
          destinations: [
            { name: "Xóm đạo Phạm Thế Hiển - Quận 8 (TP.HCM)", reason: "Con đường rực rỡ hàng trăm hang đá trang trí Noel lộng lẫy kéo dài hàng cây số, nhộn nhịp nhất Sài Gòn đêm Giáng sinh." },
            { name: "Nhà thờ Đức Bà & Quận 1 (TP.HCM)", reason: "Nơi tụ hội không khí Noel rạng rỡ với hàng vạn ánh đèn led trang hoàng lộng lẫy quanh các trung tâm thương mại lớn." },
            { name: "Xóm đạo Tân Phú (TP.HCM)", reason: "Trung tâm văn hóa công giáo sầm uất rực rỡ hàng trăm ngọn đèn Noel trang trí lộng lẫy đêm Giáng sinh." }
          ],
          foods: [
            { name: "Gà quay mật ong da giòn", reason: "Món ăn tiệc nướng nóng hổi thích hợp sum họp gia đình nhỏ đêm Giáng sinh ấm áp ngày đông." },
            { name: "Bánh khúc cây chocolate ngọt ngào", reason: "Bánh bông lan khúc cây vị chocolate béo ngậy ngọt ngào truyền thống cho bữa tiệc Noel ấm cúng." }
          ]
        }
      },
      {
        date: "27/7",
        label: "Ngày Thương binh Liệt sĩ",
        description: "Ngày tưởng niệm và tri ân các anh hùng có công với đất nước",
        image: ThuongBinhLS,
        details: {
          history: "Ngày 27/7 là ngày lễ trọng đại thể hiện đạo lý 'Uống nước nhớ nguồn', tri ân sâu sắc xương máu của các anh hùng thương binh liệt sĩ đã ngã xuống bảo vệ nền độc lập tự do thiêng liêng của Tổ quốc.",
          activities: [
            "Dâng hương hoa tưởng niệm trang nghiêm tại nghĩa trang liệt sĩ địa phương.",
            "Thắp nến tri ân tưởng nhớ các anh hùng liệt sĩ vào tối ngày 27/7.",
            "Tham gia hoạt động thăm hỏi phụng dưỡng Mẹ Việt Nam Anh hùng và thương bệnh binh nặng."
          ],
          destinations: [
            { name: "Nghĩa trang Liệt sĩ TP.HCM (Quận 9, TP.HCM)", reason: "Nơi an nghỉ uy nghiêm lớn nhất Đông Nam Bộ, địa điểm diễn ra lễ viếng dâng hương thắp nến vô cùng trang nghiêm." },
            { name: "Đền Tưởng niệm Liệt sĩ Bến Dược (Củ Chi, TP.HCM)", reason: "Ngôi đền tưởng niệm khắc tên hơn 4 vạn anh hùng liệt sĩ đã ngã xuống trên vùng đất thép oai hùng." }
          ],
          foods: [
            { name: "Hồng trà hoa cúc thanh đạm", reason: "Tách trà thanh đạm thể hiện tấm lòng tĩnh lặng thành kính hướng về lịch sử dân tộc oai hùng." },
            { name: "Bánh ít lá gai nhân dừa bánh ngọt", reason: "Món bánh mộc mạc làm lễ vật thành kính cúng tưởng niệm hương thơm nếp cẩm dừa bùi." }
          ]
        }
      },
      {
        date: "22/12",
        label: "Ngày thành lập QĐND VN",
        description: "Kỷ niệm ngày thành lập Quân đội Nhân dân Việt Nam",
        image: QuanDoiND,
        details: {
          history: "Ngày 22/12/1944 ghi dấu sự ra đời của Quân đội Nhân dân Việt Nam vẻ vang. Đây là dịp tôn vinh truyền thống anh dũng oai hùng của người lính Bộ đội Cụ Hồ và ngày hội Quốc phòng toàn dân vững mạnh.",
          activities: [
            "Tham quan các bảo tàng di tích chiến đấu tìm hiểu về lịch sử vũ khí quân sự.",
            "Tham dự các chương trình giao lưu kể chuyện lịch sử, ca hát ca khúc cách mạng.",
            "Treo cờ tổ quốc tri ân những người lính cụ Hồ bảo vệ non sông đất nước."
          ],
          destinations: [
            { name: "Bảo tàng Chiến dịch Hồ Chí Minh (TP.HCM)", reason: "Nơi lưu trữ và trưng bày hàng nghìn tư liệu hiện vật vũ khí lịch sử vẻ vang trong công cuộc giải phóng dân tộc." },
            { name: "Chiến khu Rừng Sác Cần Giờ (TP.HCM)", reason: "Căn cứ lịch sử anh dũng ngập trong rừng đước xanh rì, ghi dấu tinh thần chiến đấu kiên cường của bộ đội đặc công thủy." }
          ],
          foods: [
            { name: "Cơm nắm muối mè dã chiến", reason: "Món ăn dã chiến mộc mạc gắn liền với những năm tháng hành quân oai hùng vượt Trường Sơn cứu nước của người lính cũ." },
            { name: "Trà xanh đọt Thái Nguyên", reason: "Chén trà xanh đậm đà ấm nồng tình quân dân son sắt keo sơn." }
          ]
        }
      }
    ]
  }
];