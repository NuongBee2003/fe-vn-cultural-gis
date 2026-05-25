import Aulac from "@/assets/img/history/aulac.jpg";
import DongSon from "@/assets/img/history/dongson.jpg";
import ThanhCoLoa from "@/assets/img/history/thanhcoloa.jpg";
import VanLang from "@/assets/img/history/vanlang.jpg";
import TrungThu from "@/assets/img/holiday/trung-thu.jpg";
import GioTo from "@/assets/img/holiday/gio-to-hung-vuong.jpg";
import LunarNewYear from "@/assets/img/holiday/lunar-newyear.jpg";
import VnCulture from "@/assets/img/holiday/vnculture.jpg";

/**
 * Fake data cho trang Cộng đồng (user-facing).
 * Structure bám theo schema DB: posts/comments/assets/post_likes.
 */

/** @type {{ id: number; name: string }[]} */
export const COMMUNITY_USERS = [
  { id: 1, name: "Minh Anh" },
  { id: 2, name: "Quang Huy" },
  { id: 3, name: "Thu Hà" },
  { id: 4, name: "Ngọc Bích" },
];

/** @type {{ id: number; name: string }[]} */
export const COMMUNITY_LOCATIONS = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "Phú Thọ" },
  { id: 3, name: "TP.HCM" },
  { id: 4, name: "Huế" },
  { id: 5, name: "Hội An" },
];

/** @type {{ id: number; user_id: number; location_id: number | null; category: string; title: string; content: string; status: "published" | "pending"; created_at: string }[]} */
export const COMMUNITY_POSTS = [
  {
    id: 101,
    user_id: 1,
    location_id: 1,
    category: "Di tích",
    title: "Một chiều ở Thành Cổ Loa: đi một vòng là thấy lịch sử",
    content:
      "Mình ghé Cổ Loa vào một buổi chiều mát. Đi chậm, nhìn tường thành và hào nước, tự nhiên tưởng tượng ra cả một thời kỳ.",
    status: "published",
    created_at: "2026-05-24T14:08:31.000Z",
  },
  {
    id: 102,
    user_id: 2,
    location_id: null,
    category: "Lịch sử",
    title: "Trống đồng Đông Sơn – không chỉ là biểu tượng",
    content:
      "Có dịp xem hiện vật trống đồng, mình mới thấy chi tiết hoa văn tinh xảo đến mức nào. Mỗi vòng họa tiết như kể một câu chuyện.",
    status: "published",
    created_at: "2026-05-23T09:22:10.000Z",
  },
  {
    id: 103,
    user_id: 3,
    location_id: 2,
    category: "Lễ hội",
    title: "Giỗ Tổ Hùng Vương: đi lễ sao cho văn minh",
    content:
      "Nếu đi đền Hùng dịp Giỗ Tổ, mọi người nên đi sớm, giữ trật tự, không chen lấn. Mang theo nước, đội nón và hạn chế đồ nhựa dùng một lần.",
    status: "pending",
    created_at: "2026-05-22T03:18:00.000Z",
  },
  {
    id: 104,
    user_id: 4,
    location_id: 3,
    category: "Văn hóa",
    title: "Tết Trung Thu: ký ức đèn lồng và tiếng trống lân",
    content:
      "Nhắc Trung Thu là nhớ đèn ông sao, bánh nướng bánh dẻo, và cả mùi hương của những tối rước đèn. Giờ lớn rồi vẫn thấy nôn nao.",
    status: "published",
    created_at: "2026-05-21T11:40:12.000Z",
  },
  {
    id: 105,
    user_id: 1,
    location_id: 1,
    category: "Lịch sử",
    title: "Âu Lạc trong tưởng tượng của mình",
    content:
      "Mình đọc vài tư liệu và thử ghép lại bức tranh thời Âu Lạc. Không phải để kết luận, chỉ là một góc nhìn cá nhân khi đi tham quan.",
    status: "published",
    created_at: "2026-05-20T16:05:00.000Z",
  },
  {
    id: 106,
    user_id: 2,
    location_id: null,
    category: "Lịch sử",
    title: "Văn Lang – câu chuyện bắt đầu từ đâu?",
    content:
      "Có nhiều truyền thuyết và cũng có nhiều tranh luận. Mình muốn nghe thêm chia sẻ của mọi người về cách tiếp cận lịch sử ở trường học.",
    status: "pending",
    created_at: "2026-05-19T08:10:02.000Z",
  },
  {
    id: 107,
    user_id: 3,
    location_id: 5,
    category: "Lễ hội",
    title: "Tết Nguyên Đán: điều mình giữ lại mỗi năm",
    content:
      "Tết với mình là dọn dẹp nhà cửa, thắp hương cho ông bà, và một bữa cơm đủ mặt. Không cần cầu kỳ, chỉ cần ấm.",
    status: "published",
    created_at: "2026-05-18T05:33:45.000Z",
  },
  {
    id: 108,
    user_id: 4,
    location_id: 4,
    category: "Văn hóa",
    title: "Một góc Việt Nam qua ảnh: sắc màu văn hóa",
    content:
      "Mình tổng hợp vài bức ảnh sưu tầm để cùng mọi người thảo luận về màu sắc – trang phục – lễ hội ở từng vùng.",
    status: "published",
    created_at: "2026-05-17T13:02:18.000Z",
  },
];

/** @type {{ id: number; url: any; is_primary: 0 | 1; post_id: number }[]} */
export const COMMUNITY_ASSETS = [
  { id: 1001, url: ThanhCoLoa, is_primary: 1, post_id: 101 },
  { id: 1002, url: Aulac, is_primary: 0, post_id: 101 },

  { id: 1003, url: DongSon, is_primary: 1, post_id: 102 },

  { id: 1004, url: GioTo, is_primary: 1, post_id: 103 },

  { id: 1005, url: TrungThu, is_primary: 1, post_id: 104 },

  { id: 1006, url: Aulac, is_primary: 1, post_id: 105 },
  { id: 1007, url: ThanhCoLoa, is_primary: 0, post_id: 105 },

  { id: 1008, url: VanLang, is_primary: 1, post_id: 106 },

  { id: 1009, url: LunarNewYear, is_primary: 1, post_id: 107 },

  { id: 1010, url: VnCulture, is_primary: 1, post_id: 108 },
  { id: 1011, url: DongSon, is_primary: 0, post_id: 108 },
];

/** @type {{ id: number; post_id: number; user_id: number; content: string; created_at: string }[]} */
export const COMMUNITY_COMMENTS = [
  {
    id: 2001,
    post_id: 101,
    user_id: 2,
    content: "Cổ Loa đi ngày thường chắc dễ thở hơn dịp lễ nhỉ?",
    created_at: "2026-05-24T15:02:00.000Z",
  },
  {
    id: 2002,
    post_id: 101,
    user_id: 4,
    content: "Mình thích đoạn bạn mô tả đi chậm và nhìn hào nước — rất ‘chạm’.",
    created_at: "2026-05-24T15:40:10.000Z",
  },
  {
    id: 2003,
    post_id: 102,
    user_id: 1,
    content: "Hoa văn trên trống đồng nhìn gần mới thấy đẹp thật!",
    created_at: "2026-05-23T10:12:30.000Z",
  },
  {
    id: 2004,
    post_id: 104,
    user_id: 3,
    content: "Trung Thu giờ khác xưa nhưng cảm giác vẫn y vậy.",
    created_at: "2026-05-21T13:01:00.000Z",
  },
  {
    id: 2005,
    post_id: 106,
    user_id: 4,
    content: "Mình nghĩ nên học lịch sử qua trải nghiệm thực địa nhiều hơn.",
    created_at: "2026-05-19T09:00:00.000Z",
  },
  {
    id: 2006,
    post_id: 108,
    user_id: 2,
    content: "Ảnh đẹp quá, nhìn là muốn đi ngay.",
    created_at: "2026-05-17T14:20:00.000Z",
  },
];

/** @type {{ user_id: number; post_id: number; created_at: string }[]} */
export const COMMUNITY_POST_LIKES = [
  { user_id: 2, post_id: 101, created_at: "2026-05-24T14:20:00.000Z" },
  { user_id: 3, post_id: 101, created_at: "2026-05-24T14:55:00.000Z" },
  { user_id: 4, post_id: 101, created_at: "2026-05-24T15:10:00.000Z" },

  { user_id: 1, post_id: 102, created_at: "2026-05-23T09:40:00.000Z" },
  { user_id: 4, post_id: 102, created_at: "2026-05-23T10:01:00.000Z" },

  { user_id: 1, post_id: 104, created_at: "2026-05-21T12:00:00.000Z" },

  { user_id: 2, post_id: 105, created_at: "2026-05-20T16:12:00.000Z" },
  { user_id: 3, post_id: 105, created_at: "2026-05-20T16:20:00.000Z" },

  { user_id: 1, post_id: 107, created_at: "2026-05-18T06:10:00.000Z" },
  { user_id: 2, post_id: 107, created_at: "2026-05-18T06:12:00.000Z" },
  { user_id: 4, post_id: 107, created_at: "2026-05-18T06:40:00.000Z" },

  { user_id: 1, post_id: 108, created_at: "2026-05-17T13:40:00.000Z" },
  { user_id: 3, post_id: 108, created_at: "2026-05-17T13:55:00.000Z" },
];
