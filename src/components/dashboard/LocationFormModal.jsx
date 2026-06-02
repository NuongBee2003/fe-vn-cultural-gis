/**
 * LocationFormModal.jsx
 * Form modal để tạo mới hoặc cập nhật địa điểm.
 *
 * Fields tương ứng BE API (POST/PUT /api/v1/location):
 *   [Nhóm 1 — Place]
 *     name, description, category_id
 *   [Nhóm 2 — Location]
 *     lat, lng, address
 *   [Nhóm 3 — Assets / Ảnh]
 *     images[] — upload lên Supabase bucket "location-images"
 *
 * Tham khảo CategoryFormModal nhưng khác key:
 *   Category dùng: SUPABASE_BUCKETS.ICON_LOCATION  → field "icon_marker"
 *   Location dùng: SUPABASE_BUCKETS.LOCATION_IMAGES → field "images" (array)
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { uploadImageToSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS, IMAGE_UPLOAD_CONFIG } from "@/constants/supabaseConfig";
import { useCategories } from "@/api/useLocationQuery";

const EMPTY_FORM = {
  name: "",
  description: "",
  category_id: "",
  address: "",
  lat: "",
  lng: "",
};

export default function LocationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  // ── Ảnh ─────────────────────────────────────────────────
  // Mỗi item: { file?: File, url: string }
  // file = null  → URL đã có sẵn (ảnh cũ, giữ nguyên)
  // file = File  → chưa upload, sẽ upload khi submit
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ── Danh mục ─────────────────────────────────────────────
  const { data: rawCategories = [] } = useCategories();
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  // ── Reset khi mở / đóng ──────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        category_id:
          initialData.category_id ?? initialData.categoryId ?? "",
        address: initialData.address || "",
        lat: initialData.lat != null ? String(initialData.lat) : "",
        lng: initialData.lng != null ? String(initialData.lng) : "",
      });
      // Ảnh hiện có (nếu initialData.images tồn tại)
      const existing = (initialData.images || []).map((url) => ({
        file: null,
        url,
      }));
      setImagePreviews(existing);
    } else {
      setFormData(EMPTY_FORM);
      setImagePreviews([]);
    }
    setErrors({});
    setNotification(null);
  }, [isOpen, initialData]);

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "Tên địa điểm không được để trống";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Tên phải có ít nhất 2 ký tự";
    }
    if (formData.lat && isNaN(Number(formData.lat))) {
      errs.lat = "Vĩ độ phải là số";
    } else if (formData.lat && (Number(formData.lat) < -90 || Number(formData.lat) > 90)) {
      errs.lat = "Vĩ độ: -90 đến 90";
    }
    if (formData.lng && isNaN(Number(formData.lng))) {
      errs.lng = "Kinh độ phải là số";
    } else if (formData.lng && (Number(formData.lng) < -180 || Number(formData.lng) > 180)) {
      errs.lng = "Kinh độ: -180 đến 180";
    }
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

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Xóa ảnh ─────────────────────────────────────────────
  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => {
      const next = [...prev];
      if (next[index].file && next[index].url.startsWith("blob:")) {
        URL.revokeObjectURL(next[index].url);
      }
      next.splice(index, 1);
      return next;
    });
  };

  // ── Đặt ảnh primary (đưa lên đầu) ───────────────────────
  const handleSetPrimary = (index) => {
    setImagePreviews((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      return [item, ...next];
    });
  };

  // ── Field change ─────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsUploading(true);
      setNotification(null);

      // Upload ảnh mới (có File), giữ nguyên URL ảnh cũ
      const uploadedUrls = await Promise.all(
        imagePreviews.map(async (item) => {
          if (item.file) {
            // Upload lên bucket LOCATION_IMAGES (khác với ICON_LOCATION của category)
            return await uploadImageToSupabase(
              item.file,
              SUPABASE_BUCKETS.LOCATION_IMAGES
            );
          }
          return item.url;
        })
      );

      // Build payload
      const payload = {
        name: formData.name.trim(),
        ...(formData.description.trim() && { description: formData.description.trim() }),
        ...(formData.category_id && { category_id: Number(formData.category_id) }),
        ...(formData.address.trim() && { address: formData.address.trim() }),
        ...(formData.lat !== "" && { lat: Number(formData.lat) }),
        ...(formData.lng !== "" && { lng: Number(formData.lng) }),
        images: uploadedUrls,
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
      <div className="relative w-full max-w-2xl rounded-xl bg-background shadow-2xl mx-4 my-auto">

        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {initialData ? "Cập nhật địa điểm" : "Tạo địa điểm mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-full p-1.5 hover:bg-secondary transition-colors disabled:opacity-40"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">

          {/* ══ NHÓM 1: Thông tin địa điểm (Place) ══════ */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b pb-1.5">
              📍 Thông tin địa điểm
            </h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên địa điểm <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhà Thờ Đức Bà"
                disabled={isBusy}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Công trình kiến trúc Pháp cổ tại trung tâm TP.HCM..."
                disabled={isBusy}
                rows={3}
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={isBusy}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* ══ NHÓM 2: Vị trí (Location) ════════════════ */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b pb-1.5">
              🗺️ Vị trí
            </h3>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="01 Công xã Paris, Bến Nghé, Quận 1, TP.HCM"
                disabled={isBusy}
              />
            </div>

            {/* Lat / Lng */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Vĩ độ (Latitude)</label>
                <Input
                  type="number"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="10.779960"
                  step="any"
                  disabled={isBusy}
                />
                {errors.lat && (
                  <p className="text-xs text-red-500 mt-1">{errors.lat}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kinh độ (Longitude)</label>
                <Input
                  type="number"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="106.699190"
                  step="any"
                  disabled={isBusy}
                />
                {errors.lng && (
                  <p className="text-xs text-red-500 mt-1">{errors.lng}</p>
                )}
              </div>
            </div>
          </section>

          {/* ══ NHÓM 3: Ảnh địa điểm (Assets) ═══════════ */}
          {/* Upload lên Supabase bucket: "location-images"  */}
          {/* Khác với category dùng bucket: "icon_location" */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b pb-1.5">
              🖼️ Ảnh địa điểm
              <span className="normal-case font-normal ml-2 text-muted-foreground/70">
                — Ảnh đầu tiên sẽ là ảnh chính (primary)
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
                    : "border-[#B8922E]/40 text-[#B8922E] hover:border-[#B8922E] hover:bg-[#B8922E]/5"
                  }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm ảnh
              </label>
              <p className="text-xs text-muted-foreground mt-1.5">
                JPEG, PNG, WebP, GIF · tối đa {IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB}MB / ảnh · có thể chọn nhiều
              </p>
            </div>

            {/* Preview grid */}
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {imagePreviews.map((item, index) => (
                  <div
                    key={item.url + index}
                    className={`relative group aspect-square rounded-lg overflow-hidden border-2 bg-secondary
                      ${index === 0 ? "border-[#B8922E]" : "border-transparent"}`}
                  >
                    <img
                      src={item.url}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Primary badge */}
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-[#B8922E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        PRIMARY
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(index)}
                          title="Đặt làm ảnh chính"
                          className="rounded-full bg-[#B8922E] p-1.5 text-white hover:bg-[#a67d22] transition-colors"
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
            ) : (
              <p className="text-xs italic text-muted-foreground">
                Chưa có ảnh nào được chọn
              </p>
            )}
          </section>

          {/* ── Actions ──────────────────────────────────── */}
          <div className="flex gap-3 justify-end pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isBusy}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isBusy}
              className="bg-[#B8922E] hover:bg-[#a67d22] min-w-[100px]"
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
            <div className="bg-background rounded-xl px-8 py-6 shadow-lg flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B8922E]" />
              <p className="text-sm font-medium">Đang tải ảnh lên Supabase...</p>
              <p className="text-xs text-muted-foreground">bucket: location-images</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Notification toast ───────────────────────────── */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[70]">
          <div
            className={`flex items-start gap-3 rounded-xl p-4 shadow-xl max-w-sm border
              ${notification.type === "success"
                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
              }`}
          >
            {notification.type === "success" ? (
              <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
