import { useEffect, useRef, useState } from "react";
import { Search, X, MapPin, Loader2, History, Trash2 } from "lucide-react";
import { searchPlaceLocationsByDB } from "@/api/locationApi";
import { useTranslation } from "react-i18next";

/**
 * SearchBar với dropdown gợi ý địa điểm và lịch sử tìm kiếm.
 * Props:
 *  - onSelectLocation(location) → gọi khi user click vào 1 kết quả cụ thể
 *  - onSearchSubmit(results, query) → gọi khi thực hiện tìm kiếm bằng Enter hoặc Click icon
 *  - onSearchClear() → gọi khi người dùng xóa nội dung tìm kiếm
 *  - initialValue → giá trị tìm kiếm ban đầu (ví dụ đồng bộ từ URL)
 */
export default function SearchBar({ onSelectLocation, onSearchSubmit, onSearchClear, initialValue = "", onHoverLocation }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const stored = localStorage.getItem("search_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // State phục vụ gợi ý tự động (khi người dùng ngừng gõ)
  const [suggestions, setSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  // State phục vụ tìm kiếm chính thức (khi nhấn Enter/Click kính lúp)
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync với initialValue khi thay đổi
  useEffect(() => {
    if (initialValue) {
      setInputValue(initialValue);
      handleSearch(initialValue);
    }
  }, [initialValue]);

  // Hiển thị gợi ý khi người dùng ngừng gõ 1.5 giây
  useEffect(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSearched) {
      setSuggestions([]);
      return;
    }

    setIsFetchingSuggestions(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchPlaceLocationsByDB(trimmed, 8);
        if (!isSearched) {
          setSuggestions(res);
        }
      } catch (err) {
        console.error("Lỗi khi tải gợi ý tự động:", err);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 1500); // 1.5 giây debounce

    return () => clearTimeout(timer);
  }, [inputValue, isSearched]);

  const addToHistory = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      localStorage.setItem("search_history", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteHistoryItem = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchHistory((prev) => {
      const updated = prev.filter((i) => i !== item);
      localStorage.setItem("search_history", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllHistory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem("search_history");
    setSearchHistory([]);
  };

  const handleSearch = async (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setIsSearched(true);
    setIsOpen(true);
    setInputValue(trimmed);
    addToHistory(trimmed);

    try {
      const res = await searchPlaceLocationsByDB(trimmed, 15);
      setSearchResults(res);
      onSearchSubmit?.(res, trimmed);
    } catch (err) {
      console.error("Tìm kiếm thất bại:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchResults([]);
    setSuggestions([]);
    setIsSearched(false);
    setIsOpen(false);
    onSearchClear?.();
    inputRef.current?.focus();
  };

  const handleSelect = (location) => {
    setIsOpen(false);
    setInputValue(location.name);
    onSelectLocation?.(location);
    addToHistory(location.name);
  };

  // Xác định dropdown có nên hiển thị không
  const showDropdown = isOpen && (inputValue.trim().length >= 1 || searchHistory.length > 0);

  return (
    <div
      ref={wrapperRef}
      className="relative pointer-events-auto w-full md:w-[340px] shrink-0"
    >
      {/* Input bar */}
      <div
        className={`flex items-center gap-2 bg-white px-4 py-2.5 shadow-lg w-full transition-all duration-200 ${
          showDropdown
            ? "rounded-t-2xl rounded-b-none border border-b-0 border-gray-200"
            : "rounded-full border border-transparent"
        }`}
      >
        {isLoading ? (
          <Loader2 size={15} className="text-[#B8922E] shrink-0 animate-spin" />
        ) : (
          <button
            type="button"
            onClick={() => handleSearch(inputValue)}
            className="p-0 bg-transparent border-none cursor-pointer flex items-center shrink-0 hover:text-[var(--brand-primary)] animate-fade-in"
            title={t("common.search")}
          >
            <Search size={15} className="text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        )}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            setInputValue(val);
            setIsSearched(false); // Reset trạng thái tìm kiếm chính thức khi gõ chữ
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(inputValue);
            }
          }}
          placeholder={t('map.searchPlaceholder')}
          className="flex-1 border-none outline-none text-[13.5px] text-gray-800 bg-transparent min-w-0"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="p-0 bg-transparent border-none cursor-pointer flex items-center shrink-0"
          >
            <X size={13} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown kết quả */}
      {showDropdown && (
        <div className="absolute left-0 right-0 bg-white border border-t-0 border-gray-200 rounded-b-2xl shadow-xl z-[2000] overflow-hidden">
          
          {/* TRƯỜNG HỢP 1: Ô tìm kiếm trống -> Hiển thị lịch sử tìm kiếm */}
          {!inputValue.trim() && searchHistory.length > 0 && (
            <div>
              <div className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span>{t("map.searchHistory")}</span>
                <button
                  type="button"
                  onClick={clearAllHistory}
                  className="text-[10px] text-red-500 hover:text-red-700 font-medium normal-case flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={11} />
                  {t("map.clearHistory")}
                </button>
              </div>
              <ul className="max-h-[320px] overflow-y-auto">
                {searchHistory.map((item, idx) => (
                  <li key={`hist-${idx}`} className="border-b border-gray-50 last:border-b-0">
                    <div className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                      <button
                        type="button"
                        onClick={() => handleSearch(item)}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        <History size={13} className="text-gray-400 shrink-0" />
                        <span className="text-[13px] text-gray-700 truncate">{item}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => deleteHistoryItem(e, item)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TRƯỜNG HỢP 2: Đang gõ chữ nhưng chưa Enter tìm kiếm chính thức */}
          {inputValue.trim().length >= 1 && !isSearched && (
            <div>

              {/* Loader gợi ý tự động */}
              {isFetchingSuggestions && suggestions.length === 0 && (
                <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400">
                  <Loader2 size={14} className="animate-spin text-[var(--brand-primary)]" />
                  {t('map.searching')}
                </div>
              )}

              {/* Danh sách gợi ý tự động (khi ngừng gõ) */}
              {suggestions.length > 0 && (
                <ul className="max-h-[250px] overflow-y-auto">
                  {suggestions.map((loc) => (
                    <li key={`sugg-${loc.placeId}-${loc.id}`} className="border-b border-gray-50 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => handleSelect(loc)}
                        onMouseEnter={() => onHoverLocation?.(loc)}
                        onMouseLeave={() => onHoverLocation?.(null)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-colors text-left group"
                      >
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-md"
                          style={{ backgroundColor: `${loc.markerColor}18` }}
                        >
                          {loc.iconMarker ? (
                            <img
                              src={loc.iconMarker}
                              alt=""
                              className="w-4 h-4 object-contain"
                            />
                          ) : (
                            <MapPin
                              size={14}
                              style={{ color: loc.markerColor || "#3b82f6" }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-800 truncate group-hover:text-[#B8922E] transition-colors">
                            {loc.name}
                          </p>
                          {loc.address && (
                            <p className="text-[11.5px] text-gray-400 truncate mt-0.5">
                              {loc.address}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Hiển thị các lịch sử tìm kiếm khớp nếu có */}
              {searchHistory.filter(item => item.toLowerCase().includes(inputValue.toLowerCase())).length > 0 && (
                <>
                  <div className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-t border-b border-gray-100">
                    {t("map.searchHistory")}
                  </div>
                  <ul className="max-h-[150px] overflow-y-auto">
                    {searchHistory
                      .filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))
                      .map((item, idx) => (
                        <li key={`matching-hist-${idx}`} className="border-b border-gray-50 last:border-b-0">
                          <div className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors">
                            <button
                              type="button"
                              onClick={() => handleSearch(item)}
                              className="flex-1 flex items-center gap-3 text-left"
                            >
                              <History size={12} className="text-gray-400 shrink-0" />
                              <span className="text-[12.5px] text-gray-600 truncate">{item}</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => deleteHistoryItem(e, item)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* TRƯỜNG HỢP 3: Đang tải kết quả tìm kiếm chính thức */}
          {isLoading && (
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400">
              <Loader2 size={14} className="animate-spin text-[var(--brand-primary)]" />
              {t('map.searching')}
            </div>
          )}

          {/* TRƯỜNG HỢP 4: Đã thực hiện tìm kiếm chính thức xong */}
          {isSearched && !isLoading && (
            <>
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400">
                  {t('map.noResults')}
                </div>
              ) : (
                <ul className="max-h-[320px] overflow-y-auto">
                  {searchResults.map((loc) => (
                    <li key={`search-result-${loc.placeId}-${loc.id}`} className="border-b border-gray-50 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => handleSelect(loc)}
                        onMouseEnter={() => onHoverLocation?.(loc)}
                        onMouseLeave={() => onHoverLocation?.(null)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-colors text-left group"
                      >
                        {/* Icon */}
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-md"
                          style={{ backgroundColor: `${loc.markerColor}18` }}
                        >
                          {loc.iconMarker ? (
                            <img
                              src={loc.iconMarker}
                              alt=""
                              className="w-4 h-4 object-contain"
                            />
                          ) : (
                            <MapPin
                              size={14}
                              style={{ color: loc.markerColor || "#3b82f6" }}
                            />
                          )}
                        </div>

                        {/* Nội dung */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-800 truncate group-hover:text-[#B8922E] transition-colors">
                            {loc.name}
                          </p>
                          {loc.address && (
                            <p className="text-[11.5px] text-gray-400 truncate mt-0.5">
                              {loc.address}
                            </p>
                          )}
                        </div>

                        {/* Category badge */}
                        {loc.category && loc.category !== "Khác" && (
                          <span
                            className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${loc.markerColor}20`,
                              color: loc.markerColor || "#3b82f6",
                            }}
                          >
                            {loc.category}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Divider + hint */}
              {searchResults.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2 text-[11px] text-gray-400">
                  {searchResults.length} {t('map.resultsHint')}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
