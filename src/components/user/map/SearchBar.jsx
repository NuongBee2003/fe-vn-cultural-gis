import { useEffect, useRef, useState } from "react";
import { Search, X, MapPin, Loader2 } from "lucide-react";
import { useSearchLocations } from "@/api/useLocationQuery";
import { useTranslation } from "react-i18next";

/**
 * SearchBar với dropdown gợi ý địa điểm.
 * Props:
 *  - onSelectLocation(location) → gọi khi user click vào 1 kết quả
 */
export default function SearchBar({ onSelectLocation }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce 350ms trước khi gọi API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 350);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Mở dropdown khi có query
  useEffect(() => {
    if (debouncedQuery.trim().length >= 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery]);

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

  const { data: results = [], isFetching } = useSearchLocations(debouncedQuery, 8);

  const handleClear = () => {
    setInputValue("");
    setDebouncedQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelect = (location) => {
    setIsOpen(false);
    setInputValue("");
    setDebouncedQuery("");
    onSelectLocation?.(location);
  };

  const showDropdown = isOpen && debouncedQuery.trim().length >= 1;

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
        {isFetching ? (
          <Loader2 size={15} className="text-[#B8922E] shrink-0 animate-spin" />
        ) : (
          <Search size={15} className="text-gray-400 shrink-0" />
        )}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (debouncedQuery.trim().length >= 1) setIsOpen(true);
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
          {isFetching && results.length === 0 ? (
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400">
              <Loader2 size={14} className="animate-spin" />
              {t('map.searching')}
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">
              {t('map.noResults')}
            </div>
          ) : (
            <ul className="max-h-[320px] overflow-y-auto">
              {results.map((loc) => (
                <li key={`${loc.placeId}-${loc.id}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                  >
                    {/* Icon */}
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
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
                      <p className="text-[13.5px] font-semibold text-gray-800 truncate group-hover:text-[#B8922E] transition-colors">
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
          {results.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2 text-[11px] text-gray-400">
              {results.length} {t('map.resultsHint')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
