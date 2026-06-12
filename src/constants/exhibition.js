import phoCoHoiAn from "@/assets/img/exhibition/phocohoian.jpg";
import tetVietNam from "@/assets/img/exhibition/tetvietnam.jpg";
import mienTaySongNuoc from "@/assets/img/exhibition/mientaysongnuoc.jpg";
import tranhDongHo from "@/assets/img/exhibition/tranhdongho.webp";
import phoHaNoi from "@/assets/img/cuisine/PhoHN.jpg";
import muaLan from "@/assets/img/cuisine/MuaLan.jpg";
import nghinhOng from "@/assets/img/holiday/nghinh ông.jpg";
import banhMi from "@/assets/img/exhibition/bánh mì.jpg";
import comTam from "@/assets/img/cuisine/ComTam.jpg";
import bunBoHue from "@/assets/img/cuisine/BunBoHue.jpg";
import banhXeo from "@/assets/img/cuisine/BanhXeo.jpg";
import cafeSuaDa from "@/assets/img/exhibition/ca phe phin.jpg";
import trungThu from "@/assets/img/exhibition/dem-trung-thu.jpg";
import dinhDocLap from "@/assets/img/exhibition/Dinh doc lap.jpg";
import benNhaRong from "@/assets/img/exhibition/ben-nha-rong.jpg";

/** @typedef {"all" | "place" | "food" | "festival"} ExhibitionCategory */

/** @type {{ key: ExhibitionCategory | "all"; label: string }[]} */
export const EXHIBITION_FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "place", label: "Địa điểm" },
  { key: "food", label: "Ẩm thực" },
  { key: "festival", label: "Lễ hội" },
];

/** @type {{ key: "newest" | "likes"; label: string }[]} */
export const EXHIBITION_SORT_OPTIONS = [
  { key: "newest", label: "Mới nhất" },
  { key: "likes", label: "Nhiều tim nhất" },
];

/**
 * @typedef {Object} ExhibitionItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} imageUrl
 * @property {string} author
 * @property {ExhibitionCategory} category
 * @property {string} [styleTag]
 * @property {string} [placeName]
 * @property {string} province
 * @property {number} likes
 * @property {string} createdAt ISO date
 * @property {"upload"} source
 * @property {Array<{ id: string, title: string, description: string, x: number, y: number }>} [hotspots]
 */

/** @type {ExhibitionItem[]} */
export const EXHIBITION_ITEMS = [
  {
    id: "ex-2",
    title: "Đêm phố cổ Hội An",
    description:
      "Không gian đêm phố cổ Hội An hiện lên như một bức tranh lung linh đầy hoài niệm dưới ánh sáng huyền ảo của hàng ngàn chiếc đèn lồng thủ công đa sắc màu. Dòng sông Hoài thơ mộng chảy êm đềm xuyên qua lòng phố cổ cổ kính, soi bóng những nếp nhà rêu phong mái ngói âm dương có tuổi đời hàng thế kỷ. Đây là biểu tượng của sự giao thoa văn hóa Đông Tây độc đáo từ thời kỳ thương cảng sầm uất thế kỷ 17, mang đến cảm xúc yên bình và trầm mặc sâu sắc cho mọi du khách ghé thăm.",
    imageUrl: phoCoHoiAn,
    author: "Trần Bảo Ngọc",
    category: "place",
    styleTag: "Phố Cổ Hội An",
    placeName: "Phố cổ Hội An",
    province: "Quảng Nam",
    likes: 412,
    createdAt: "2025-05-18",
    source: "upload",
    hotspots: [
      {
        id: "hs-2-1",
        title: "Sông Hoài lung linh",
        description: "Dòng sông Hoài thanh bình là trái tim của phố cổ Hội An. Nơi đây mỗi tối đều thu hút đông đảo du khách tham gia nghi thức thả đèn hoa đăng lung linh cầu nguyện may mắn, hoặc ngồi trên những chiếc thuyền gỗ mộc mạc nghe những câu chuyện kể dân gian thấm đẫm tình đất tình người.",
        x: 28,
        y: 60
      },
      {
        id: "hs-2-2",
        title: "Đèn lồng thủ công",
        description: "Đèn lồng là linh hồn của đêm Hội An, được làm thủ công tinh xảo bởi các nghệ nhân bản địa. Khung đèn làm từ tre già ngâm muối kỹ lưỡng để chống mối mọt, bọc ngoài bằng những tấm vải lụa tơ tằm Hà Đông mềm mại, tạo nên ánh sáng dịu nhẹ ấm áp lan tỏa khắp các ngõ phố nhỏ rêu phong.",
        x: 65,
        y: 40
      }
    ]
  },
  {
    id: "ex-7",
    title: "Sông nước miền Tây",
    description:
      "Bức tranh toàn cảnh vùng sông nước miền Tây Nam Bộ hiện lên mộc mạc với chiếc xuồng ba lá len lỏi giữa những hàng dừa nước xanh mướt. Đây là nét đặc trưng độc đáo của nền văn minh lúa nước và văn hóa miệt vườn trù phú. Cuộc sống của người dân nơi đây gắn liền với hệ thống kênh rạch chằng chịt, tạo nên nét đẹp văn hóa độc bản như chợ nổi Cái Răng náo nhiệt từ tờ mờ sáng với vô vàn sản vật nhiệt đới ngọt lành cùng tình người hiếu khách, chân chất.",
    imageUrl: mienTaySongNuoc,
    author: "Đặng Kim Liên",
    category: "place",
    styleTag: "Miền Tây Sông Nước",
    placeName: "Chợ nổi Cái Răng",
    province: "Cần Thơ",
    likes: 243,
    createdAt: "2025-05-05",
    source: "upload",
    hotspots: [
      {
        id: "hs-7-1",
        title: "Chiếc xuồng ba lá",
        description: "Chiếc xuồng ba lá nhỏ nhắn là phương tiện di chuyển giao thương đường thủy không thể thiếu của người dân miền sông nước. Xuồng được ghép tỉ mỉ từ ba tấm ván gỗ lớn, điều khiển điệu nghệ bằng mái chèo đôi giúp len lỏi qua từng con rạch nhỏ hẹp một cách linh hoạt.",
        x: 32,
        y: 65
      },
      {
        id: "hs-7-2",
        title: "Dừa nước ven sông",
        description: "Cây dừa nước mọc tự nhiên phủ xanh khắp các triền kênh rạch miền Tây. Lá dừa nước được người dân phơi khô kết lại dùng để lợp mái nhà tranh che nắng che mưa vô cùng mát mẻ, trong khi buồng quả dừa nước mang lại phần cơm dừa dẻo ngọt, thanh mát khó quên.",
        x: 72,
        y: 42
      }
    ]
  },
  {
    id: "ex-9",
    title: "Bánh chưng ngày Tết",
    description:
      "Hình ảnh góc bếp ấm cúng ngày giáp Tết với nghi thức gói bánh chưng truyền thống mang đậm bản sắc văn hóa Việt Nam. Bánh chưng hình vuông tượng trưng cho Mặt Đất, thể hiện lòng biết ơn sâu sắc của con cháu đối với Tổ tiên và Trời Đất đã ban cho mùa màng tươi tốt. Mỗi dịp Tết đến xuân về, cả gia đình lại quây quần bên bếp lửa hồng canh nồi bánh chưng sôi sùng sục, chia sẻ những câu chuyện buồn vui của năm cũ và gửi gắm những hy vọng tốt đẹp cho năm mới.",
    imageUrl: tetVietNam,
    author: "Trương Lan Phương",
    category: "food",
    placeName: null,
    province: "Hà Nội",
    likes: 134,
    createdAt: "2025-04-28",
    source: "upload",
    hotspots: [
      {
        id: "hs-9-1",
        title: "Lá dong rừng",
        description: "Lá dong dùng để gói bánh phải được tuyển chọn kỹ lưỡng, là loại lá dong nếp bánh tẻ có bản to, màu xanh mướt và không bị rách. Lá dong sau khi luộc chín giúp bánh chưng có lớp vỏ ngoài mang màu xanh ngọc tự nhiên và mùi thơm dịu mát vô cùng đặc trưng.",
        x: 40,
        y: 46
      },
      {
        id: "hs-9-2",
        title: "Lạt giang buộc bánh",
        description: "Lạt giang được chẻ mỏng dẻo dai từ những gióng tre giang bánh tẻ rừng sâu. Nghệ thuật buộc lạt giang đòi hỏi sự khéo léo để bánh được nén chặt vừa đủ, khi luộc chín hạt nếp nở đều hòa quyện cùng nhân đậu xanh thịt mỡ đậm đà bên trong mà không bị thấm nước.",
        x: 62,
        y: 50
      }
    ]
  },
  {
    id: "ex-13",
    title: "Tranh dân gian Đông Hồ",
    description:
      "Tranh dân gian Đông Hồ là di sản văn hóa phi vật thể quý báu của Việt Nam, xuất xứ từ làng nghề cổ truyền ven sông Đuống, tỉnh Bắc Ninh. Mỗi bức tranh mang một thông điệp nhân sinh quan sâu sắc, cầu chúc cho cuộc sống hòa bình, thịnh vượng và hạnh phúc qua những hình tượng quen thuộc như đàn gà, con lợn âm dương, đám cưới chuột. Tranh Đông Hồ không chỉ là nghệ thuật hội họa mà còn là biểu tượng tinh thần gắn liền với hồn quê Việt Nam trong mỗi dịp Tết cổ truyền.",
    imageUrl: tranhDongHo,
    author: "Nguyễn Mai Phương",
    category: "place",
    styleTag: "Làng Tranh Đông Hồ",
    placeName: "Làng tranh Đông Hồ",
    province: "Bắc Ninh",
    likes: 382,
    createdAt: "2025-05-25",
    source: "upload",
    hotspots: [
      {
        id: "hs-13-1",
        title: "Giấy điệp lấp lánh",
        description: "Giấy điệp là chất liệu làm tranh vô cùng độc đáo. Giấy dó được quét lên một lớp hồ mỏng pha với bột sò điệp giã nát nghiền mịn, tạo nên bề mặt óng ánh ánh xà cừ tự nhiên dưới ánh sáng, đồng thời giúp tranh có độ bền bỉ hàng trăm năm.",
        x: 35,
        y: 44
      },
      {
        id: "hs-13-2",
        title: "Màu sắc tự nhiên",
        description: "Màu sắc của tranh Đông Hồ được tinh chế hoàn toàn từ thiên nhiên: màu đen tuyền lấy từ than lá tre đốt cháy, màu đỏ son nồng ấm từ sỏi đá son đồi núi Bắc Giang, màu vàng rực từ hoa hòe, và màu xanh mát từ lá chàm tươi.",
        x: 68,
        y: 50
      }
    ]
  },
  {
    id: "ex-14",
    title: "Phở bò Hà Nội",
    description:
      "Phở bò Hà Nội được ví như quốc hồn quốc túy của ẩm thực Việt Nam, mang hương vị gia truyền ấm nồng quen thuộc khắp các ngõ phố thủ đô cổ kính. Một bát phở ngon là sự kết hợp hoàn hảo giữa những lát thịt bò thái mỏng mềm ngọt, sợi bánh phở tươi tráng mỏng mềm mại, cùng nước dùng trong veo, thơm nức mùi gừng nướng, quế chi, thảo quả và hành hoa. Hương vị phở là ký ức văn hóa đi cùng năm tháng, kết tinh từ sự tỉ mỉ và tình yêu ẩm thực của con người Hà Nội.",
    imageUrl: phoHaNoi,
    author: "Phạm Minh Trí",
    category: "food",
    placeName: "Hồ Hoàn Kiếm",
    province: "Hà Nội",
    likes: 498,
    createdAt: "2025-05-22",
    source: "upload",
    hotspots: [
      {
        id: "hs-14-1",
        title: "Nước dùng thanh ngọt",
        description: "Nước dùng là linh hồn của bát phở, được ninh hầm kiên nhẫn từ xương ống bò cùng gừng nướng, hành khô nướng cháy vỏ và các vị thảo mộc như quế hồi, thảo quả suốt hơn 12 giờ để chiết xuất vị ngọt thanh tự nhiên mà không dùng mì chính.",
        x: 42,
        y: 48
      },
      {
        id: "hs-14-2",
        title: "Sợi bánh phở tươi",
        description: "Bánh phở được làm từ bột gạo tẻ nguyên chất chất lượng cao, tráng mỏng và cắt sợi đều đặn. Sợi phở phải mềm, dẻo dai tự nhiên, thấm đượm nước dùng nóng hổi mà không bị bở nát khi thưởng thức.",
        x: 60,
        y: 52
      }
    ]
  },
  {
    id: "ex-15",
    title: "Múa Lân khai xuân",
    description:
      "Nghệ thuật múa lân sư rồng là hoạt động văn hóa dân gian sôi động không thể thiếu trong các dịp lễ Tết, lễ khai trương hay tết Trung thu. Điệu múa mang tính biểu tượng mạnh mẽ cho sự may mắn, thịnh vượng, xua đuổi điều dữ và đón nhận điềm lành. Trong tiếng trống chiêng dồn dập vang dội, những nghệ sĩ biểu diễn uyển chuyển nhịp nhàng tạo nên thần thái oai nghiêm nhưng cũng đầy vui nhộn của chú Lân, mang lại niềm vui tươi và phấn khởi cho đông đảo người xem.",
    imageUrl: muaLan,
    author: "Vương Chí Thành",
    category: "festival",
    placeName: "Chùa Bà Thiên Hậu",
    province: "TP. Hồ Chí Minh",
    likes: 356,
    createdAt: "2025-05-20",
    source: "upload",
    hotspots: [
      {
        id: "hs-15-1",
        title: "Thần thái đầu lân",
        description: "Đầu lân được tạo tác vô cùng sặc sỡ và oai vệ bằng khung tre bọc giấy màu và vẽ tay tỉ mỉ. Đôi mắt to tròn, tai và miệng chú lân có thể chớp nhấp nháy linh động để biểu lộ các trạng thái cảm xúc hỷ nộ ái ố sống động.",
        x: 38,
        y: 42
      },
      {
        id: "hs-15-2",
        title: "Nhịp trống rộn rã",
        description: "Tiếng trống lân dồn dập, hào hùng là nhạc trưởng định hình nhịp điệu cho toàn bộ bài múa. Tiếng trống vang rền dẫn dắt chú lân thực hiện những pha nhảy cao, nhào lộn điêu luyện và đầy kịch tính trên các cột cao.",
        x: 62,
        y: 54
      }
    ]
  },
  {
    id: "ex-16",
    title: "Lễ hội Nghinh Ông",
    description:
      "Lễ hội Nghinh Ông là lễ hội nước lớn nhất của ngư dân miền biển Việt Nam, đặc biệt là vùng duyên hải Nam Bộ. Đây là dịp để ngư dân bày tỏ lòng biết ơn sâu sắc đối với cá Ông (cá voi) - vị thần hộ mệnh linh thiêng luôn cứu giúp tàu thuyền vượt qua sóng gió ngoài khơi xa. Lễ hội diễn ra vô cùng long trọng với phần nghi thức rước kiệu trên biển hoành tráng và phần hội trò chơi dân gian rộn ràng, thể hiện khát vọng cầu mong mưa thuận gió hòa, sóng yên biển lặng và những chuyến ra khơi đầy ắp cá tôm.",
    imageUrl: nghinhOng,
    author: "Nguyễn Văn Hùng",
    category: "festival",
    placeName: "Đình thần Thắng Tam",
    province: "Bà Rịa - Vũng Tàu",
    likes: 324,
    createdAt: "2025-05-18",
    source: "upload",
    hotspots: [
      {
        id: "hs-16-1",
        title: "Kiệu rước cá Ông",
        description: "Kiệu rước cá Ông được trang hoàng vô cùng lộng lẫy với cờ hoa rực rỡ, bày biện trang nghiêm các loại lễ vật dâng cúng. Đoàn rước bao gồm các bô lão và thanh niên mặc lễ phục truyền thống đi đầu trong không khí uy nghiêm kính cẩn.",
        x: 32,
        y: 45
      },
      {
        id: "hs-16-2",
        title: "Đoàn thuyền khơi xa",
        description: "Hàng trăm chiếc tàu đánh cá của ngư dân được treo cờ đỏ sao vàng rực rỡ, nối đuôi nhau rẽ sóng ra khơi rước linh vị Ông. Tiếng trống hội, tiếng hò reo vang vọng cả một vùng biển khơi tạo nên khung cảnh tráng lệ, kiêu hùng.",
        x: 68,
        y: 52
      }
    ]
  },
  {
    id: "ex-17",
    title: "Bánh mì kẹp truyền thống",
    description:
      "Bánh mì Việt Nam đã vượt qua biên giới quốc gia để trở thành một trong những món ăn đường phố ngon nhất thế giới. Điểm đặc sắc của bánh mì nằm ở lớp vỏ ngoài vàng ươm giòn rụm, ruột bánh mềm xốp, kết hợp hài hòa với nhân bánh phong phú gồm pate gan béo ngậy, bơ tươi, xá xíu đậm vị, giò lụa, chả quế cùng dưa góp chua ngọt và rau thơm thanh mát. Món ăn là sự kết tinh của nghệ thuật ẩm thực Pháp và sự sáng tạo vô biên của người dân Việt Nam.",
    imageUrl: banhMi,
    author: "Nguyễn Minh Hòa",
    category: "food",
    placeName: "Phố đi bộ Nguyễn Huệ",
    province: "TP. Hồ Chí Minh",
    likes: 512,
    createdAt: "2025-05-26",
    source: "upload",
    hotspots: [
      {
        id: "hs-17-1",
        title: "Pate & bơ béo ngậy",
        description: "Lớp pate gan heo được chưng mịn màng, thơm phức mùi tiêu tỏi, hòa quyện tuyệt hảo cùng bơ trứng gà tươi béo ngậy quét dọc ruột bánh, tạo nên độ ẩm mượt và hương vị béo ngậy đặc trưng không thể trộn lẫn.",
        x: 35,
        y: 50
      },
      {
        id: "hs-17-2",
        title: "Chả lụa & xá xíu",
        description: "Thịt xá xíu rim mật ong thơm ngọt đậm đà kết hợp cùng những lát chả lụa truyền thống dai ngon được xếp đầy đặn trong ruột bánh, mang lại nguồn protein phong phú cho món ăn đường phố hấp dẫn này.",
        x: 65,
        y: 45
      }
    ]
  },
  {
    id: "ex-18",
    title: "Cơm tấm sườn bì chả",
    description:
      "Cơm tấm là món ăn đặc trưng hàng đầu của vùng đất Sài Gòn - Nam Bộ. Điểm độc đáo của món ăn bắt đầu từ hạt cơm tấm nhỏ vụn, thơm dẻo, ăn kèm với sườn heo nướng cháy cạnh thơm phức, bì thính dẻo dai, chả trứng chưng béo ngậy và mỡ hành bóng bẩy. Điểm xuyết lên đó là chén nước mắm chua ngọt pha kẹo sánh đặc trưng. Cơm tấm phản chiếu rõ nét phong cách ẩm thực Nam Bộ: phóng khoáng, đậm đà vị ngọt và đậm tình mến khách.",
    imageUrl: comTam,
    author: "Trần Thế Vinh",
    category: "food",
    placeName: "Chợ Bến Thành",
    province: "TP. Hồ Chí Minh",
    likes: 342,
    createdAt: "2025-05-24",
    source: "upload",
    hotspots: [
      {
        id: "hs-18-1",
        title: "Sườn nướng than hoa",
        description: "Miếng sườn cốt lết heo được tẩm ướp công phu với sả, tỏi, mật ong và chút ngũ vị hương, nướng chín vàng đều trên bếp than hồng đỏ lửa cho đến khi sém cạnh thơm lừng, thịt vẫn mềm ngọt mọng nước bên trong.",
        x: 40,
        y: 52
      },
      {
        id: "hs-18-2",
        title: "Nước mắm chua ngọt",
        description: "Nước mắm cơm tấm được pha chế theo công thức sánh kẹo đặc trưng của người miền Nam, sử dụng nước dừa tươi đun cùng đường thốt nốt, nước mắm ngon và tỏi ớt băm nhuyễn để tạo nên vị mặn ngọt hài hòa nâng tầm món ăn.",
        x: 68,
        y: 46
      }
    ]
  },
  {
    id: "ex-19",
    title: "Bún bò Huế cố đô",
    description:
      "Bún bò Huế là tinh hoa ẩm thực của vùng đất cố đô cổ kính, mang đậm phong vị cung đình tinh tế nhưng cũng vô cùng bình dị. Tô bún bò nổi bật với nước dùng đậm đà hương mắm ruốc đặc trưng, sả thơm nồng và màu đỏ óng ánh của dầu điều sa tế cay xè. Ăn kèm là những sợi bún to tròn, thịt bò bắp mềm ngọt, giò heo hầm béo ngậy, tiết luộc và chả cua thơm bùi. Thưởng thức tô bún bò Huế là trải nghiệm hành trình văn hóa ẩm thực giàu chiều sâu của miền Trung đầy nắng gió.",
    imageUrl: bunBoHue,
    author: "Lê Thị Thảo",
    category: "food",
    placeName: "Đại Nội Huế",
    province: "Thừa Thiên Huế",
    likes: 423,
    createdAt: "2025-05-23",
    source: "upload",
    hotspots: [
      {
        id: "hs-19-1",
        title: "Mắm ruốc cố đô",
        description: "Mắm ruốc Huế là nguyên liệu cốt lõi tạo nên hương vị đặc trưng duy nhất của bún bò. Mắm ruốc phải được hòa loãng gạn lọc lấy nước trong chưng cất kỹ lưỡng, nêm vào nước dùng tạo vị ngọt sâu thẳm và mùi thơm dịu nhẹ tinh tế.",
        x: 35,
        y: 55
      },
      {
        id: "hs-19-2",
        title: "Chả cua & chân giò",
        description: "Chả cua được làm từ thịt cua biển tươi quết nhuyễn cùng thịt nạc vai và mỡ gáy heo, viên tròn luộc chín có màu vàng cam bắt mắt, ăn kèm khoanh chân giò heo hầm chín tới vừa mềm vừa giòn béo ngậy.",
        x: 70,
        y: 44
      }
    ]
  },
  {
    id: "ex-20",
    title: "Bánh xèo giòn rụm",
    description:
      "Bánh xèo là món ăn dân dã truyền thống có sức sống mãnh liệt ở khắp ba miền Việt Nam. Chiếc bánh xèo Nam Bộ nổi bật với kích thước lớn khổng lồ, vỏ bánh đổ mỏng tang, vàng ươm giòn rụm ôm lấy phần nhân phong phú gồm tôm, thịt ba chỉ, giá đỗ và đậu xanh. Khi thưởng thức, bánh xèo được cuốn tròn trong các loại lá rau cải xanh, xà lách kèm các loại rau rừng thanh mát, chấm ngập trong chén nước mắm tỏi ớt chua ngọt đậm vị.",
    imageUrl: banhXeo,
    author: "Đỗ Kim Oanh",
    category: "food",
    placeName: "Chợ nổi Cái Răng",
    province: "Cần Thơ",
    likes: 289,
    createdAt: "2025-05-21",
    source: "upload",
    hotspots: [
      {
        id: "hs-20-1",
        title: "Vỏ bánh vàng giòn",
        description: "Vỏ bánh được đổ khéo léo từ bột gạo tẻ pha chút bột nghệ tạo màu vàng ươm rực rỡ và nước cốt dừa tạo độ béo ngậy. Khi đổ bột vào chảo nóng, tiếng kêu 'xèo' vang lên vui tai tạo nên tên gọi của món bánh dân dã này.",
        x: 30,
        y: 48
      },
      {
        id: "hs-20-2",
        title: "Rau rừng cuộn kèm",
        description: "Sức hấp dẫn của bánh xèo Nam Bộ nằm ở mâm rau ăn kèm phong phú với hàng chục loại rau sông và rau rừng tự nhiên như lá cách, lá lụa, đọt xoài chua, cát lồi giúp trung hòa độ béo của dầu mỡ và bổ sung chất xơ thanh mát.",
        x: 75,
        y: 54
      }
    ]
  },
  {
    id: "ex-21",
    title: "Cà phê sữa đá",
    description:
      "Cà phê sữa đá, hay đặc biệt là văn hóa 'cà phê bệt', từ lâu đã trở thành một biểu tượng, một nét sống đặc trưng và vô cùng năng động của giới trẻ Sài Gòn. Nếu như ở Hà Nội người ta chuộng những quán trà đá vỉa hè cổ kính, thì tại Sài Gòn, tụ tập quanh những góc phố rợp bóng cây xanh cổ thụ như công viên 30/4, khu vực Nhà thờ Đức Bà hay Bưu điện Trung tâm Thành phố lại là một niềm đam mê bất tận. Tại đây, không cần bàn ghế cầu kỳ, người ta dễ dàng bắt gặp hình ảnh các bạn trẻ, những nhóm sinh viên hay dân văn phòng ngồi bệt trên một tờ báo cũ hay miếng bìa các tông, rôm rả trò chuyện, gảy đàn guitar và hát hò bên ly cà phê phin nhôm truyền thống. Từng giọt cà phê đen Robusta mang vị đắng gắt và hương thơm nồng nàn đậm đặc nhỏ giọt thật chậm rãi, sau đó hòa quyện một cách hoàn hảo với lớp sữa đặc ngọt béo và những viên đá lạnh mát rượi. Sự kết hợp tinh tế ấy tạo nên một thức uống vô cùng bình dị mà quyến rũ, không chỉ xua tan đi cái nắng oi ả của phương Nam mà còn kết nối những tâm hồn đồng điệu. Cà phê bệt không đơn thuần chỉ là một thói quen giải khát, mà còn là một không gian văn hóa mở, nơi thể hiện rõ nét nhất sự nhộn nhịp, phóng khoáng, hiếu khách và đầy bao dung của một thành phố mang tên Bác chưa bao giờ ngủ.",
    imageUrl: cafeSuaDa,
    author: "Hoàng Gia Bảo",
    category: "food",
    placeName: "Bưu điện Trung tâm Sài Gòn",
    province: "TP. Hồ Chí Minh",
    likes: 457,
    createdAt: "2025-05-19",
    source: "upload",
    hotspots: [
      {
        id: "hs-21-1",
        title: "Cà phê phin truyền thống",
        description: "Phin nhôm lọc cà phê là hình ảnh văn hóa đặc trưng. Cà phê Robusta xay thô được ép nhẹ trong phin, chế nước sôi và chờ đợi từng giọt cà phê đen nhánh, sánh đặc rơi xuống, thể hiện phong cách sống thong thả, chiêm nghiệm của người Việt.",
        x: 35,
        y: 52
      },
      {
        id: "hs-21-2",
        title: "Sữa đặc béo ngọt",
        description: "Sữa đặc ông thọ ngọt béo được rót sẵn dưới đáy ly thủy tinh. Khi khuấy đều cùng cà phê nóng hổi và đá viên, sữa đặc tạo nên màu nâu cánh gián quyến rũ cùng vị ngọt ngào cân bằng hoàn hảo vị đắng gắt của cà phê Robusta.",
        x: 62,
        y: 45
      }
    ]
  },
  {
    id: "ex-22",
    title: "Đêm hội rước đèn Trung Thu",
    description:
      "Đêm hội rước đèn Trung Thu là nét đẹp văn hóa truyền thống chứa đựng tuổi thơ của biết bao thế hệ người dân Việt Nam vào ngày rằm tháng Tám âm lịch. Dưới ánh trăng rằm sáng vằng vặc, trẻ em rạng rỡ tiếng cười nối đuôi nhau rước những chiếc đèn ông sao, đèn kéo quân rực rỡ sắc màu dọc khắp các ngõ xóm. Tiếng trống múa lân rộn vang rộn rã kết hợp cùng mâm ngũ quả phá cỗ trông trăng tạo nên không khí tưng bừng, gắn kết tình làng nghĩa xóm ấm áp tình thân.",
    imageUrl: trungThu,
    author: "Lý Khánh Vân",
    category: "festival",
    placeName: "Phố cổ Tuyên Quang",
    province: "Tuyên Quang",
    likes: 378,
    createdAt: "2025-05-17",
    source: "upload",
    hotspots: [
      {
        id: "hs-22-1",
        title: "Đèn ông sao khổng lồ",
        description: "Những chiếc đèn ông sao được các nghệ nhân và người dân trong khu phố cùng nhau chung tay chế tác thủ công với kích thước khổng lồ, trang trí đèn led rực rỡ sắc màu để diễu hành thi thố trong đêm hội Trung Thu.",
        x: 28,
        y: 50
      },
      {
        id: "hs-22-2",
        title: "Múa lân đêm rằm",
        description: "Điệu múa lân rộn rã dưới trăng rằm tháng Tám mang ý nghĩa cầu chúc sự may mắn, ấm no cho mọi nhà. Các em nhỏ vô cùng phấn khích đi theo đoàn lân gõ trống vang dội cả một khu phố tạo không khí vui tươi rộn ràng.",
        x: 68,
        y: 42
      }
    ]
  },
  {
    id: "ex-23",
    title: "Dinh Độc Lập - Chứng nhân lịch sử",
    description:
      "Dinh Độc Lập, hay còn được biết đến với tên gọi là Hội trường Thống Nhất, không chỉ là một trong những công trình kiến trúc biểu tượng mang tính nghệ thuật cao, mà còn là chứng nhân lịch sử trọng đại bậc nhất của Thành phố Hồ Chí Minh nói riêng và đất nước Việt Nam nói chung. Được thiết kế vào những năm 1960 bởi kiến trúc sư tài ba Ngô Viết Thụ - người Việt Nam đầu tiên đạt giải thưởng Khôi nguyên La Mã về kiến trúc, tòa nhà là sự kết hợp vô cùng hoàn mỹ và tinh tế giữa triết lý phong thủy Á Đông truyền thống với phong cách kiến trúc hiện đại của phương Tây. Nhìn từ tổng thể, mặt bằng của dinh thự tạo thành hình chữ Cát, mang ý nghĩa cầu chúc sự tốt lành và may mắn. Nơi đây từng là cơ quan đầu não của chính quyền Sài Gòn cũ, là nơi làm việc của các đời Tổng thống Việt Nam Cộng hòa. Đặc biệt, Dinh Độc Lập đã chứng kiến thời khắc vĩ đại và oai hùng nhất trong lịch sử dân tộc vào đúng trưa ngày 30 tháng 4 năm 1975, khi những chiếc xe tăng của quân giải phóng dũng mãnh tiến vào húc đổ cánh cổng chính bằng sắt, người chiến sĩ cách mạng đã chạy bộ lên cắm lá cờ chiến thắng bay phấp phới trên nóc dinh, chính thức kết thúc cuộc chiến tranh đầy gian khổ, đánh dấu sự thống nhất hoàn toàn non sông bờ cõi từ Bắc chí Nam. Ngày nay, công trình kiến trúc bề thế và uy nghi này đã trở thành một bảo tàng lịch sử sống động, mở cửa đón tiếp hàng triệu lượt du khách trong và ngoài nước đến tham quan mỗi năm, để họ có cơ hội dạo bước qua những hành lang tĩnh lặng và tìm về những trang sử hào hùng, bất khuất của dân tộc Việt Nam.",
    imageUrl: dinhDocLap,
    author: "Lê Hoài Nam",
    category: "place",
    styleTag: "Di tích Quốc gia đặc biệt",
    placeName: "Dinh Độc Lập",
    province: "TP. Hồ Chí Minh",
    likes: 456,
    createdAt: "2025-05-30",
    source: "upload",
    hotspots: [
      {
        id: "hs-23-1",
        title: "Cổng chính Dinh Độc Lập",
        description: "Nơi ghi dấu sự kiện lịch sử xe tăng húc đổ cổng chính vào lúc 11h30 ngày 30/4/1975, cắm lá cờ giải phóng trên nóc dinh, chính thức kết thúc chiến tranh thống nhất đất nước.",
        x: 35,
        y: 60
      },
      {
        id: "hs-23-2",
        title: "Kiến trúc tổng thể",
        description: "Công trình được thiết kế mô phỏng theo chữ Hán mang ý nghĩa tốt lành: mặt bằng tạo thành chữ CÁT, trung tâm tạo chữ KHẨU đại diện cho tự do ngôn luận dân chủ.",
        x: 68,
        y: 45
      }
    ]
  },
  {
    id: "ex-24",
    title: "Bến Nhà Rồng - Hành trình tìm đường cứu nước",
    description:
      "Bến Nhà Rồng là một di tích lịch sử đặc biệt thiêng liêng nằm bên bờ sông Sài Gòn lộng gió. Được xây dựng từ giữa thế kỷ 19 theo kiến trúc phương Tây kết hợp đôi rồng chầu trên nóc mái mang đậm nét đặc trưng Á Đông. Đây là nơi chứng kiến sự kiện lịch sử vĩ đại ngày 5 tháng 6 năm 1911, khi người thanh niên yêu nước Nguyễn Tất Thành bước chân xuống con tàu Đô đốc Latouche-Tréville ra đi tìm đường giải phóng dân tộc. Bến Nhà Rồng là biểu tượng của tinh thần yêu nước quả cảm và là cột mốc khởi đầu cho trang sử mới của dân tộc Việt Nam.",
    imageUrl: benNhaRong,
    author: "Nguyễn Minh Tuấn",
    category: "place",
    styleTag: "Di tích Lịch sử cấp Quốc gia",
    placeName: "Bến Nhà Rồng",
    province: "TP. Hồ Chí Minh",
    likes: 488,
    createdAt: "2025-05-29",
    source: "upload",
    hotspots: [
      {
        id: "hs-24-1",
        title: "Kiến trúc đôi rồng chầu",
        description: "Đỉnh mái tòa nhà được trang trí đôi rồng chầu mặt trăng theo mô-típ 'lưỡng long chầu nguyệt' quen thuộc trong kiến trúc cung điện, đền chùa truyền thống Việt Nam.",
        x: 32,
        y: 55
      },
      {
        id: "hs-24-2",
        title: "Bến cảng sông Sài Gòn",
        description: "Nơi con tàu năm xưa neo đậu đón người thanh niên Nguyễn Tất Thành ra khơi, mở ra cuộc hành trình vĩ đại tìm lại độc lập tự do cho Tổ quốc.",
        x: 70,
        y: 50
      }
    ]
  }
];
