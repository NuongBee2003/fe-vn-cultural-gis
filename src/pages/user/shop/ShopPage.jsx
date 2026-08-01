import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { productApi } from "@/api/business/productApi";
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

const IMAGE_MAP = {
  "combo_sang_thu": comboSangThu,
  "non_la_sen": nonLaSen,
  "tui_co_bang_hoi_an": tuiCoBangHoiAn,
  "quat_thu_phap": quatThuPhap,
  "khan_lua_ha_dong": khanLuaHaDong,
  "phin_cafe_bat_trang": phinCafeBatTrang,
  "tranh_son_mai": tranhSonMai,
  "combo_hoa_dao": comboHoaDao
};

const getCategoryName = (category) => {
  switch (category) {
    case "combo":
      return { vi: "Combo nghệ thuật", en: "Artistic Combo", zh: "艺术组合" };
    case "hat":
      return { vi: "Nón nghệ thuật", en: "Art Hats", zh: "艺术竹笠" };
    case "bag":
      return { vi: "Túi cỏ bàng", en: "Sedge Bags", zh: "蒲草包" };
    case "artwork":
      return { vi: "Tranh nghệ thuật", en: "Artworks", zh: "美术漆画" };
    case "accessory":
      return { vi: "Phụ kiện", en: "Accessories", zh: "文化配件" };
    default:
      return { vi: "Sản phẩm doanh nghiệp", en: "Business Products", zh: "商家 sản phẩm" };
  }
};

const getProductImage = (image_url) => {
  if (!image_url) return null;
  if (IMAGE_MAP[image_url]) {
    return IMAGE_MAP[image_url];
  }
  return image_url;
};

export default function ShopPage() {
  const { i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const currentLang = i18n.language || "vi";

  // 30 Products Data Dataset
  const STATIC_PRODUCTS = [];

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
    return dbProducts.map((p) => ({
      id: `db-${p.id}`,
      title: {
        vi: p.name,
        en: p.name,
        zh: p.name
      },
      category: p.category || "custom",
      categoryName: getCategoryName(p.category),
      price: Number(p.price),
      image: getProductImage(p.image_url),
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
