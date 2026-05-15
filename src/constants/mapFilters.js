export const FILTERS = [
  { key: "all", label: "Tất cả", icon: null },
  { key: "Quán ăn", label: "Quán ăn", icon: null },
  { key: "Quán cafe", label: "Cà phê", icon: null },
  { key: "Di tích", label: "Di tích", icon: null },
];

export const FILTER_ACTIVE_STYLE = {
  all: {
    borderColor: "var(--brand-primary)",
    background: "var(--brand-primary-15)",
    color: "var(--brand-primary)",
  },
  "Quán ăn": {
    borderColor: "var(--cat-quanan-color)",
    background: "var(--cat-quanan-bg)",
    color: "var(--cat-quanan-color)",
  },
  "Quán cafe": {
    borderColor: "var(--cat-quancafe-color)",
    background: "var(--cat-quancafe-bg)",
    color: "var(--cat-quancafe-color)",
  },
  "Di tích": {
    borderColor: "var(--cat-ditich-color)",
    background: "var(--cat-ditich-bg)",
    color: "var(--cat-ditich-color)",
  },
};

export const ALL_LOCATIONS_COUNT = 12;
