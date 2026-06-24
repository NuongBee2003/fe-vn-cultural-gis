import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { productApi } from "@/api/productApi";
import { 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  X, 
  Info, 
  ExternalLink,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import comboSangThu from "@/assets/img/shop/combo_sang_thu.png";
import nonLaSen from "@/assets/img/shop/non_la_sen.png";
import tuiCoBangHoiAn from "@/assets/img/shop/tui_co_bang_hoi_an.png";
import quatThuPhap from "@/assets/img/shop/quat_thu_phap.png";
import khanLuaHaDong from "@/assets/img/shop/khan_lua_ha_dong.png";
import phinCafeBatTrang from "@/assets/img/shop/phin_cafe_bat_trang.png";
import tranhSonMai from "@/assets/img/shop/tranh_son_mai.png";
import comboHoaDao from "@/assets/img/shop/combo_hoa_dao.png";

const ITEMS_PER_PAGE = 8;

export default function ShopPage() {
  const { i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const currentLang = i18n.language || "vi";

  // 30 Products Data Dataset
  const STATIC_PRODUCTS = [
    {
      id: "shop-1",
      title: {
        vi: "Combo nón - túi cỏ bàng vẽ 'Sang Thu'",
        en: "Hand-painted Conical Hat & Sedge Bag Combo 'Late Autumn'",
        zh: "手绘竹笠与蒲草包组合 '秋分'"
      },
      category: "combo",
      categoryName: { vi: "Combo nghệ thuật", en: "Artistic Combo", zh: "艺术组合" },
      price: 680000,
      image: comboSangThu,
      affiliateUrl: "https://thesunart.vn/san-pham/combo-non-tui-co-bang-ve_sang-thu/",
      summary: {
        vi: "Bộ sản phẩm nón lá vẽ tay và túi cỏ bàng cao cấp đồng bộ họa tiết lá thu nhẹ nhẹ, mộng mơ.",
        en: "Hand-painted traditional hat paired with a matching premium sedge handbag themed with autumn leaves.",
        zh: "手绘传统竹笠搭配配套蒲草手提包，以秋叶为主题。"
      },
      details: {
        vi: [
          "Chất liệu: Cỏ bàng tự nhiên miền sông nước miền Tây dệt thủ công cứng cáp, chống ẩm mốc tốt.",
          "Kích thước túi: 30cm x 22cm x 10cm. Nón lá: Đường kính tiêu chuẩn 41cm.",
          "Họa tiết: Vẽ tay thủ công 100% bằng màu acrylic chống nước, sắc nét và có hồn."
        ],
        en: [
          "Material: Natural sedge woven by hand from the Mekong Delta, highly durable and mold-resistant.",
          "Dimensions: Bag is 30x22x10cm; Hat has a standard diameter of 41cm.",
          "Artwork: 100% hand-painted with waterproof acrylic paints, vibrant and detailed."
        ],
        zh: [
          "材质：湄公河三角洲手工编织天然蒲草，耐用防霉。",
          "尺寸：包 30x22x10 厘米；竹笠标准直径 41 厘米。",
          "艺术：100%手绘防水丙烯颜料，色彩鲜艳，细节丰富。"
        ]
      }
    },
    {
      id: "shop-2",
      title: {
        vi: "Nón lá thêu hoa sen nghệ thuật",
        en: "Embroidered Silk Lotus Conical Hat",
        zh: "丝绸手绣荷花竹笠"
      },
      category: "hat",
      categoryName: { vi: "Nón nghệ thuật", en: "Art Hats", zh: "艺术竹笠" },
      price: 250000,
      image: nonLaSen,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/non-la-ve-nghe-thuat/",
      summary: {
        vi: "Nón lá truyền thống xứ Huế được thêu tay họa tiết đóa sen hồng bằng chỉ tơ tằm thanh cao.",
        en: "Traditional Hue conical hat decorated with hand-embroidered pink lotuses using premium silk threads.",
        zh: "传统的顺化竹笠，以优质丝线手工刺绣粉红色荷花。"
      },
      details: {
        vi: [
          "Chất liệu: Lá cọ non tuyển chọn phơi sương tạo màu trắng tuyết thanh lịch.",
          "Khâu tay thủ công tỉ mỉ bằng chỉ tơ tằm tự nhiên.",
          "Ứng dụng: Chụp ảnh áo dài nghệ thuật, làm quà tặng lưu niệm hoặc trang trí không gian Việt xưa."
        ],
        en: [
          "Material: Selected young palm leaves sun-dried to a beautiful snowy white.",
          "Process: Exquisitely hand-sewn and embroidered with natural silk thread.",
          "Usage: Perfect for traditional Ao Dai photography, souvenirs, or traditional room decor."
        ],
        zh: [
          "材质：特选幼棕榈叶，晒至雪白。",
          "工艺：精美的天然真丝线手工缝制和刺绣。",
          "用途：非常适合传统奥黛摄影、纪念品或传统空间装饰。"
        ]
      }
    },
    {
      id: "shop-3",
      title: {
        vi: "Túi cỏ bàng vẽ Phố cổ Hội An",
        en: "Hoi An Ancient Town Painted Sedge Bag",
        zh: "手绘会安古镇蒲草包"
      },
      category: "bag",
      categoryName: { vi: "Túi cỏ bàng", en: "Sedge Bags", zh: "蒲草包" },
      price: 420000,
      image: tuiCoBangHoiAn,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/tui-co-bang-ve-nghe-thuat/",
      summary: {
        vi: "Túi hộp cỏ bàng cao cấp vẽ tay tái hiện những ngôi nhà cổ sơn vàng và lồng đèn rực rỡ Hội An.",
        en: "Premium rigid sedge bag painted with warm yellow ancient houses and iconic lanterns of Hoi An.",
        zh: "优质硬质蒲草手提包，上手绘有会安温暖的黄色古民居和经典灯笼。"
      },
      details: {
        vi: [
          "Chất liệu: Sợi cỏ bàng dệt phẳng mịn, lót lụa mềm mại bên trong và khóa kéo zip kim loại bền bỉ.",
          "Kích thước: 28cm x 20cm x 9cm (Dáng hộp cứng giữ form chuẩn).",
          "Vẽ mỹ thuật Acrylic bền màu cao, không bong tróc."
        ],
        en: [
          "Material: Smooth woven sedge fiber with soft silk inner lining and a durable metal zipper.",
          "Dimensions: 28x20x9cm (rigid box design that maintains its shape perfectly).",
          "Artwork: High-grade acrylic paint that does not peel or fade."
        ],
        zh: [
          "材质：光滑编织蒲草纤维，柔软真丝内衬，耐用金属拉链。",
          "尺寸：28x20x9 厘米（硬盒设计，完美保持形状）。",
          "艺术：高级丙烯颜料，不脱落，不褪色。"
        ]
      }
    },
    {
      id: "shop-4",
      title: {
        vi: "Quạt giấy tre vẽ thư pháp phong cảnh",
        en: "Bamboo Calligraphy Watercolor Fan",
        zh: "手绘书法水墨竹折扇"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 120000,
      image: quatThuPhap,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/quat-giay-ve/",
      summary: {
        vi: "Quạt giấy truyền thống viết thư pháp chữ Việt cùng phong cảnh làng quê Việt Nam thanh bình.",
        en: "Traditional paper fan featuring hand-written Vietnamese calligraphy and serene countryside watercolor art.",
        zh: "传统折扇，饰有手写越南书法和安宁的乡村水墨画。"
      },
      details: {
        vi: [
          "Chất liệu: Khung xương tre già ngâm tẩm chống mọt; mặt quạt bằng giấy dó dai mịn.",
          "Kích thước: Chiều dài quạt xếp 26cm, độ rộng khi mở xòe 48cm.",
          "Họa tiết: Viết chữ thư pháp ý nghĩa (Tâm, Nhẫn, Đức...) kết hợp tranh phong cảnh."
        ],
        en: [
          "Material: Aged bamboo frame treated to prevent pests; fan surface made of textured Do paper.",
          "Dimensions: 26cm long when folded, opens to a wide 48cm span.",
          "Artwork: Meaningful calligraphy symbols paired with classic countryside ink wash painting."
        ],
        zh: [
          "材质：经过防虫处理的老竹骨；扇面由质感十足的越南手工纸（Dó纸）制成。",
          "尺寸：折叠时长 26 厘米，展开宽 48 厘米。",
          "艺术：有意义的书法文字与经典乡村水墨画相结合。"
        ]
      }
    },
    {
      id: "shop-5",
      title: {
        vi: "Khăn lụa Hà Đông thêu tay sen vàng",
        en: "Ha Dong Silk Scarf with Gold Lotus",
        zh: "哈东真丝金荷手绣围巾"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 350000,
      image: khanLuaHaDong,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Khăn choàng làm từ tơ tằm tự nhiên của làng lụa Hà Đông huyền thoại, thêu nổi hoa sen vàng quý phái.",
        en: "Scarves crafted from natural silk of the legendary Ha Dong village, featuring elegant gold lotus embroidery.",
        zh: "由传奇哈东村的天然丝绸制成的围巾，饰有优雅的金荷花刺绣。"
      },
      details: {
        vi: [
          "Chất liệu: 100% lụa tơ tằm tự nhiên Hà Đông mềm mại, thoáng mát và có độ óng tự nhiên.",
          "Kích thước: 180cm x 65cm rộng rãi.",
          "Họa tiết: Hoa sen vàng được các nghệ nhân thêu tay tỉ mỉ từng đường kim mũi chỉ."
        ],
        en: [
          "Material: 100% natural silk from Ha Dong, incredibly soft, breathable, with organic luster.",
          "Dimensions: Generous size of 180x65cm.",
          "Artwork: Gold lotus motif meticulously hand-embroidered by master artisans."
        ],
        zh: [
          "材质：100% 哈东天然蚕丝，手感极度柔软，透气，带有天然光泽。",
          "尺寸：180x65 厘米宽大规格。",
          "艺术：金荷花图案由手工艺大师精心手工刺绣。"
        ]
      }
    },
    {
      id: "shop-6",
      title: {
        vi: "Bộ phin cafe gốm Bát Tràng tráng men",
        en: "Bat Trang Glazed Ceramic Coffee Filter Set",
        zh: "巴庄手工青花陶瓷咖啡滤杯组"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 180000,
      image: phinCafeBatTrang,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Bộ phin pha cafe bằng gốm sứ truyền thống Bát Tràng với lớp men hỏa biến trầm mặc độc đáo.",
        en: "Traditional ceramic coffee dripper filter and cup set from Bat Trang with a beautiful rustic glaze.",
        zh: "传统的巴庄陶瓷咖啡滴滤杯 and cup set，表面涂有精美的复古釉料。"
      },
      details: {
        vi: [
          "Chất liệu: Đất sét tinh luyện Bát Tràng nung trên 1200 độ C, tuyệt đối an toàn cho sức khỏe.",
          "Bộ gồm: Ly chứa, phin lọc gốm, nắp gốm và đĩa lót.",
          "Ưu điểm: Giữ nhiệt tốt giúp ly cafe phin thơm ngon, chuẩn vị nguyên bản."
        ],
        en: [
          "Material: Refined Bat Trang clay fired at over 1200°C, completely safe for health.",
          "Included: Coffee cup, ceramic filter chamber, ceramic plunger/lid, and saucer.",
          "Benefit: Excellent heat retention that brews a rich and aromatic traditional coffee."
        ],
        zh: [
          "材质：精炼巴庄泥在1200°C以上的高温下烧制而成，安全健康。",
          "包含：咖啡杯、陶瓷滤腔、陶瓷柱塞/盖子和底碟。",
          "优点：极佳的保温效果，冲泡出浓郁芳香的传统咖啡。"
        ]
      }
    },
    {
      id: "shop-7",
      title: {
        vi: "Tranh sơn mài phong cảnh Vịnh Hạ Long",
        en: "Halong Bay Lacquer Fine Art Painting",
        zh: "下龙湾手作漆画"
      },
      category: "artwork",
      categoryName: { vi: "Tranh nghệ thuật", en: "Artworks", zh: "美术漆画" },
      price: 950000,
      image: tranhSonMai,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Tranh sơn mài truyền thống vẽ phong cảnh Vịnh Hạ Long lúc hoàng hôn dát vàng đầy nghệ thuật.",
        en: "Traditional Vietnamese lacquer painting illustrating Halong Bay at sunset with gold leaf details.",
        zh: "越南传统漆画，描绘了日落时分的下龙湾，带有金箔细节。"
      },
      details: {
        vi: [
          "Kỹ thuật: Sơn mài truyền thống nhiều lớp mài bóng mịn, khảm vỏ trứng và dát vàng lá tinh xảo.",
          "Kích thước tranh: 30cm x 40cm (Đã kèm khung gỗ đen lịch lãm).",
          "Công dụng: Treo tường trang trí phòng khách, văn phòng hoặc làm quà tặng ngoại giao sang trọng."
        ],
        en: [
          "Technique: Traditional multi-layered lacquer, polished smooth with eggshell inlays and gold leaf details.",
          "Dimensions: 30x40cm (comes with an elegant black wooden frame).",
          "Usage: Ideal for living room wall decor, office, or premium diplomatic cultural gifts."
        ],
        zh: [
          "技术：传统的的多层漆，磨平抛光，嵌有蛋壳和金箔细节。",
          "尺寸：30x40 厘米（配有优雅的黑色木框）。",
          "用途：非常适合客厅墙壁装饰、办公室或高级外交文化礼品。"
        ]
      }
    },
    {
      id: "shop-8",
      title: {
        vi: "Combo túi cói vẽ hoa đào & nón lá",
        en: "Peach Blossom Sedge Bag & Hat Combo",
        zh: "桃花手绘蒲草包与竹笠组合"
      },
      category: "combo",
      categoryName: { vi: "Combo nghệ thuật", en: "Artistic Combo", zh: "艺术组合" },
      price: 650000,
      image: comboHoaDao,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/combo-tui-va-non-co-bang/",
      summary: {
        vi: "Combo nón lá vẽ tay và túi xách cỏ bàng cao cấp được điểm xuyết những đóa hoa đào sắc xuân rực rỡ.",
        en: "A lovely set of traditional hat and sedge handbag hand-painted with vibrant spring peach blossoms.",
        zh: "一套可爱的传统竹笠和蒲草手提包，上手绘有生机盎然的春季桃花。"
      },
      details: {
        vi: [
          "Chất liệu: Cỏ bàng tự nhiên và lá cọ tự nhiên khâu tay truyền thống.",
          "Kích thước túi: 28cm x 22cm x 9cm (Dáng thanh lịch).",
          "Họa tiết: Hoa đào hồng tươi vẽ tay tỉ mỉ bằng màu Acrylic chuyên dụng bền đẹp."
        ],
        en: [
          "Material: Natural sedge and natural palm leaves, hand-stitched traditionally.",
          "Dimensions: Bag is 28x22x9cm (elegant slim style).",
          "Artwork: Detailed hand-painted pink peach blossoms using specialized long-lasting acrylics."
        ],
        zh: [
          "材质：天然蒲草和天然棕榈叶，传统手工缝制。",
          "尺寸：包 28x22x9 厘米（优雅修身风格）。",
          "艺术：使用专用长效丙烯颜料手工绘制的粉红色桃花细节。"
        ]
      }
    },
    {
      id: "shop-9",
      title: {
        vi: "Combo nón - túi cỏ bàng vẽ 'Mùa Thu Hà Nội'",
        en: "Hand-painted Combo 'Hanoi Autumn'",
        zh: "手绘草编包竹笠组合 '河内秋天'"
      },
      category: "combo",
      categoryName: { vi: "Combo nghệ thuật", en: "Artistic Combo", zh: "艺术组合" },
      price: 720000,
      image: comboSangThu,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/combo-tui-va-non-co-bang/",
      summary: {
        vi: "Bộ combo vẽ tháp rùa, hoa sữa và những sắc vàng lãng mạn đặc trưng của mùa thu thủ đô.",
        en: "Sedge bag & conical hat combo featuring Turtle Tower illustration and signature autumn vibes of Hanoi.",
        zh: "草编包和竹笠组合，带有龟塔插图和河内招牌秋季氛围。"
      },
      details: {
        vi: [
          "Chất liệu: Cỏ bàng thiên nhiên tuyển chọn phơi sấy kỹ lưỡng.",
          "Họa tiết: Vẽ tay tranh phong cảnh nghệ thuật sắc sảo.",
          "Ứng dụng: Đi du lịch, dạo phố, chụp ảnh hoặc làm quà lưu niệm Việt Nam độc đáo."
        ],
        en: [
          "Material: Carefully selected natural sedge fibers, thoroughly sun-dried.",
          "Design: Artistic landscape painted completely by hand.",
          "Application: Ideal for traveling, strolling, photoshoots, or unique souvenirs."
        ],
        zh: [
          "材质：精心挑选的天然蒲草纤维，彻底烘干。",
          "设计：完全手工绘制的艺术风景画。",
          "应用：旅游、散步、摄影或独特纪念品的理想选择。"
        ]
      }
    },
    {
      id: "shop-10",
      title: {
        vi: "Combo nón - túi cỏ bàng vẽ 'Nàng Thơ'",
        en: "Conical Hat & Sedge Bag Combo 'Muse'",
        zh: "手绘蒲草手提包与竹笠组合 '缪斯'"
      },
      category: "combo",
      categoryName: { vi: "Combo nghệ thuật", en: "Artistic Combo", zh: "艺术组合" },
      price: 690000,
      image: comboHoaDao,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/combo-tui-va-non-co-bang/",
      summary: {
        vi: "Vẽ tay họa tiết đóa sen tinh khôi dịu dàng, tôn vinh nét duyên dáng, nữ tính của người phụ nữ Việt.",
        en: "Adorned with pure white lotuses, celebrating the elegant and poetic beauty of traditional attire.",
        zh: "饰有纯净白荷，展现传统服饰的优雅与诗意之美。"
      },
      details: {
        vi: [
          "Chất liệu: Sợi cỏ bàng dệt tay chắc nịch.",
          "Họa tiết: Hoa sen trắng vẽ cách điệu nghệ thuật thanh nhã.",
          "Phụ kiện: Tặng kèm nơ ruy-băng lụa thắt trang trí điệu đà."
        ],
        en: [
          "Material: Dense hand-woven natural sedge straw.",
          "Pattern: Elegantly stylized white lotus drawings.",
          "Accessory: Includes a free matching silk ribbon for decoration."
        ],
        zh: [
          "材质：致密手工编织蒲草。",
          "图案：优雅的写意白荷图。",
          "配件：附赠一条配套的真丝缎带用于装饰。"
        ]
      }
    },
    {
      id: "shop-11",
      title: {
        vi: "Nón lá thêu hoa cúc chi cổ điển",
        en: "Classic Embroidered Chamomile Conical Hat",
        zh: "古典手绣野菊花竹笠"
      },
      category: "hat",
      categoryName: { vi: "Nón nghệ thuật", en: "Art Hats", zh: "艺术竹笠" },
      price: 260000,
      image: nonLaSen,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/non-la-ve-nghe-thuat/",
      summary: {
        vi: "Nón thêu những đóa cúc chi vàng nhỏ xinh, mang hơi thở dân dã thanh lịch và hoài cổ.",
        en: "Decorated with delicate hand-embroidered golden chamomiles, offering a nostalgic and rustic aesthetic.",
        zh: "饰有精美的金色野菊花手工刺绣，营造出复古与田园美感。"
      },
      details: {
        vi: [
          "Chất liệu: Lá cọ phơi đạt độ dẻo dai và có sắc trắng ngà.",
          "Kỹ thuật thêu nổi ba chiều giúp hoa cúc chi sinh động như thật.",
          "Quai nón: Lụa tơ tằm mềm mát dễ chịu."
        ],
        en: [
          "Material: High-quality sun-cured palm leaves for durability and ivory tone.",
          "Embroidery: 3D raised stitching makes chamomiles appear lifelike.",
          "Strap: Soft and cooling natural silk fabric strap."
        ],
        zh: [
          "材质：优质晒干棕榈叶，坚固耐用，呈象牙白色调。",
          "刺绣：3D立体刺绣，野菊花栩栩如生。",
          "系带：柔软凉爽的天然真丝面料系带。"
        ]
      }
    },
    {
      id: "shop-12",
      title: {
        vi: "Nón lá thêu chim phượng hoàng quý phái",
        en: "Phoenix Embroidered Imperial Conical Hat",
        zh: "手绣凤凰华丽竹笠"
      },
      category: "hat",
      categoryName: { vi: "Nón nghệ thuật", en: "Art Hats", zh: "艺术竹笠" },
      price: 320000,
      image: nonLaSen,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/non-la-ve-nghe-thuat/",
      summary: {
        vi: "Nón vẽ kết hợp thêu chỉ kim tuyến hình phượng hoàng tung cánh sang trọng, cảm hứng hoàng gia triều Nguyễn.",
        en: "Exquisite embroidery with metallic threads depicting a phoenix, inspired by royal Nguyen Dynasty motifs.",
        zh: "用金属线刺绣的精美凤凰图案，灵感来自阮朝皇家图案。"
      },
      details: {
        vi: [
          "Chất liệu: Lá bài thơ cao cấp gấp 2 lớp bền bỉ.",
          "Họa tiết: Thêu chỉ vàng, chỉ đỏ hình Phượng Hoàng lộng lẫy.",
          "Thích hợp làm quà tặng cao cấp cho khách quốc tế hoặc trưng bày sự kiện văn hóa."
        ],
        en: [
          "Material: Premium 2-layer poem conical hat structure.",
          "Embroidery: Gold and red thread royal phoenix pattern.",
          "Best used for upscale international gifts or cultural event showcases."
        ],
        zh: [
          "材质：优质双层诗意竹笠结构。",
          "刺绣：红黄双色真丝线与金线凤凰刺绣。",
          "非常适合作为高档国际礼品或文化活动展示。"
        ]
      }
    },
    {
      id: "shop-13",
      title: {
        vi: "Nón lá vẽ phong cảnh sông Hương núi Ngự",
        en: "Perfume River Hand-Painted Conical Hat",
        zh: "手绘香江御屏山竹笠"
      },
      category: "hat",
      categoryName: { vi: "Nón nghệ thuật", en: "Art Hats", zh: "艺术竹笠" },
      price: 280000,
      image: nonLaSen,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/non-la-ve-nghe-thuat/",
      summary: {
        vi: "Nét vẽ tinh xảo tái hiện cây cầu Tràng Tiền lịch sử và chiếc thuyền rồng lững lờ trôi trên dòng sông Hương.",
        en: "Finely painted scenery capturing the historic Trang Tien bridge and dragon boats on Perfume River.",
        zh: "手绘精美风景，再现历史悠久的钱场桥和香江上的龙舟。"
      },
      details: {
        vi: [
          "Lá nón xử lý thủ công, chống thấm nước tuyệt đối.",
          "Bức tranh sông nước xứ Huế thanh bình được thu nhỏ sống động trên vành nón.",
          "Tặng kèm quai đeo lụa màu tím Huế mộng mơ."
        ],
        en: [
          "Waterproof-treated palm leaves, completely water-resistant.",
          "A mini scenic representation of peaceful Hue vividly painted on the hat.",
          "Comes with a complimentary iconic purple silk strap."
        ],
        zh: [
          "防水处理棕榈叶，完全耐水。",
          "在竹笠上生动绘制的宁静顺化小微缩风景图。",
          "附赠一条标志性顺化紫真丝系带。"
        ]
      }
    },
    {
      id: "shop-14",
      title: {
        vi: "Túi cỏ bàng vẽ hoa mẫu đơn hồng",
        en: "Hand-Painted Pink Peony Sedge Bag",
        zh: "手绘粉红牡丹蒲草包"
      },
      category: "bag",
      categoryName: { vi: "Túi cỏ bàng", en: "Sedge Bags", zh: "蒲草包" },
      price: 450000,
      image: tuiCoBangHoiAn,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/tui-co-bang-ve-nghe-thuat/",
      summary: {
        vi: "Đóa hoa mẫu đơn vẽ tay sắc sảo đầy đặn, tượng trưng cho phú quý, bình an và thịnh vượng.",
        en: "Featuring a hand-painted blooming pink peony, symbolizing luxury, prosperity, and peace.",
        zh: "上手绘有盛开的粉红色牡丹，象征着华贵、繁荣与平安。"
      },
      details: {
        vi: [
          "Chất liệu: Cỏ bàng phơi khô tự nhiên có màu xanh ngà tự nhiên, bóng bẩy.",
          "Dáng túi: Hình hộp thang đứng thanh lịch, quai xách bọc da êm ái.",
          "Họa tiết vẽ bằng sơn dầu Acrylic bền màu với thời gian."
        ],
        en: [
          "Material: Naturally dried sedge straws showing clean ivory hue.",
          "Design: Elegant trapezoid shape with leather-wrapped handles.",
          "Artwork painted with high-end, long-lasting acrylic oils."
        ],
        zh: [
          "材质：自然干燥的蒲草，呈现出干净的象牙色调。",
          "设计：优雅的梯形硬挺款式，带有皮革包裹的手柄。",
          "图案使用高端、持久的丙烯颜料绘制。"
        ]
      }
    },
    {
      id: "shop-15",
      title: {
        vi: "Túi cỏ bàng vẽ lá chuối xanh nhiệt đới",
        en: "Tropical Banana Leaf Painted Sedge Bag",
        zh: "热带芭蕉叶手绘蒲草包"
      },
      category: "bag",
      categoryName: { vi: "Túi cỏ bàng", en: "Sedge Bags", zh: "蒲草包" },
      price: 390000,
      image: tuiCoBangHoiAn,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/tui-co-bang-ve-nghe-thuat/",
      summary: {
        vi: "Thiết kế trẻ trung với họa tiết tàu lá chuối xanh mướt mát, tràn đầy năng lượng tươi mới của thiên nhiên.",
        en: "Modern and fresh design decorated with leafy green banana prints, full of summer vibe.",
        zh: "现代清新设计，饰有葱郁的绿色芭蕉叶，散发着夏日自然气息。"
      },
      details: {
        vi: [
          "Dây đeo chéo bằng sợi xích kim loại giả cổ tháo rời được vô cùng tiện lợi.",
          "Chất liệu cói bàng dệt thưa mềm mại hơn, nhẹ nhõm.",
          "Bên trong lót vải bố thô mộc mạc."
        ],
        en: [
          "Convenient detachable antique-style chain shoulder strap.",
          "Slightly looser weave for a softer, lightweight feel.",
          "Lined with organic canvas lining inside."
        ],
        zh: [
          "配有可拆卸的复古风金属链条肩带，实用便携。",
          "略微宽松的编织纹理，质感更柔软轻便。",
          "内里衬有质朴的有机帆布。"
        ]
      }
    },
    {
      id: "shop-16",
      title: {
        vi: "Túi cỏ bàng thêu hoa sen trắng",
        en: "White Lotus Embroidered Sedge Bag",
        zh: "白荷花手绣蒲草包"
      },
      category: "bag",
      categoryName: { vi: "Túi cỏ bàng", en: "Sedge Bags", zh: "蒲草包" },
      price: 480000,
      image: tuiCoBangHoiAn,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/tui-co-bang-ve-nghe-thuat/",
      summary: {
        vi: "Sự kết hợp tinh tế giữa nghệ thuật thêu truyền thống và túi cỏ bàng hiện đại, bông sen nở rộ trắng tinh khôi.",
        en: "Exquisite combo of traditional embroidery and sedge bag, highlighting a blooming pure white lotus.",
        zh: "传统手工刺绣与蒲草包的精妙结合，点缀盛开的纯白荷花。"
      },
      details: {
        vi: [
          "Kỹ thuật thêu ruy-băng kết hợp thêu chỉ tơ làm nổi bật bông sen trắng tao nhã.",
          "Kích thước: 32cm x 24cm x 11cm thoải mái đựng đồ dùng cá nhân.",
          "Quai gỗ tròn sang trọng cầm tay chắc chắn."
        ],
        en: [
          "Ribbon and silk thread embroidery technique highlighting the elegant white lotus.",
          "Size: 32x24x11cm, spacious for everyday items.",
          "Premium round wooden handles for a stylish hand-held feel."
        ],
        zh: [
          "丝带和真丝线刺绣工艺，生动凸显高雅的白荷花。",
          "尺寸：32x24x11 厘米，方便收纳日常随身物品。",
          "高端圆木手柄，时尚大气。"
        ]
      }
    },
    {
      id: "shop-17",
      title: {
        vi: "Quạt giấy tre vẽ hoa mai vàng ngày Tết",
        en: "Lunar New Year Apricot Blossom Paper Fan",
        zh: "农历新年金腊梅水墨竹扇"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 130000,
      image: quatThuPhap,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/quat-giay-ve/",
      summary: {
        vi: "Họa tiết mai vàng khoe sắc thắm mang ý nghĩa rước lộc, đón xuân an khang thịnh vượng.",
        en: "Adorned with blooming yellow apricot blossoms, symbolizing fortune, luck, and spring blessings.",
        zh: "饰有盛开的金腊梅，象征着财运、好运和新春祝福。"
      },
      details: {
        vi: [
          "Khung quạt: 18 nan tre cật cứng cáp được mài nhẵn mịn tay.",
          "Tranh vẽ Acrylic màu vàng rực rỡ, trang trí cành đào phai phụ họa tinh tế.",
          "Thích hợp làm quà tặng ý nghĩa dịp đầu xuân năm mới."
        ],
        en: [
          "Frame: 18 durable bamboo ribs polished smooth.",
          "Painting: Golden yellow blossoms drawn in vibrant acrylic paint.",
          "Perfect for meaningful gifts during the Lunar New Year."
        ],
        zh: [
          "扇骨：18根坚固的硬竹骨，打磨光滑不扎手。",
          "画作：用鲜艳的丙烯颜料绘制的金黄色腊梅花。",
          "非常适合作为农历新年期间有意义的礼品。"
        ]
      }
    },
    {
      id: "shop-18",
      title: {
        vi: "Quạt lụa vẽ tranh thủy mặc chim hạc",
        en: "Crane Silk Watercolor Ink Fan",
        zh: "白鹤水墨绢扇"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 150000,
      image: quatThuPhap,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/quat-giay-ve/",
      summary: {
        vi: "Quạt làm bằng vải lụa tơ tằm vẽ thủ công đôi hạc trắng đứng bóng bên gốc thông già cổ kính phong cách nho nhã.",
        en: "Crafted on silk fabric with hand-painted cranes by a pine tree, invoking classic scholar style.",
        zh: "在真丝面上手绘松树与双白鹤，散发着古典书香门第风范。"
      },
      details: {
        vi: [
          "Mặt quạt bằng vải lụa Hà Đông cao cấp dai mềm, không nứt gãy khi xếp quạt.",
          "Vẽ tranh thủy mặc mực tàu kết hợp mực màu truyền thống.",
          "Cán quạt bằng gỗ tre sẫm màu hoài cổ."
        ],
        en: [
          "Premium Ha Dong silk surface, highly resilient, won't crease when folded.",
          "Traditional Chinese ink wash combined with colored paints.",
          "Nostalgic dark bamboo fan handle."
        ],
        zh: [
          "优质哈东真丝面，高回弹，折叠时不会开裂。",
          "传统水墨与彩色颜料相结合绘制。",
          "复古深色竹子手柄。"
        ]
      }
    },
    {
      id: "shop-19",
      title: {
        vi: "Khăn lụa Hà Đông màu xanh ngọc bích",
        en: "Jade Green Ha Dong Silk Scarf",
        zh: "翡翠绿哈东真丝围巾"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 360000,
      image: khanLuaHaDong,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Khăn lụa nhuộm màu xanh ngọc bích quý phái tự nhiên, bóng bẩy và mang lại cảm giác dịu mát nhẹ nhàng.",
        en: "Natural jade green dyed silk scarf, showing organic luster and offering a cool, lightweight touch.",
        zh: "天然翡翠绿色染色真丝围巾，展现有机光泽，触感清凉轻盈。"
      },
      details: {
        vi: [
          "Chất liệu lụa mỏng dệt thủ công khéo léo.",
          "Nhuộm màu tự nhiên từ lá cây rừng miền núi phía Bắc tuyệt đối an toàn.",
          "Có thể giặt tay dễ dàng."
        ],
        en: [
          "Thin, breathable hand-loomed silk.",
          "Naturally dyed using forest plant leaves from Northern Vietnam, eco-friendly.",
          "Easy to hand wash."
        ],
        zh: [
          "薄而透气的手工织造真丝材质。",
          "采用越南北部森林植物叶片天然染色，环保安全。",
          "易于手洗保养。"
        ]
      }
    },
    {
      id: "shop-20",
      title: {
        vi: "Khăn lụa Hà Đông vẽ tay hoa anh đào",
        en: "Cherry Blossom Hand-Painted Silk Scarf",
        zh: "手绘樱花哈东真丝围巾"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 390000,
      image: khanLuaHaDong,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Tác phẩm thời trang vẽ tay những nhành hoa anh đào hồng phấn bay bổng trên nền lụa tơ tằm trắng ngà.",
        en: "A wearable piece of art featuring painted pink cherry blossoms on ivory white silk.",
        zh: "一件可穿戴的艺术品，在象牙白真丝上面绘有粉红色樱花。"
      },
      details: {
        vi: [
          "Chất liệu: Lụa tơ tằm 100% tơ tằm tự nhiên.",
          "Mỹ thuật vẽ bằng màu nhuộm vải chuyên dụng đã qua hấp nhiệt bền màu vĩnh viễn.",
          "Biên khăn cuốn tay (hand-rolled) vô cùng tinh tế."
        ],
        en: [
          "Material: 100% natural mulberry silk.",
          "Design: Painted with specialized textile dye, heat-set for permanent washability.",
          "Features hand-rolled edges for an ultra-premium finish."
        ],
        zh: [
          "材质：100%天然桑蚕丝。",
          "设计：采用专用织物染料绘制，经热定型处理，可永久清洗不褪色。",
          "配有手工卷边，带来超凡的高级质感。"
        ]
      }
    },
    {
      id: "shop-21",
      title: {
        vi: "Bộ phin cafe gốm Bát Tràng men xanh ngọc",
        en: "Jade Glaze Bat Trang Ceramic Coffee Filter",
        zh: "汝窑翠绿巴庄陶瓷咖啡滴滤组"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 195000,
      image: phinCafeBatTrang,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Bộ phin tráng lớp men màu xanh ngọc bích giả cổ trang nhã, điểm xuyết những vết rạn tự nhiên cổ kính.",
        en: "Bat Trang drip filter coated with retro jade glaze, showing beautiful crackle lines.",
        zh: "巴庄滴滤杯，涂有复古冰裂汝窑翠绿釉，显现美丽的开片纹路。"
      },
      details: {
        vi: [
          "Men rạn ngọc cổ kính độc đáo được nung ở nhiệt độ chuẩn gốm sứ.",
          "Quai cốc dày dặn, cách nhiệt tốt, cầm nắm an toàn.",
          "Bộ gồm 4 chi tiết ăn khớp tháo lắp tiện lợi."
        ],
        en: [
          "Unique crackle jade glaze fired at standard ceramic temperatures.",
          "Thick handle with good heat insulation for a safe grip.",
          "Includes 4 nested pieces for easy assembly and storage."
        ],
        zh: [
          "独特的冰裂汝窑翠绿釉，在标准陶瓷温度下烧制而成。",
          "加厚手柄，隔热效果好，握持安全。",
          "包含4件嵌套部件，易于组装和存放。"
        ]
      }
    },
    {
      id: "shop-22",
      title: {
        vi: "Bộ ấm trà gốm sứ Bát Tràng men rêu cổ",
        en: "Ancient Moss Glaze Bat Trang Tea Set",
        zh: "复古苔藓绿巴庄陶瓷茶具组"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 490000,
      image: phinCafeBatTrang,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Bộ bình trà cao cấp tráng lớp men màu xanh rêu cổ bóng bẩy, mang phong vị trà đạo thiền định bình lặng.",
        en: "Premium tea set coated in dark moss green glaze, reflecting quiet Zen tea traditions.",
        zh: "高端茶具套装，涂有深苔藓绿釉，体现了宁静的禅茶传统。"
      },
      details: {
        vi: [
          "Bao gồm: 1 ấm trà dung tích 450ml và 6 chén nhỏ đi kèm đĩa lót gốm.",
          "Lưới lọc trà gốm đục lỗ thông minh tích hợp bên trong ấm.",
          "Hộp quà bọc lụa chống sốc sang trọng, thích hợp biếu tặng."
        ],
        en: [
          "Included: 1 teapot (450ml), 6 teacups, and ceramic matching saucers.",
          "Features a built-in ceramic tea strainer inside the teapot.",
          "Packaged in a premium silk-lined gift box, ideal for presentation."
        ],
        zh: [
          "包含：1个茶壶（450毫升）、6个茶杯和陶瓷配套茶托。",
          "茶壶内部配有内置陶瓷茶滤器，设计精妙。",
          "包装在高级丝绸衬里礼盒中，非常适合送礼。"
        ]
      }
    },
    {
      id: "shop-23",
      title: {
        vi: "Tranh sơn mài phong cảnh Chùa Một Cột",
        en: "One Pillar Temple Lacquer Painting",
        zh: "手作一柱庙漆画"
      },
      category: "artwork",
      categoryName: { vi: "Tranh nghệ thuật", en: "Artworks", zh: "美术漆画" },
      price: 880000,
      image: tranhSonMai,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Biểu tượng lịch sử Chùa Một Cột Thăng Long Hà Nội được thể hiện sinh động bằng nghệ thuật sơn mài đắp nổi.",
        en: "Historic landmark One Pillar Temple in Hanoi vividly illustrated in relief lacquer art.",
        zh: "越南河内的历史地标一柱庙，在浮雕漆画中生动展现。"
      },
      details: {
        vi: [
          "Chất liệu khảm: Khảm vỏ trai trắng, vỏ trứng đập vụn tạo hình cánh sen trang nhã.",
          "Kích thước: 30cm x 30cm vuông vắn.",
          "Bề mặt sơn ta mài thủ công nhiều lần tạo độ sâu hun hút cho tác phẩm."
        ],
        en: [
          "Inlay: White mother-of-pearl and crushed eggshells to form elegant lotus petals.",
          "Dimensions: Square size of 30x30cm.",
          "Hand-polished lacquer coats create an amazing depth."
        ],
        zh: [
          "镶嵌：白珍珠贝和碎蛋壳，勾勒出优雅的荷花瓣。",
          "尺寸：30x30 厘米正方形规格。",
          "手工抛光的漆面涂层营造出惊人的画作深度。"
        ]
      }
    },
    {
      id: "shop-24",
      title: {
        vi: "Tranh sơn mài phố cổ Hà Nội xưa",
        en: "Old Hanoi Streets Lacquer Painting",
        zh: "手作河内古街漆画"
      },
      category: "artwork",
      categoryName: { vi: "Tranh nghệ thuật", en: "Artworks", zh: "美术漆画" },
      price: 980000,
      image: tranhSonMai,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Bức tranh sơn mài hoài niệm tái hiện hình ảnh những ngôi nhà ngói xô nghiêng, gánh hàng rong bên rặng liễu Hồ Gươm.",
        en: "Nostalgic scenery with tiled rooftops and street vendors under lakeside willow trees.",
        zh: "令人怀旧的风景，湖畔柳树下的瓦房屋顶和街头小贩。"
      },
      details: {
        vi: [
          "Bức vẽ dùng các tông màu trầm ấm làm chủ đạo kết hợp dát lá vàng thật tạo điểm nhấn ánh sáng.",
          "Kích thước tranh: 40cm x 60cm.",
          "Ván vẽ gỗ MDF chống cong vênh độ bền trên 30 năm."
        ],
        en: [
          "Warm earthy color palette highlighted with real gold leaves for lighting accents.",
          "Dimensions: 40x60cm.",
          "Mounted on premium MDF board that prevents warping, durable for over 30 years."
        ],
        zh: [
          "温暖的泥土色调，用真金箔点缀，营造光影效果。",
          "尺寸：40x60 厘米。",
          "安装在优质中密度纤维板上，防变形，耐用30年以上。"
        ]
      }
    },
    {
      id: "shop-25",
      title: {
        vi: "Tranh khảm xà cừ đồng quê Việt Nam",
        en: "Country Life Mother-of-Pearl Inlay Painting",
        zh: "手作田园风光螺钿镶嵌画"
      },
      category: "artwork",
      categoryName: { vi: "Tranh nghệ thuật", en: "Artworks", zh: "美术漆画" },
      price: 1200000,
      image: tranhSonMai,
      affiliateUrl: "https://thesunart.vn/",
      summary: {
        vi: "Khảm trai xà cừ óng ánh tái hiện cảnh chăn trâu thổi sáo, đình làng và cây đa bến nước rực rỡ sắc màu xà cừ.",
        en: "Iridescent mother-of-pearl inlays illustrating iconic rural scenes of buffalo herding and village trees.",
        zh: "绚丽的螺钿镶嵌，描绘了牧牛和村落大树的标志性乡村场景。"
      },
      details: {
        vi: [
          "Khảm trai 100% tự nhiên lấy từ bào ngư, ốc xà cừ biển cho độ óng ánh bảy màu rực rỡ.",
          "Cốt tranh gỗ gụ tự nhiên đục chạm tinh xảo xung quanh.",
          "Kích thước tranh lớn: 50cm x 70cm sang trọng."
        ],
        en: [
          "Inlays: 100% natural sea shells and abalone shells giving a brilliant colorful shine.",
          "Base: Premium solid mahogany wood with fine carvings on borders.",
          "Dimensions: Large display size of 50x70cm."
        ],
        zh: [
          "镶嵌：100% 天然海贝和鲍鱼壳，闪烁着灿烂缤纷的光泽。",
          "底座：优质实木红木，边缘雕刻精美。",
          "尺寸：50x70 厘米大尺寸展示。"
        ]
      }
    },
    {
      id: "shop-26",
      title: {
        vi: "Combo nón - túi cỏ bàng họa tiết Thổ cẩm",
        en: "Brocade Pattern Sedge Bag & Hat Combo",
        zh: "手绘织锦图案蒲草包与竹笠组合"
      },
      category: "combo",
      categoryName: { vi: "Combo nghệ thuật", en: "Artistic Combo", zh: "艺术组合" },
      price: 700000,
      image: comboSangThu,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/combo-tui-va-non-co-bang/",
      summary: {
        vi: "Vẽ tay họa tiết thổ cẩm hình học sặc sỡ, lấy cảm hứng từ trang phục truyền thống của dân tộc Tây Bắc.",
        en: "Hand-painted vibrant geometric brocade patterns inspired by traditional costumes of ethnic minorities.",
        zh: "手绘鲜艳的几何织锦图案，灵感来自少数民族的传统服饰。"
      },
      details: {
        vi: [
          "Họa tiết đối xứng tinh xảo vẽ thủ công chi tiết từng milimet.",
          "Chất liệu cỏ bàng dày dặn có lót đệm xốp êm giữ dáng hộp túi.",
          "Thích hợp phối đồ phong cách Boho-chic cá tính."
        ],
        en: [
          "Symmetrical geometric patterns hand-drawn with incredible precision.",
          "Thick sedge weave with foam padding inside to maintain box shape.",
          "Perfect for pairing with bold Boho-chic style outfits."
        ],
        zh: [
          "以惊人的精确度手工绘制对称几何图案。",
          "加厚蒲草编织，内有泡棉填充以保持手袋坚挺形状。",
          "非常适合搭配前卫的波西米亚风服饰。"
        ]
      }
    },
    {
      id: "shop-27",
      title: {
        vi: "Combo nón - túi cỏ bàng vẽ 'Sông nước miền Tây'",
        en: "Mekong River Hand-Painted Combo",
        zh: "手绘湄公河风光蒲草包与竹笠组合"
      },
      category: "combo",
      categoryName: { vi: "Combo nghệ thuật", en: "Artistic Combo", zh: "艺术组合" },
      price: 680000,
      image: comboHoaDao,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/combo-tui-va-non-co-bang/",
      summary: {
        vi: "Họa tiết vẽ tay rặng dừa nước soi bóng, chiếc cầu tre lắc lẻo và những chiếc xuồng ba lá lờ lững trôi.",
        en: "Hand-painted coconut palms, rustic bamboo bridges, and three-plank canoes of Southwest Vietnam.",
        zh: "手绘椰子树、质朴的竹桥和越南西南部传统的三板划艇。"
      },
      details: {
        vi: [
          "Họa tiết vẽ tay màu Acrylic pha nhũ vàng tạo hiệu ứng lấp lánh dưới nắng.",
          "Túi xách trang bị thêm khóa kéo kim loại đóng mở tiện dụng.",
          "Nón lá đan mây tre dẻo dai."
        ],
        en: [
          "Patterns painted with metallic acrylic highlights, shining beautifully under sunlight.",
          "Handbag features a convenient metal zipper closure.",
          "Bamboo and palm hat woven tight and strong."
        ],
        zh: [
          "图案采用金属质感丙烯涂料绘制，在阳光下闪闪发光。",
          "手袋配有实用的金属拉链闭合。",
          "竹篾和棕榈叶编织紧密结实。"
        ]
      }
    },
    {
      id: "shop-28",
      title: {
        vi: "Nón lá vẽ chân dung theo yêu cầu",
        en: "Custom Portrait Hand-Painted Conical Hat",
        zh: "个性化定制肖像手绘竹笠"
      },
      category: "hat",
      categoryName: { vi: "Nón nghệ thuật", en: "Art Hats", zh: "艺术竹笠" },
      price: 350000,
      image: nonLaSen,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/non-la-ve-nghe-thuat/",
      summary: {
        vi: "Vẽ tay chân dung cô gái Việt Nam thướt tha trong tà áo dài bên đóa hoa sen mộc mạc tinh khiết.",
        en: "Features a beautiful custom portrait of a Vietnamese lady in traditional Ao Dai and lotus flowers.",
        zh: "手绘身穿传统奥黛的越南淑女与荷花的精美肖像画。"
      },
      details: {
        vi: [
          "Vẽ chân dung bằng sơn màu chuyên dụng cao cấp chân thực sắc nét.",
          "Nhận đặt vẽ theo ảnh chụp chân dung khách hàng gửi yêu cầu.",
          "Phủ sơn bóng bảo vệ mặt tranh chống mưa nắng tuyệt đối."
        ],
        en: [
          "Portrait painted in high realism using premium weather-resistant colors.",
          "Open to custom requests using customer-provided portrait photos.",
          "Glossy protective varnish coat ensures complete resistance to sun and rain."
        ],
        zh: [
          "采用优质耐候颜料高写实手绘肖像。",
          "接受使用客户提供的肖像照片进行个性化定制需求。",
          "涂有光泽保护漆，确保完全防晒防雨。"
        ]
      }
    },
    {
      id: "shop-29",
      title: {
        vi: "Túi cỏ bàng thêu hoa sen xanh",
        en: "Blue Lotus Embroidered Sedge Bag",
        zh: "青花荷花手绣蒲草包"
      },
      category: "bag",
      categoryName: { vi: "Túi cỏ bàng", en: "Sedge Bags", zh: "蒲草包" },
      price: 460000,
      image: tuiCoBangHoiAn,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/tui-co-bang-ve-nghe-thuat/",
      summary: {
        vi: "Thêu tay đóa sen màu xanh ngọc bích độc lạ quý phái, mang phong cách gốm sứ hoa lam cổ điển.",
        en: "Unique blue lotus embroidery inspired by classic blue-and-white porcelain aesthetics.",
        zh: "独特的青花荷花刺绣，灵感来自经典的青花瓷美学。"
      },
      details: {
        vi: [
          "Bông sen xanh thêu tay phẳng mịn bằng tơ bóng cao cấp óng ánh.",
          "Kích thước trung bình: 30cm x 22cm đựng vừa máy tính bảng.",
          "Dây đeo vai bọc vải thắt nơ tháo lắp linh động."
        ],
        en: [
          "Blue lotus flat-embroidered using shimmering silk threads.",
          "Medium size: 30x22cm, comfortably fits a tablet.",
          "Detachable fabric bow shoulder strap."
        ],
        zh: [
          "使用闪烁的真丝线平绣出青花荷花图案。",
          "中等尺寸：30x22厘米，可舒适容纳平板电脑。",
          "配备可拆卸面料蝴蝶结肩带。"
        ]
      }
    },
    {
      id: "shop-30",
      title: {
        vi: "Quạt xếp gỗ thơm khắc rồng phượng",
        en: "Scented Wood Carved Dragon Phoenix Fan",
        zh: "雕花镂空香木龙凤折扇"
      },
      category: "accessory",
      categoryName: { vi: "Phụ kiện văn hóa", en: "Cultural Accessories", zh: "文化配件" },
      price: 180000,
      image: quatThuPhap,
      affiliateUrl: "https://thesunart.vn/danh-muc-san-pham/quat-giay-ve/",
      summary: {
        vi: "Quạt làm từ gỗ bách thơm tự nhiên đục lỗ khắc nổi tinh xảo hình rồng phượng chầu mặt nguyệt cổ điển.",
        en: "Crafted from fragrant natural wood with elaborate laser-cut dragon and phoenix carvings.",
        zh: "由香木制成，带有激光雕刻的祥龙与飞凤镂空图案。"
      },
      details: {
        vi: [
          "Chất liệu: Gỗ bách tự nhiên tỏa mùi hương thơm ngát dễ chịu khi sử dụng.",
          "Gồm 30 nan gỗ ghép nối tinh xảo bằng trục khuyên kim loại kiên cố.",
          "Kèm tua rua đỏ trang trí phong thủy cầu may mắn cát tường."
        ],
        en: [
          "Material: Natural cypress wood that releases a sweet, calming scent when fanned.",
          "Composed of 30 wood panels linked securely by a sturdy metal rivet.",
          "Includes a decorative red tassel for good fortune and positive feng shui."
        ],
        zh: [
          "材质：天然柏木，扇动时散发出香气。",
          "由30块木片组成，通过坚固的金属铆钉安全链接。",
          "包含流苏装饰，寓意吉星高照。"
        ]
      }
    }
  ];

  const [dbProducts, setDbProducts] = useState([]);

  const getAbsoluteUrl = (url) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  useEffect(() => {
    productApi.getAll("", 1, 100)
      .then((res) => {
        setDbProducts(res.data || []);
      })
      .catch((err) => {
        console.error("Lỗi fetch shop products:", err);
      });
  }, []);

  const products = useMemo(() => {
    const mapped = dbProducts.map((p) => ({
      id: `db-${p.id}`,
      title: {
        vi: p.name,
        en: p.name,
        zh: p.name
      },
      category: "custom",
      categoryName: { vi: "Sản phẩm doanh nghiệp", en: "Business Products", zh: "商家产品" },
      price: Number(p.price),
      image: p.image_url || null,
      affiliateUrl: p.affiliate_url || "",
      summary: {
        vi: p.description || "",
        en: p.description || "",
        zh: p.description || ""
      },
      details: {
        vi: [p.description || "Chi tiết sản phẩm"],
        en: [p.description || "Product details"],
        zh: [p.description || "产品详情"]
      }
    }));
    return [...mapped, ...STATIC_PRODUCTS];
  }, [dbProducts]);

  const shopFilters = [
    { key: "all", label: { vi: "Tất cả", en: "All Products", zh: "全部商品" } },
    { key: "custom", label: { vi: "Doanh nghiệp", en: "Business Products", zh: "商家 sản phẩm" } },
    { key: "combo", label: { vi: "Combo nghệ thuật", en: "Artistic Combos", zh: "艺术组合" } },
    { key: "hat", label: { vi: "Nón nghệ thuật", en: "Art Hats", zh: "艺术竹笠" } },
    { key: "bag", label: { vi: "Túi cỏ bàng", en: "Sedge Bags", zh: "蒲草手袋" } },
    { key: "artwork", label: { vi: "Tranh nghệ thuật", en: "Artworks", zh: "美术漆画" } },
    { key: "accessory", label: { vi: "Phụ kiện", en: "Accessories", zh: "文化配饰" } }
  ];

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((p) => p.category === activeFilter);
  }, [activeFilter, products]);

  // Pagination Logic
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  }, [filteredProducts]);

  // Adjust page number if it exceeds total pages
  const currentPageSafe = useMemo(() => {
    if (currentPage > totalPages) return 1;
    return currentPage;
  }, [currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPageSafe - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPageSafe]);

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setCurrentPage(1); // Reset to page 1
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    
    // Smooth scroll back to top of container
    const shopContainer = document.getElementById("shop-grid-header");
    if (shopContainer) {
      shopContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-stone-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Header */}
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
              <ShoppingBag size={14} />
              {currentLang === "vi" ? "Trải nghiệm — Mua sắm liên kết" : 
               currentLang === "en" ? "Experience — Affiliate Shop" : "体验 — 文创推荐"}
            </p>
            <h1
              className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {currentLang === "vi" ? "Cửa hàng di sản Việt" : 
               currentLang === "en" ? "Vietnamese Heritage Shop" : "越南遗产文创商店"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-500 max-w-2xl">
              {currentLang === "vi" ? "Tuyển chọn 30 tác phẩm và sản phẩm thủ công mỹ nghệ độc bản được chế tác bởi nghệ nhân Việt Nam. Liên kết giới thiệu sản phẩm trực tiếp đến xưởng sản xuất uy tín." : 
               currentLang === "en" ? "A curated collection of 30 unique cultural masterpieces handcrafted by local Vietnamese artisans. Direct affiliate referrals to verified authentic craft studios." : 
               "精选30件由越南当地工匠精心制作的文化杰作商品。直接推荐联名购买渠道至经过验证的真实手工坊。"}
            </p>
          </header>

          {/* Filters */}
          <div id="shop-grid-header" className="flex flex-wrap items-center gap-2 mb-8 border-b border-stone-200 pb-4">
            {shopFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => handleFilterChange(filter.key)}
                className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 border
                  ${activeFilter === filter.key
                    ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                    : "bg-white text-stone-600 border-stone-200 hover:border-amber-500 hover:text-amber-600"
                  }`}
              >
                {filter.label[currentLang] || filter.label.vi}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <div 
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div 
                  className="relative aspect-square bg-stone-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img 
                    src={product.image || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600"} 
                    alt={product.title[currentLang] || product.title.vi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-amber-700 shadow-xs border border-amber-100 flex items-center gap-1">
                    <Tag size={10} />
                    {product.categoryName[currentLang] || product.categoryName.vi}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 
                      className="text-base font-semibold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.title[currentLang] || product.title.vi}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">
                      {product.summary[currentLang] || product.summary.vi}
                    </p>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] block text-stone-400 font-medium uppercase tracking-wider">
                        {currentLang === "vi" ? "Giá bán tham khảo" : currentLang === "en" ? "REF PRICE" : "参考售价"}
                      </span>
                      <span className="text-lg font-bold text-amber-600 font-serif">
                        {product.price.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>

                    {product.affiliateUrl ? (
                      <a
                        href={getAbsoluteUrl(product.affiliateUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-amber-200 transition-colors duration-200"
                      >
                        {currentLang === "vi" ? "Mua ngay" : currentLang === "en" ? "Buy Now" : "前往购买"}
                        <ArrowUpRight size={12} />
                      </a>
                    ) : (
                      <span className="text-[10px] text-stone-400 italic">
                        {currentLang === "vi" ? "Chưa có link" : currentLang === "en" ? "No Link" : "暂无链接"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center text-stone-500">
              <p className="text-lg font-medium">{currentLang === "vi" ? "Chưa có sản phẩm" : "No products found"}</p>
              <p className="text-sm mt-1">{currentLang === "vi" ? "Thử chọn danh mục khác nhé." : "Try selecting another category."}</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 border-t border-stone-200 pt-6">
              {/* Prev Button */}
              <button
                type="button"
                disabled={currentPageSafe === 1}
                onClick={() => handlePageChange(currentPageSafe - 1)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors cursor-pointer
                  ${currentPageSafe === 1
                    ? "text-stone-300 border-stone-200 bg-stone-50 cursor-not-allowed"
                    : "text-stone-600 border-stone-200 bg-white hover:border-amber-500 hover:text-amber-600"
                  }`}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold border transition-all cursor-pointer
                    ${currentPageSafe === page
                      ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/15"
                      : "bg-white text-stone-600 border-stone-200 hover:border-amber-500 hover:text-amber-600"
                    }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                type="button"
                disabled={currentPageSafe === totalPages}
                onClick={() => handlePageChange(currentPageSafe + 1)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors cursor-pointer
                  ${currentPageSafe === totalPages
                    ? "text-stone-300 border-stone-200 bg-stone-50 cursor-not-allowed"
                    : "text-stone-600 border-stone-200 bg-white hover:border-amber-500 hover:text-amber-600"
                  }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-8" role="dialog">
          <button 
            type="button"
            className="absolute inset-0 bg-stone-900/80 backdrop-blur-xs cursor-pointer"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Product Image */}
            <div className="md:w-1/2 bg-stone-100 flex items-center justify-center">
              <img 
                src={selectedProduct.image || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600"} 
                alt={selectedProduct.title[currentLang]} 
                className="w-full h-full object-cover max-h-[40vh] md:max-h-none"
              />
            </div>

            {/* Product Meta */}
            <div className="md:w-1/2 flex flex-col p-6 sm:p-8 overflow-y-auto">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 self-start mb-3">
                <Sparkles size={12} />
                {selectedProduct.categoryName[currentLang]}
              </span>

              <h2 
                className="text-2xl font-semibold text-stone-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {selectedProduct.title[currentLang]}
              </h2>

              {/* Price */}
              <div className="my-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-amber-900">
                  {currentLang === "vi" ? "Giá bán tham khảo" : currentLang === "en" ? "Reference Price" : "参考售价"}
                </span>
                <span className="text-2xl font-bold text-amber-600 font-serif">
                  {selectedProduct.price.toLocaleString("vi-VN")} ₫
                </span>
              </div>

              {/* Summary */}
              <p className="text-sm text-stone-600 leading-relaxed">
                {selectedProduct.summary[currentLang]}
              </p>

              {/* Details Bullet points */}
              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                  <Info size={13} />
                  {currentLang === "vi" ? "Đặc điểm nổi bật" : currentLang === "en" ? "Product Specifications" : "商品规格"}
                </h3>
                <ul className="space-y-2">
                  {(selectedProduct.details[currentLang] || selectedProduct.details.vi).map((detail, idx) => (
                    <li key={idx} className="text-xs text-stone-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Box */}
              <div className="mt-auto pt-6 border-t border-stone-100 flex gap-3">
                {selectedProduct.affiliateUrl ? (
                  <a
                    href={getAbsoluteUrl(selectedProduct.affiliateUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-stone-900 hover:bg-amber-600 text-white cursor-pointer transition-colors duration-200 shadow-md text-center"
                  >
                    <ExternalLink size={16} />
                    {currentLang === "vi" ? "Đến nơi bán sản phẩm" : currentLang === "en" ? "Go to Product Page" : "前往购买商品"}
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-stone-100 text-stone-400 cursor-not-allowed text-center border border-stone-200"
                  >
                    <ExternalLink size={16} />
                    {currentLang === "vi" ? "Chưa có liên kết mua" : currentLang === "en" ? "No Store Link" : "暂无购买链接"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
