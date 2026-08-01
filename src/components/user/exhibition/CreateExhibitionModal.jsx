import { useState, useEffect, useRef } from "react";
import { X, Image as ImageIcon, Trash2, Loader2, MapPin, Tag } from "lucide-react";
import { createExhibition } from "@/api/user/exhibitionApi";
import { uploadImageToSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS, IMAGE_UPLOAD_CONFIG } from "@/constants/supabaseConfig";
import { ALL_PROVINCES } from "@/constants/provinces";

export default function CreateExhibitionModal({ onClose, onExhibitionCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("place");
  const [province, setProvince] = useState(ALL_PROVINCES[0] || "Hà Nội");
  const [placeName, setPlaceName] = useState("");
  const [styleTag, setStyleTag] = useState("");
  
  // Trạng thái tải ảnh
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);

  // Lắng nghe sự kiện ESC để đóng modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");

    // Validate type
    const allowedTypes = IMAGE_UPLOAD_CONFIG?.ALLOWED_TYPES || ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Định dạng file không hỗ trợ. Hãy chọn ảnh JPEG, PNG, WEBP hoặc SVG.");
      return;
    }

    // Validate size
    const maxSize = IMAGE_UPLOAD_CONFIG?.MAX_SIZE_BYTES || 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxMb = IMAGE_UPLOAD_CONFIG?.MAX_SIZE_MB || 5;
      setErrorMsg(`Kích thước file vượt quá giới hạn ${maxMb}MB.`);
      return;
    }

    setImageFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      setErrorMsg("Vui lòng nhập tiêu đề tác phẩm");
      return;
    }
    if (!trimmedDesc) {
      setErrorMsg("Vui lòng nhập mô tả chi tiết");
      return;
    }
    if (!imageFile) {
      setErrorMsg("Vui lòng chọn hình ảnh minh họa cho tác phẩm");
      return;
    }

    setIsSubmitting(true);
    let uploadedUrl = "";

    try {
      // 1. Tải ảnh lên Supabase
      setIsUploading(true);
      uploadedUrl = await uploadImageToSupabase(imageFile, SUPABASE_BUCKETS.EXHIBITION_IMAGES);
      setIsUploading(false);

      if (!uploadedUrl) {
        throw new Error("Không thể tải hình ảnh lên. Vui lòng thử lại.");
      }

      // 2. Gọi API tạo triển lãm
      const payload = {
        title: trimmedTitle,
        description: trimmedDesc,
        category,
        province,
        place_name: placeName.trim() || null,
        style_tag: styleTag.trim() || null,
        image_url: uploadedUrl,
      };

      await createExhibition(payload);
      
      if (onExhibitionCreated) {
        onExhibitionCreated();
      }
      onClose();
    } catch (err) {
      console.error("Lỗi khi đăng tác phẩm triển lãm:", err);
      setErrorMsg(err.message || "Đăng tác phẩm thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Đăng tác phẩm triển lãm ảo mới"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-label="Đóng"
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-stone-150">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-stone-100 px-6 py-4 bg-stone-50">
          <div>
            <h2 className="text-lg font-semibold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Đăng tác phẩm triển lãm mới
            </h2>
            <p className="text-xs text-stone-550 mt-0.5">Tác phẩm sẽ được hiển thị sau khi quản trị viên phê duyệt.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-700 transition-colors"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </header>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 border border-red-150 p-3 text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Tiêu đề */}
          <div className="space-y-1.5">
            <label htmlFor="exh-title" className="text-xs font-semibold text-stone-700">
              Tiêu đề tác phẩm <span className="text-red-500">*</span>
            </label>
            <input
              id="exh-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề tác phẩm (ví dụ: Chùa Thiên Mụ trầm mặc, Phở bò Hà Nội...)"
              maxLength={255}
              className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-100 transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Danh mục */}
            <div className="space-y-1.5">
              <label htmlFor="exh-category" className="text-xs font-semibold text-stone-700">
                Danh mục <span className="text-red-550">*</span>
              </label>
              <select
                id="exh-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-100 transition-all cursor-pointer"
                disabled={isSubmitting}
              >
                <option value="place">Địa điểm</option>
                <option value="food">Ẩm thực</option>
                <option value="festival">Lễ hội</option>
              </select>
            </div>

            {/* Tỉnh thành */}
            <div className="space-y-1.5">
              <label htmlFor="exh-province" className="text-xs font-semibold text-stone-700">
                Tỉnh thành <span className="text-red-550">*</span>
              </label>
              <select
                id="exh-province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-100 transition-all cursor-pointer"
                disabled={isSubmitting}
              >
                {ALL_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tên địa danh cụ thể */}
            <div className="space-y-1.5">
              <label htmlFor="exh-place-name" className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                <MapPin size={12} className="text-stone-400" />
                Địa danh cụ thể
              </label>
              <input
                id="exh-place-name"
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Ví dụ: Chùa Một Cột, Hồ Xuân Hương..."
                className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-100 transition-all"
                disabled={isSubmitting}
              />
            </div>

            {/* Nhãn phong cách (style_tag) */}
            <div className="space-y-1.5">
              <label htmlFor="exh-style-tag" className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                <Tag size={12} className="text-stone-400" />
                Nhãn phong cách
              </label>
              <input
                id="exh-style-tag"
                type="text"
                value={styleTag}
                onChange={(e) => setStyleTag(e.target.value)}
                placeholder="Ví dụ: Cổ kính, Rực rỡ, Thanh tịnh..."
                className="w-full h-10 rounded-xl border border-stone-200 bg-white px-3.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-100 transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5">
            <label htmlFor="exh-description" className="text-xs font-semibold text-stone-700">
              Ý nghĩa văn hóa / Mô tả tác phẩm <span className="text-red-550">*</span>
            </label>
            <textarea
              id="exh-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Chia sẻ vẻ đẹp, nguồn gốc và ý nghĩa văn hóa của tác phẩm này..."
              rows={4}
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-100 transition-all resize-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Chọn ảnh */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">
                Hình ảnh minh họa <span className="text-red-500">*</span>
              </span>
              {!imagePreview && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                  disabled={isSubmitting}
                >
                  <ImageIcon size={14} />
                  Chọn hình ảnh
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Preview ảnh */}
            {imagePreview ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Xem trước tác phẩm"
                  className="h-full w-full object-cover"
                />
                {!isSubmitting && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-3 top-3 rounded-full bg-black/60 hover:bg-black/85 p-2 text-white transition-colors"
                    title="Xóa hình ảnh này"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-400 bg-stone-50/50 hover:bg-stone-50/80 flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-stone-600 transition-all cursor-pointer"
                disabled={isSubmitting}
              >
                <ImageIcon size={32} strokeWidth={1.5} />
                <span className="text-xs font-medium">Nhấp để tải lên hình ảnh của tác phẩm</span>
                <span className="text-[10px] text-stone-400">JPEG, PNG, WEBP lên đến 5MB</span>
              </button>
            )}
          </div>
        </form>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-2 border-t border-stone-100 px-6 py-4 bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !description.trim() || !imageFile}
            className="h-10 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isUploading ? "Đang tải ảnh..." : isSubmitting ? "Đang đăng..." : "Đăng tác phẩm"}
          </button>
        </footer>
      </div>
    </div>
  );
}
