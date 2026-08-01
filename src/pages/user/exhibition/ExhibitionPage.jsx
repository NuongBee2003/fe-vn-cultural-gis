import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Images, Loader2, Plus } from "lucide-react";
import {
  EXHIBITION_FILTERS,
  EXHIBITION_SORT_OPTIONS,
} from "@/constants/exhibition";
import ExhibitionFilters from "@/components/user/exhibition/ExhibitionFilters";
import ExhibitionCard from "@/components/user/exhibition/ExhibitionCard";
import ExhibitionLightbox from "@/components/user/exhibition/ExhibitionLightbox";
import CreateExhibitionModal from "@/components/user/exhibition/CreateExhibitionModal";
import { getExhibitions } from "@/api/user/exhibitionApi";
import { useNotify } from "@/context/NotifyContext";

export default function ExhibitionPage() {
  const notify = useNotify();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [isLogin, setIsLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("explore");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    setIsLogin(localStorage.getItem("isLogin") === "true" || !!token);

    const userRaw = localStorage.getItem("user") || localStorage.getItem("adminUser");
    if (userRaw) {
      try {
        setCurrentUser(JSON.parse(userRaw));
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [createModalOpen]);

  const fetchExhibitions = async () => {
    try {
      setLoading(true);
      const data = await getExhibitions();
      const normalized = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        author: item.user?.username || "Hệ thống",
        category: item.category,
        styleTag: item.style_tag,
        placeName: item.place_name,
        province: item.province,
        likes: item.likes || 0,
        createdAt: item.created_at,
        userId: item.user_id,
        status: item.status,
      }));
      setItems(normalized);
    } catch (err) {
      console.error("Lỗi khi tải triển lãm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const handlePostClick = async () => {
    if (!isLogin) {
      const ok = await notify.confirm(
        "Bạn cần đăng nhập để có thể đăng tác phẩm triển lãm ảo của riêng mình. Bạn có muốn đi tới trang đăng nhập ngay không?",
        {
          title: "Yêu cầu đăng nhập",
          confirmLabel: "Đăng nhập",
          cancelLabel: "Hủy",
        }
      );
      if (ok) {
        navigate("/login");
      }
      return;
    }
    setCreateModalOpen(true);
  };

  const handleExhibitionCreated = () => {
    fetchExhibitions();
    setActiveTab("mine");
  };

  // Lấy danh sách các tỉnh thành thực tế đang có tác phẩm triển lãm để hiển thị ở bộ lọc
  const availableProvinces = useMemo(() => {
    const provSet = new Set();
    items.forEach((item) => {
      if ((item.status === "accepted" || item.status === undefined) && item.province) {
        provSet.add(item.province);
      }
    });
    return Array.from(provSet).sort((a, b) => a.localeCompare(b, "vi"));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeTab === "mine") {
      return items.filter((item) => Number(item.userId) === Number(currentUser?.id));
    }

    // explore tab
    let list = items.filter((item) => item.status === "accepted");

    if (activeFilter !== "all") {
      list = list.filter((item) => item.category === activeFilter);
    }

    if (selectedProvince !== "all") {
      list = list.filter((item) => item.province === selectedProvince);
    }

    if (sortBy === "likes") {
      list = [...list].sort((a, b) => b.likes - a.likes);
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return list;
  }, [items, activeTab, activeFilter, selectedProvince, sortBy, currentUser]);

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-stone-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
                <Images size={14} />
                Trải nghiệm — Triển lãm ảo
              </p>
              <h1
                className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Không gian văn hóa số
              </h1>
              <p className="mt-3 text-sm leading-6 text-stone-550 max-w-2xl">
                Khám phá tác phẩm nghệ thuật từ cộng đồng — nét đẹp ẩm thực, địa điểm và lễ hội văn hóa Việt Nam.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePostClick}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Plus size={16} />
              Đăng tác phẩm
            </button>
          </header>

          {isLogin && (
            <div className="flex border-b border-stone-200 mb-6 gap-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("explore");
                  setActiveFilter("all");
                  setSelectedProvince("all");
                }}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 relative ${
                  activeTab === "explore"
                    ? "border-amber-600 text-amber-700 font-bold"
                    : "border-transparent text-stone-500 hover:text-stone-850"
                }`}
              >
                Khám phá triển lãm
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("mine");
                  setActiveFilter("all");
                  setSelectedProvince("all");
                }}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 relative ${
                  activeTab === "mine"
                    ? "border-amber-600 text-amber-700 font-bold"
                    : "border-transparent text-stone-500 hover:text-stone-850"
                }`}
              >
                Tác phẩm của tôi
              </button>
            </div>
          )}

          {activeTab === "explore" && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <ExhibitionFilters
                filters={EXHIBITION_FILTERS}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Dropdown lọc theo Tỉnh thành */}
                <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg border border-stone-200 shadow-xs min-w-[200px]">
                  <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">Tỉnh/TP:</span>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none text-stone-700 cursor-pointer"
                  >
                    <option value="all">Tất cả tỉnh thành</option>
                    {availableProvinces.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sắp xếp */}
                <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-sm font-semibold outline-none text-stone-700 cursor-pointer"
                  >
                    {EXHIBITION_SORT_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-500">
              <Loader2 className="animate-spin h-8 w-8 text-amber-600" />
              <p className="text-sm">Đang tải không gian triển lãm...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center text-stone-500 bg-white rounded-2xl border border-stone-150 p-8 shadow-xs">
              <p className="text-lg font-medium text-stone-700">Chưa có tác phẩm</p>
              <p className="text-sm text-stone-400 mt-1">
                {activeTab === "mine"
                  ? "Bạn chưa đăng tác phẩm triển lãm nào. Hãy chia sẻ tác phẩm của bạn nhé!"
                  : "Thử chọn bộ lọc khác nhé."}
              </p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
              {filteredItems.map((item) => (
                <ExhibitionCard
                  key={item.id}
                  item={item}
                  onClick={setSelectedItem}
                  showStatus={activeTab === "mine"}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <ExhibitionLightbox
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onLikeUpdate={(id, newLikes) => {
            setItems((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, likes: newLikes } : item
              )
            );
            setSelectedItem((prev) =>
              prev && prev.id === id ? { ...prev, likes: newLikes } : prev
            );
          }}
        />
      )}

      {createModalOpen && (
        <CreateExhibitionModal
          onClose={() => setCreateModalOpen(false)}
          onExhibitionCreated={handleExhibitionCreated}
        />
      )}
    </div>
  );
}
