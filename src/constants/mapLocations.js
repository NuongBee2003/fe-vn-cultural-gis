export const ALL_LOCATIONS = [
  {
    category: "Quán ăn",
    name: "Bún mắm Cô Ba",
    lat: 10.7718559,
    lng: 106.627455,
  },
  {
    category: "Quán ăn",
    name: "Gà Ta Quê Nhà",
    lat: 10.796356,
    lng: 106.630226,
  },
  { category: "Quán ăn", name: "Cháo Ếch Ú", lat: 10.795924, lng: 106.622225 },
  {
    category: "Quán cafe",
    name: "Tiệm trà Bốn Mùa",
    lat: 10.798938,
    lng: 106.639962,
  },
  {
    category: "Quán cafe",
    name: "Machiya Coffee",
    lat: 10.806638,
    lng: 106.730349,
  },
  {
    category: "Quán cafe",
    name: "XLIII Specialty Coffee",
    lat: 10.810025,
    lng: 106.732232,
  },
  {
    category: "Quán ăn",
    name: "OM Nướng - Ba Son",
    lat: 10.778701,
    lng: 106.710893,
  },
  { category: "Quán cafe", name: "CATFE", lat: 10.771811, lng: 106.68793 },
  { category: "Quán ăn", name: "Bún bò chú Há", lat: 10.77173, lng: 106.68571 },
  {
    category: "Di tích",
    name: "Bảo tàng Lịch sử TP.HCM",
    lat: 10.7793,
    lng: 106.7026,
  },
  { category: "Di tích", name: "Nhà thờ Đức Bà", lat: 10.7797, lng: 106.699 },
  { category: "Di tích", name: "Dinh Độc Lập", lat: 10.7763, lng: 106.6954 },
];

export const CATEGORY_STYLES = {
  "Quán ăn": {
    color: "var(--cat-quanan-color)",
    bg: "var(--cat-quanan-bg)",
    IconName: "UtensilsCrossed",
    markerColor: "var(--marker-quanan)",
  },
  "Quán cafe": {
    color: "var(--cat-quancafe-color)",
    bg: "var(--cat-quancafe-bg)",
    IconName: "Coffee",
    markerColor: "var(--marker-quancafe)",
  },
  "Di tích": {
    color: "var(--cat-ditich-color)",
    bg: "var(--cat-ditich-bg)",
    IconName: "Landmark",
    markerColor: "var(--marker-ditich)",
  },
};
