export const REGIONS = {
  north: {
    id: "north",
    label: "Miền Bắc",
    provinces: [
      "Hà Nội", "Hải Phòng", "Bắc Ninh", "Hà Nam", "Hải Dương", 
      "Hưng Yên", "Nam Định", "Ninh Bình", "Thái Bình", "Vĩnh Phúc", 
      "Quảng Ninh", "Hà Giang", "Cao Bằng", "Bắc Kạn", "Tuyên Quang", 
      "Lào Cai", "Điện Biên", "Lai Châu", "Sơn La", "Yên Bái", 
      "Hòa Bình", "Thái Nguyên", "Lạng Sơn", "Bắc Giang", "Phú Thọ"
    ]
  },
  central: {
    id: "central",
    label: "Miền Trung",
    provinces: [
      "Đà Nẵng", "Thừa Thiên Huế", "Quảng Nam", "Quảng Ngãi", "Bình Định", 
      "Phú Yên", "Khánh Hòa", "Ninh Thuận", "Bình Thuận", "Thanh Hóa", 
      "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị"
    ]
  },
  highland: {
    id: "highland",
    label: "Tây Nguyên",
    provinces: [
      "Lâm Đồng", "Đắk Lắk", "Gia Lai", "Kon Tum", "Đắk Nông"
    ]
  },
  south: {
    id: "south",
    label: "Miền Nam",
    provinces: [
      "TP. Hồ Chí Minh", "Bà Rịa - Vũng Tàu", "Bình Dương", "Bình Phước", "Đồng Nai", 
      "Tây Ninh", "An Giang", "Bạc Liêu", "Bến Tre", "Cà Mau", 
      "Cần Thơ", "Đồng Tháp", "Hậu Giang", "Kiên Giang", "Long An", 
      "Sóc Trăng", "Tiền Giang", "Trà Vinh", "Vĩnh Long"
    ]
  }
};

// Danh sách phẳng 63 tỉnh thành được sắp xếp theo bảng chữ cái tiếng Việt
export const ALL_PROVINCES = Object.values(REGIONS).reduce((acc, region) => {
  return [...acc, ...region.provinces];
}, []).sort((a, b) => a.localeCompare(b, 'vi'));

/**
 * Tìm kiếm vùng miền của một tỉnh thành
 * @param {string} provinceName - Tên tỉnh thành
 * @returns {string} - key của vùng miền ('north', 'central', 'south', 'highland') hoặc 'south' nếu không tìm thấy
 */
export const getRegionByProvince = (provinceName) => {
  if (!provinceName) return 'south';
  const name = provinceName.trim().toLowerCase();
  
  for (const regionKey of Object.keys(REGIONS)) {
    const found = REGIONS[regionKey].provinces.some(p => p.toLowerCase() === name);
    if (found) return regionKey;
  }
  
  // Hỗ trợ nhận diện các từ khóa linh hoạt nếu là text tự do cũ
  if (name.includes("hà nội") || name.includes("bắc")) return "north";
  if (name.includes("huế") || name.includes("quảng") || name.includes("đà nẵng") || name.includes("trung")) return "central";
  if (name.includes("tây nguyên") || name.includes("đắk") || name.includes("gia lai") || name.includes("kon tum") || name.includes("lâm đồng")) return "highland";
  
  return 'south';
};
