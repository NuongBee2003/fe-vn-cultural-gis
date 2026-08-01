import { useState, useEffect, useRef } from "react";
import { X, MapPin, Image as ImageIcon, Trash2, Loader2, Search } from "lucide-react";
import { createPost } from "@/api/user/postApi";
import { searchPlaceLocationsByDB } from "@/api/user/locationApi";
import { uploadImageToSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS } from "@/constants/supabaseConfig";

export default function CreatePostModal({ onClose, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // Trạng thái tìm kiếm địa điểm
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Trạng thái tải ảnh
  const [images, setImages] = useState([]); // Array of { id, url, name, isUploading, error }
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

  // Debounce tìm kiếm địa điểm từ DB
  useEffect(() => {
    if (locationQuery.trim().length < 2) {
      setLocationResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const results = await searchPlaceLocationsByDB(locationQuery.trim());
        setLocationResults(results);
      } catch (err) {
        console.error("Lỗi tìm kiếm địa điểm:", err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [locationQuery]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Thêm ảnh tạm thời vào state ở trạng thái đang tải lên
      setImages((prev) => [
        ...prev,
        { id: tempId, name: file.name, isUploading: true, url: null, error: null }
      ]);

      try {
        const publicUrl = await uploadImageToSupabase(file, SUPABASE_BUCKETS.POST_IMAGES);
        setImages((prev) =>
          prev.map((img) =>
            img.id === tempId ? { ...img, isUploading: false, url: publicUrl } : img
          )
        );
      } catch (err) {
        console.error("Lỗi tải ảnh lên Supabase:", err);
        setImages((prev) =>
          prev.map((img) =>
            img.id === tempId ? { ...img, isUploading: false, error: err.message || "Tải lên thất bại" } : img
          )
        );
      }
    }

    // Reset input để có thể chọn lại cùng 1 file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setErrorMsg("Vui lòng nhập tiêu đề bài viết");
      return;
    }
    if (!trimmedContent) {
      setErrorMsg("Vui lòng nhập nội dung bài viết");
      return;
    }

    // Kiểm tra xem có ảnh nào đang trong trạng thái upload hay không
    const hasUploading = images.some((img) => img.isUploading);
    if (hasUploading) {
      setErrorMsg("Vui lòng chờ hình ảnh tải lên hoàn tất");
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrls = images.filter((img) => img.url).map((img) => img.url);
      
      const postData = {
        title: trimmedTitle,
        content: trimmedContent,
        location_id: selectedLocation ? selectedLocation.id : null,
        images: imageUrls,
      };

      await createPost(postData);
      onPostCreated();
      onClose();
    } catch (err) {
      console.error("Lỗi đăng bài viết:", err);
      setErrorMsg(err.message || "Đăng bài viết thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Tạo bài viết mới"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-label="Đóng"
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Tạo bài viết mới</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </header>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-650">
              {errorMsg}
            </div>
          )}

          {/* Tiêu đề */}
          <div className="space-y-1.5">
            <label htmlFor="post-title" className="text-xs font-semibold text-slate-650">
              Tiêu đề bài viết <span className="text-red-550">*</span>
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề thu hút..."
              maxLength={255}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-100/70 transition-all"
              required
            />
          </div>

          {/* Nội dung */}
          <div className="space-y-1.5">
            <label htmlFor="post-content" className="text-xs font-semibold text-slate-650">
              Nội dung chia sẻ <span className="text-red-550">*</span>
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bạn muốn chia sẻ điều gì về những câu chuyện, di sản hay lễ hội văn hóa?"
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-100/70 transition-all resize-none"
              required
            />
          </div>

          {/* Liên kết Địa điểm */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-650">
              Gắn thẻ Địa điểm (Vị trí)
            </label>
            
            {selectedLocation ? (
              // Badge địa điểm đã chọn
              <div className="flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-150 p-2.5 text-indigo-750">
                <MapPin size={16} className="shrink-0 text-indigo-600" />
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-semibold truncate leading-tight">{selectedLocation.name}</p>
                  <p className="text-[10px] text-indigo-550 truncate mt-0.5">{selectedLocation.address}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLocation(null)}
                  className="rounded-full p-1 hover:bg-indigo-100 text-indigo-500 hover:text-indigo-700 transition-colors"
                  aria-label="Xóa địa điểm đã chọn"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              // Ô tìm kiếm địa điểm
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={14} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Nhập tên hoặc địa chỉ để tìm địa điểm..."
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100/70 transition-all"
                />
                
                {isSearchingLocation && (
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <Loader2 size={14} className="animate-spin text-slate-400" />
                  </div>
                )}

                {/* Kết quả tìm kiếm dropdown */}
                {locationResults.length > 0 && (
                  <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    {locationResults.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationQuery("");
                          setLocationResults([]);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex flex-col gap-0.5"
                      >
                        <span className="text-xs font-semibold text-slate-800">{loc.name}</span>
                        <span className="text-[10px] text-slate-500 truncate">{loc.address}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chọn ảnh */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-650">Hình ảnh đính kèm</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                <ImageIcon size={14} />
                Thêm hình ảnh
              </button>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            {/* Grid ảnh đã chọn/tải lên */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50/55 p-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white"
                  >
                    {img.isUploading ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 gap-1.5">
                        <Loader2 size={18} className="animate-spin text-amber-500" />
                        <span className="text-[9px] text-slate-500 font-medium">Đang tải...</span>
                      </div>
                    ) : img.error ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-red-50/90 text-center gap-1">
                        <span className="text-[9px] text-red-600 font-semibold leading-tight truncate w-full">
                          Lỗi tải lên
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="rounded-full bg-red-100 p-1 text-red-650 hover:bg-red-200 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <img
                          src={img.url}
                          alt="Ảnh đính kèm"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa hình ảnh này"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <footer className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Đăng bài
          </button>
        </footer>
      </div>
    </div>
  );
}
