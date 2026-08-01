/**
 * LocationFormModal.jsx
 * Form modal để tạo mới hoặc cập nhật địa điểm (Place) kèm danh sách chi nhánh (Locations).
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { uploadImageToSupabase, deleteImageFromSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS, IMAGE_UPLOAD_CONFIG } from "@/constants/supabaseConfig";
import { useCategories } from "@/api/useLocationQuery";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createCustomIcon } from "@/utils/icons";
import { X, MapPin } from "lucide-react";

// Helper component to handle map sizing in modal
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Helper component to change map center
function ChangeMapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

// Helper component to handle map click events
function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function LocationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const isBusinessPage = window.location.pathname.startsWith("/business");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  // Trạng thái danh sách chi nhánh (locations)
  const [locations, setLocations] = useState([
    { address: "", lat: "", lng: "", imagePreviews: [] }
  ]);
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  // ── Danh mục ─────────────────────────────────────────────
  const { data: rawCategories = [] } = useCategories();
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  // ── Reset/Sync khi mở / đóng ──────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setCategoryId(initialData.category_id ?? initialData.categoryId ?? "");
      
      const mappedLocs = (initialData.locations || []).map((loc) => {
        // Sắp xếp assets: is_primary lên đầu
        const sortedAssets = [...(loc.assets || [])].sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return (a.id || 0) - (b.id || 0);
        });
        const imagePreviews = sortedAssets.map((asset) => ({
          file: null,
          url: asset.url
        }));
        return {
          id: loc.id,
          address: loc.address || "",
          lat: loc.lat != null ? String(loc.lat) : "",
          lng: loc.lng != null ? String(loc.lng) : "",
          imagePreviews
        };
      });

      setLocations(mappedLocs.length > 0 ? mappedLocs : [{ address: "", lat: "", lng: "", imagePreviews: [] }]);
      setActiveLocationIndex(0);
    } else {
      setName("");
      setDescription("");
      setCategoryId("");
      setLocations([{ address: "", lat: "", lng: "", imagePreviews: [] }]);
      setActiveLocationIndex(0);
    }
    setErrors({});
    setNotification(null);
    setSearchSuggestions([]);
    setShouldSearch(false);
  }, [isOpen, initialData]);

  // ── Debounce tự động tìm kiếm địa chỉ cho chi nhánh đang active ──
  const activeLoc = locations[activeLocationIndex] || { address: "", lat: "", lng: "", imagePreviews: [] };

  useEffect(() => {
    if (!shouldSearch) return;

    if (!activeLoc.address.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearchAddress(activeLoc.address);
      setShouldSearch(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeLoc.address, shouldSearch]);

  // Helper để cập nhật thông tin chi nhánh active
  const updateActiveLocation = (fields) => {
    setLocations((prev) => {
      const next = [...prev];
      next[activeLocationIndex] = {
        ...next[activeLocationIndex],
        ...fields
      };
      return next;
    });
  };

  const handleAddLocation = () => {
    setLocations((prev) => [
      ...prev,
      { address: "", lat: "", lng: "", imagePreviews: [] }
    ]);
    setActiveLocationIndex(locations.length);
  };

  const handleRemoveLocation = (indexToRemove) => {
    if (locations.length <= 1) return;
    
    // Revoke các object URL của blob ảnh mới trước khi xóa khỏi state
    const targetLoc = locations[indexToRemove];
    if (targetLoc && targetLoc.imagePreviews) {
      targetLoc.imagePreviews.forEach(item => {
        if (item.url && item.url.startsWith("blob:")) {
          URL.revokeObjectURL(item.url);
        }
      });
    }

    setLocations((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (activeLocationIndex >= indexToRemove && activeLocationIndex > 0) {
      setActiveLocationIndex((prev) => prev - 1);
    }
  };

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = "Tên địa điểm không được để trống";
    } else if (name.trim().length < 2) {
      errs.name = "Tên phải có ít nhất 2 ký tự";
    }

    locations.forEach((loc, idx) => {
      if (!loc.address.trim()) {
        errs[`loc_${idx}_address`] = "Địa chỉ chi nhánh không được để trống";
      }
      if (!loc.lat || isNaN(Number(loc.lat))) {
        errs[`loc_${idx}_lat`] = "Vĩ độ phải là số";
      } else if (Number(loc.lat) < -90 || Number(loc.lat) > 90) {
        errs[`loc_${idx}_lat`] = "Vĩ độ: -90 đến 90";
      }
      if (!loc.lng || isNaN(Number(loc.lng))) {
        errs[`loc_${idx}_lng`] = "Kinh độ phải là số";
      } else if (Number(loc.lng) < -180 || Number(loc.lng) > 180) {
        errs[`loc_${idx}_lng`] = "Kinh độ: -180 đến 180";
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Xử lý chọn file ──────────────────────────────────────
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const fileErrors = [];
    const newPreviews = [];

    for (const file of files) {
      if (!IMAGE_UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        fileErrors.push(`"${file.name}": định dạng không hỗ trợ`);
        continue;
      }
      if (file.size > IMAGE_UPLOAD_CONFIG.MAX_SIZE_BYTES) {
        fileErrors.push(`"${file.name}": vượt ${IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB}MB`);
        continue;
      }
      newPreviews.push({ file, url: URL.createObjectURL(file) });
    }

    if (fileErrors.length) {
      setNotification({ type: "error", message: fileErrors.join("\n") });
    }

    updateActiveLocation({
      imagePreviews: [...(activeLoc.imagePreviews || []), ...newPreviews]
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Xóa ảnh ─────────────────────────────────────────────
  const handleRemoveImage = (index) => {
    const nextPreviews = [...(activeLoc.imagePreviews || [])];
    const removedItem = nextPreviews[index];
    if (removedItem.file && removedItem.url.startsWith("blob:")) {
      URL.revokeObjectURL(removedItem.url);
    }
    nextPreviews.splice(index, 1);
    updateActiveLocation({ imagePreviews: nextPreviews });
  };

  // ── Đặt ảnh primary (đưa lên đầu) ───────────────────────
  const handleSetPrimary = (index) => {
    const nextPreviews = [...(activeLoc.imagePreviews || [])];
    const [item] = nextPreviews.splice(index, 1);
    nextPreviews.unshift(item);
    updateActiveLocation({ imagePreviews: nextPreviews });
  };

  // ── Field changes ────────────────────────────────────────
  const handlePlaceFieldChange = (e) => {
    const { name: fieldName, value } = e.target;
    if (fieldName === "name") setName(value);
    if (fieldName === "description") setDescription(value);
    if (fieldName === "category_id") setCategoryId(value);
    if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleLocationFieldChange = (e) => {
    const { name: fieldName, value } = e.target;
    updateActiveLocation({ [fieldName]: value });
    
    const errKey = `loc_${activeLocationIndex}_${fieldName}`;
    if (errors[errKey]) setErrors((prev) => ({ ...prev, [errKey]: "" }));
    
    if (fieldName === "address") {
      setShouldSearch(true);
    }
  };

  const handleSearchAddress = async (query) => {
    if (!query || !query.trim()) return;
    setShouldSearch(false);
    setIsSearchingAddress(true);
    setSearchSuggestions([]);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=5&addressdetails=1`;
      const resp = await fetch(url, { headers: { "Accept-Language": "vi" } });
      const results = await resp.json();
      setSearchSuggestions(results || []);
      if (!results || results.length === 0) {
        setNotification({ type: "error", message: "Không tìm thấy địa chỉ nào khớp." });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setNotification({ type: "error", message: "Lỗi kết nối dịch vụ tìm kiếm địa chỉ." });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "vi" } }
      );
      const data = await resp.json();
      if (data && data.display_name) {
        updateActiveLocation({ address: data.display_name });
        const errKey = `loc_${activeLocationIndex}_address`;
        if (errors[errKey]) setErrors((prev) => ({ ...prev, [errKey]: "" }));
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  const handleMapClick = (latlng) => {
    updateActiveLocation({
      lat: String(latlng.lat.toFixed(6)),
      lng: String(latlng.lng.toFixed(6)),
    });
    const latErrKey = `loc_${activeLocationIndex}_lat`;
    const lngErrKey = `loc_${activeLocationIndex}_lng`;
    if (errors[latErrKey] || errors[lngErrKey]) {
      setErrors((prev) => ({ ...prev, [latErrKey]: "", [lngErrKey]: "" }));
    }
    reverseGeocode(latlng.lat, latlng.lng);
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsUploading(true);
      setNotification(null);

      // Upload ảnh cho từng chi nhánh
      const finalLocations = [];
      for (const loc of locations) {
        const uploadedUrls = await Promise.all(
          (loc.imagePreviews || []).map(async (item) => {
            if (item.file) {
              return await uploadImageToSupabase(item.file, SUPABASE_BUCKETS.LOCATION_IMAGES);
            }
            return item.url;
          })
        );

        // Dọn dẹp ảnh cũ trên Supabase Storage nếu bị xóa
        if (initialData && loc.id) {
          const originalLoc = (initialData.locations || []).find((l) => l.id === loc.id);
          if (originalLoc && originalLoc.assets) {
            const prevUrls = originalLoc.assets.map((a) => a.url);
            const deletedUrls = prevUrls.filter((url) => !uploadedUrls.includes(url));
            for (const imgUrl of deletedUrls) {
              if (imgUrl && imgUrl.includes("supabase.co")) {
                try {
                  await deleteImageFromSupabase(imgUrl, SUPABASE_BUCKETS.LOCATION_IMAGES);
                } catch (err) {
                  console.error("Lỗi xóa ảnh cũ trên Supabase:", err);
                }
              }
            }
          }
        }

        finalLocations.push({
          ...(loc.id && { id: loc.id }),
          address: loc.address.trim(),
          lat: Number(loc.lat),
          lng: Number(loc.lng),
          images: uploadedUrls
        });
      }

      // Xóa ảnh của các chi nhánh bị xóa hoàn toàn khỏi Place
      if (initialData && initialData.locations) {
        const incomingIds = locations.filter((l) => l.id).map((l) => l.id);
        const removedLocs = initialData.locations.filter((l) => !incomingIds.includes(l.id));
        for (const rloc of removedLocs) {
          if (rloc.assets) {
            for (const asset of rloc.assets) {
              if (asset.url && asset.url.includes("supabase.co")) {
                try {
                  await deleteImageFromSupabase(asset.url, SUPABASE_BUCKETS.LOCATION_IMAGES);
                } catch (err) {
                  console.error("Lỗi xóa ảnh chi nhánh bị xóa trên Supabase:", err);
                }
              }
            }
          }
        }
      }

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        category_id: categoryId ? Number(categoryId) : null,
        locations: finalLocations
      };

      await onSubmit(payload);

      setNotification({
        type: "success",
        message: initialData
          ? "Cập nhật địa điểm thành công!"
          : "Tạo địa điểm mới thành công!",
      });

      setTimeout(() => {
        setNotification(null);
        onClose();
      }, 1800);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const isBusy = isLoading || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-6">
      <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl mx-4 my-auto transition-all ${
        isBusinessPage ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-background text-foreground"
      }`}>

        {/* ── Header ──────────────────────────────────── */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isBusinessPage ? "border-slate-800" : ""}`}>
          <h2 className="text-lg font-semibold">
            {initialData ? "Cập nhật địa điểm" : "Tạo địa điểm mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className={`rounded-full p-1.5 transition-colors disabled:opacity-40 ${isBusinessPage ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-secondary text-foreground"}`}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">

          {/* ══ NHÓM 1: Thông tin địa điểm (Place) ══════ */}
          <section className="space-y-4">
            <h3 className={`text-xs font-semibold uppercase tracking-widest border-b pb-1.5 ${isBusinessPage ? "text-slate-400 border-slate-800" : "text-muted-foreground"}`}>
              📍 Thông tin địa điểm
            </h3>

            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isBusinessPage ? "text-slate-300" : ""}`}>
                Tên địa điểm <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={name}
                onChange={handlePlaceFieldChange}
                placeholder="Ví dụ: Chùa Bà Thiên Hậu"
                disabled={isBusy}
                className={isBusinessPage ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/50" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isBusinessPage ? "text-slate-300" : ""}`}>Mô tả</label>
              <textarea
                name="description"
                value={description}
                onChange={handlePlaceFieldChange}
                placeholder="Nhập mô tả về địa điểm..."
                disabled={isBusy}
                rows={3}
                className={`flex w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50 resize-none focus-visible:outline-none ${
                  isBusinessPage
                    ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-amber-500 focus-visible:ring-3 focus-visible:ring-amber-500/50"
                    : "border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                }`}
              />
            </div>

            {/* Category */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isBusinessPage ? "text-slate-300" : ""}`}>Danh mục</label>
              <select
                name="category_id"
                value={categoryId}
                onChange={handlePlaceFieldChange}
                disabled={isBusy}
                className={`flex h-9 w-full rounded-lg border px-3 py-1 text-sm focus-visible:outline-none ${
                  isBusinessPage
                    ? "border-slate-700 bg-slate-800 text-slate-100 focus-visible:border-amber-500 focus-visible:ring-3 focus-visible:ring-amber-500/50"
                    : "border-input bg-transparent text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                }`}
              >
                <option value="" className={isBusinessPage ? "bg-slate-800 text-slate-100" : "bg-white text-black"}>
                  -- Chọn danh mục --
                </option>
                {categories.map((cat) => (
                  <option 
                    key={cat.id} 
                    value={cat.id}
                    className={isBusinessPage ? "bg-slate-800 text-slate-100" : "bg-white text-black"}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* ══ NHÓM 2: Danh sách chi nhánh (Locations) ════════ */}
          <section className="space-y-4">
            <h3 className={`text-xs font-semibold uppercase tracking-widest border-b pb-1.5 flex items-center justify-between ${isBusinessPage ? "text-slate-400 border-slate-800" : "text-muted-foreground"}`}>
              <span>🗺️ Chi nhánh (Vị trí)</span>
              <span className="text-[11px] normal-case text-muted-foreground font-normal">
                Bắt buộc có ít nhất 1 chi nhánh
              </span>
            </h3>

            {/* Tabs chọn chi nhánh */}
            <div className={`flex flex-wrap gap-2 mb-2 border-b pb-3 ${isBusinessPage ? "border-slate-800" : ""}`}>
              {locations.map((loc, idx) => (
                <div key={idx} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLocationIndex(idx);
                      setSearchSuggestions([]);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5
                      ${activeLocationIndex === idx
                        ? isBusinessPage
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-[#B8922E] text-white border-[#B8922E]"
                        : isBusinessPage
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-input"
                      }`}
                  >
                    <MapPin size={12} />
                    Chi nhánh {idx + 1}
                    {locations.length > 1 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLocation(idx);
                        }}
                        className={`rounded-full p-0.5 ml-1 inline-flex items-center justify-center transition-colors ${
                          isBusinessPage ? "hover:bg-white/20 text-slate-300 hover:text-white" : "hover:bg-black/20"
                        }`}
                        title="Xóa chi nhánh này"
                      >
                        <X size={10} />
                      </span>
                    )}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddLocation}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border border-dashed transition-colors
                  ${isBusinessPage
                    ? "border-amber-500/40 text-amber-500 hover:bg-amber-500/10 border-dashed"
                    : "border-dashed border-[#B8922E]/40 text-[#B8922E] hover:bg-[#B8922E]/5"
                  }`}
              >
                + Thêm chi nhánh
              </button>
            </div>

            {/* Chi tiết chi nhánh active */}
            <div className="space-y-4 pt-1">
              {/* Address with Nominatim Search */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isBusinessPage ? "text-slate-300" : ""}`}>
                  Địa chỉ chi nhánh {activeLocationIndex + 1} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    name="address"
                    value={activeLoc.address}
                    onChange={handleLocationFieldChange}
                    placeholder="Nhập địa chỉ chi nhánh..."
                    disabled={isBusy}
                    className={`flex-1 ${
                      isBusinessPage ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/50" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    onClick={() => handleSearchAddress(activeLoc.address)}
                    disabled={isBusy || isSearchingAddress}
                    className={`shrink-0 border h-9 ${
                      isBusinessPage
                        ? "bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-input"
                    }`}
                  >
                    {isSearchingAddress ? "Đang tìm..." : "Tìm kiếm"}
                  </Button>
                </div>
                {errors[`loc_${activeLocationIndex}_address`] && (
                  <p className="text-xs text-red-500 mt-1">{errors[`loc_${activeLocationIndex}_address`]}</p>
                )}

                {/* Suggestions Dropdown */}
                {searchSuggestions.length > 0 && (
                  <div className={`mt-2 rounded-lg border bg-background shadow-lg max-h-48 overflow-y-auto z-20 relative ${isBusinessPage ? "bg-slate-800 border-slate-700" : ""}`}>
                    {searchSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          updateActiveLocation({
                            address: item.display_name,
                            lat: String(Number(item.lat).toFixed(6)),
                            lng: String(Number(item.lon).toFixed(6)),
                          });
                          setSearchSuggestions([]);
                          const latErrKey = `loc_${activeLocationIndex}_lat`;
                          const lngErrKey = `loc_${activeLocationIndex}_lng`;
                          if (errors[latErrKey] || errors[lngErrKey]) {
                            setErrors((prev) => ({ ...prev, [latErrKey]: "", [lngErrKey]: "" }));
                          }
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors border-b last:border-b-0 line-clamp-2 ${
                          isBusinessPage ? "hover:bg-slate-700 text-slate-200 border-slate-700/50" : ""
                        }`}
                      >
                        {item.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Lat / Lng */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isBusinessPage ? "text-slate-300" : ""}`}>Vĩ độ (Latitude)</label>
                  <Input
                    type="number"
                    name="lat"
                    value={activeLoc.lat}
                    onChange={handleLocationFieldChange}
                    placeholder="Ví dụ: 10.779960"
                    step="any"
                    disabled={isBusy}
                    className={isBusinessPage ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/50" : ""}
                  />
                  {errors[`loc_${activeLocationIndex}_lat`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`loc_${activeLocationIndex}_lat`]}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isBusinessPage ? "text-slate-300" : ""}`}>Kinh độ (Longitude)</label>
                  <Input
                    type="number"
                    name="lng"
                    value={activeLoc.lng}
                    onChange={handleLocationFieldChange}
                    placeholder="Ví dụ: 106.699190"
                    step="any"
                    disabled={isBusy}
                    className={isBusinessPage ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/50" : ""}
                  />
                  {errors[`loc_${activeLocationIndex}_lng`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`loc_${activeLocationIndex}_lng`]}</p>
                  )}
                </div>
              </div>

              {/* Leaflet Map for click-to-pin location */}
              <div className="relative">
                <div className={`h-60 w-full rounded-lg border mt-2 overflow-hidden relative z-0 ${isBusinessPage ? "border-slate-700" : ""}`}>
                  <MapContainer
                    center={(() => {
                      const latVal = Number(activeLoc.lat);
                      const lngVal = Number(activeLoc.lng);
                      const hasValidLatLng = !isNaN(latVal) && latVal !== 0 && !isNaN(lngVal) && lngVal !== 0;
                      return hasValidLatLng ? [latVal, lngVal] : [10.779960, 106.699190];
                    })()}
                    zoom={(() => {
                      const latVal = Number(activeLoc.lat);
                      const lngVal = Number(activeLoc.lng);
                      const hasValidLatLng = !isNaN(latVal) && latVal !== 0 && !isNaN(lngVal) && lngVal !== 0;
                      return hasValidLatLng ? 15 : 12;
                    })()}
                    zoomControl={true}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapResizer />
                    <ChangeMapCenter
                      center={(() => {
                        const latVal = Number(activeLoc.lat);
                        const lngVal = Number(activeLoc.lng);
                        const hasValidLatLng = !isNaN(latVal) && latVal !== 0 && !isNaN(lngVal) && lngVal !== 0;
                        return hasValidLatLng ? [latVal, lngVal] : null;
                      })()}
                    />
                    <MapClickHandler onClick={handleMapClick} />
                    {(() => {
                      const latVal = Number(activeLoc.lat);
                      const lngVal = Number(activeLoc.lng);
                      const hasValidLatLng = !isNaN(latVal) && latVal !== 0 && !isNaN(lngVal) && lngVal !== 0;
                      return hasValidLatLng ? (
                        <Marker
                          position={[latVal, lngVal]}
                          icon={createCustomIcon(isBusinessPage ? "#f59e0b" : "#B8922E", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>`)}
                        />
                      ) : null;
                    })()}
                  </MapContainer>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                  💡 <i>Nhấp chuột vào bản đồ trên để đánh dấu tọa độ và lấy địa chỉ tự động cho chi nhánh này.</i>
                </p>
              </div>
            </div>
          </section>

          {/* ══ NHÓM 3: Ảnh chi nhánh (Assets) ═══════════ */}
          <section className="space-y-4">
            <h3 className={`text-xs font-semibold uppercase tracking-widest border-b pb-1.5 ${isBusinessPage ? "text-slate-400 border-slate-800" : "text-muted-foreground"}`}>
              🖼️ Ảnh chi nhánh {activeLocationIndex + 1}
              <span className="normal-case font-normal ml-2 text-muted-foreground/70 text-[11px]">
                — Ảnh đầu sẽ là ảnh chính (primary)
              </span>
            </h3>

            {/* Upload trigger */}
            <div>
              <input
                ref={fileInputRef}
                id="loc-img-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={isBusy}
                className="sr-only"
              />
              <label
                htmlFor="loc-img-upload"
                className={`inline-flex items-center gap-2 rounded-lg border-2 border-dashed px-4 py-2 text-sm font-medium cursor-pointer transition-colors
                  ${isBusy
                    ? "opacity-50 cursor-not-allowed border-input text-muted-foreground"
                    : isBusinessPage
                    ? "border-amber-500/40 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10"
                    : "border-[#B8922E]/40 text-[#B8922E] hover:border-[#B8922E] hover:bg-[#B8922E]/5"
                  }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm ảnh chi nhánh
              </label>
              <p className="text-xs text-muted-foreground mt-1.5">
                JPEG, PNG, WebP · tối đa {IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB}MB/ảnh
              </p>
            </div>

            {/* Preview grid */}
            {(activeLoc.imagePreviews || []).length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    {(activeLoc.imagePreviews || []).length} ảnh của chi nhánh {activeLocationIndex + 1}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {(activeLoc.imagePreviews || []).map((item, index) => (
                    <div
                      key={item.url + index}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 bg-secondary
                        ${index === 0 ? (isBusinessPage ? "border-amber-500 ring-2 ring-amber-500/30" : "border-[#B8922E] ring-2 ring-[#B8922E]/30") : "border-transparent"}`}
                    >
                      <img
                        src={item.url}
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => window.open(item.url, '_blank')}
                        title="Xem ảnh lớn"
                      />

                      {/* Primary badge */}
                      {index === 0 && (
                        <div className={`absolute top-1 left-1 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm ${isBusinessPage ? "bg-amber-500" : "bg-[#B8922E]"}`}>
                          ẢNH CHÍNH
                        </div>
                      )}
                      
                      {/* Existing image badge */}
                      {!item.file && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          ĐÃ CÓ
                        </div>
                      )}

                      {/* Hover actions */}
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(index)}
                            title="Đặt làm ảnh chính"
                            className={`rounded-full p-1.5 text-white transition-colors ${isBusinessPage ? "bg-amber-500 hover:bg-amber-600" : "bg-[#B8922E] hover:bg-[#a67d22]"}`}
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7 7 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          title="Xóa ảnh này"
                          className="rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-lg ${isBusinessPage ? "border-slate-800 bg-slate-900/40" : "border-muted-foreground/20 bg-secondary/30"}`}>
                <p className="text-xs text-muted-foreground font-medium">Chi nhánh này chưa có ảnh nào</p>
              </div>
            )}
          </section>

          {/* ── Actions ──────────────────────────────────── */}
          <div className={`flex gap-3 justify-end pt-2 border-t ${isBusinessPage ? "border-slate-800" : ""}`}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isBusy}
              className={isBusinessPage ? "border-slate-700 hover:bg-slate-800 text-slate-200 hover:text-white" : ""}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isBusy}
              className={`min-w-[100px] ${isBusinessPage ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-[#B8922E] hover:bg-[#a67d22]"}`}
            >
              {isUploading
                ? "Đang tải ảnh..."
                : isLoading
                  ? initialData ? "Đang cập nhật..." : "Đang tạo..."
                  : initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>

        {/* ── Upload overlay ───────────────────────────── */}
        {isUploading && (
          <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center z-10">
            <div className={`rounded-xl px-8 py-6 shadow-lg flex flex-col items-center gap-3 ${isBusinessPage ? "bg-slate-800 text-slate-100 border border-slate-700" : "bg-background"}`}>
              <div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${isBusinessPage ? "border-amber-500" : "border-[#B8922E]"}`} />
              <p className="text-sm font-medium">Đang xử lý hình ảnh và dữ liệu...</p>
              <p className="text-xs text-muted-foreground">Vui lòng chờ giây lát</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Notification toast ───────────────────────────── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-70">
          <div
            className={`flex items-start gap-3 rounded-xl p-4 shadow-xl max-w-sm border
              ${notification.type === "success"
                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
              }`}
          >
            {notification.type === "success" ? (
              <svg className="h-5 w-5 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className={`text-sm font-medium whitespace-pre-line
              ${notification.type === "success" ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}
            >
              {notification.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
