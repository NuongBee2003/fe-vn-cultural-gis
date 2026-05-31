import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { uploadImageToSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS, IMAGE_UPLOAD_CONFIG } from "@/constants/supabaseConfig";

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    icon_marker: "",
    color: "#B8922E",
  });

  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        icon_marker: initialData.icon_marker || "",
        color: initialData.color || "#B8922E",
      });
    } else {
      setFormData({
        name: "",
        icon_marker: "",
        color: "#B8922E",
      });
    }
    setErrors({});
    setSelectedFile(null);
    setNotification(null);
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên danh mục không được để trống";
    }
    if (formData.name.trim().length < 2) {
      newErrors.name = "Tên danh mục phải có ít nhất 2 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setUploadingImage(true);
      let finalFormData = { ...formData };

      // Upload file nếu có file được chọn
      if (selectedFile) {
        const imageUrl = await uploadImageToSupabase(
          selectedFile,
          SUPABASE_BUCKETS.ICON_LOCATION
        );
        finalFormData.icon_marker = imageUrl;
      }

      // Submit form
      await onSubmit(finalFormData);
      setNotification({
        type: "success",
        message: initialData ? "Cập nhật danh mục thành công!" : "Tạo danh mục thành công!",
      });
      
      // Đóng modal sau 2 giây
      setTimeout(() => {
        setSelectedFile(null);
        setNotification(null);
        onClose();
      }, 2000);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file
      if (!IMAGE_UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`File type not allowed. Supported: JPEG, PNG, GIF, WebP, SVG`);
      }
      if (file.size > IMAGE_UPLOAD_CONFIG.MAX_SIZE_BYTES) {
        throw new Error(`File size exceeds ${IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB}MB limit`);
      }

      // Lưu file, chưa upload - chỉ preview
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, icon_marker: e.target.result }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {initialData ? "Cập nhật danh mục" : "Tạo danh mục mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên danh mục */}
          <div>
            <label className="block text-sm font-medium mb-1">Tên danh mục *</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Icon marker */}
          <div>
            <label className="block text-sm font-medium mb-1">Icon ảnh</label>
            
            {/* Upload Input */}
            <div className="mb-3">
              <input
                type="file"
                accept="image/*,.svg"
                onChange={handleImageUpload}
                disabled={isLoading || uploadingImage}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#B8922E] file:text-white
                  hover:file:bg-[#a67d22]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {selectedFile ? `Đã chọn: ${selectedFile.name}` : `Tối đa ${IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB}MB`}
              </p>
            </div>

            {/* Preview */}
            {formData.icon_marker && (
              <div className="mb-3">
                <img
                  src={formData.icon_marker}
                  alt="preview"
                  className="h-20 w-20 rounded border object-cover"
                />
              </div>
            )}

            {/* URL Input (backup) */}
            <Input
              type="text"
              name="icon_marker"
              value={formData.icon_marker}
              onChange={handleChange}
              placeholder="Hoặc dán URL ảnh trực tiếp"
              disabled={isLoading}
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium mb-1">Màu sắc</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-10 w-20 rounded border border-input cursor-pointer"
                disabled={isLoading}
              />
              <Input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="#B8922E"
                className="flex-1"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading || uploadingImage}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploadingImage}
              className="bg-[#B8922E] hover:bg-[#a67d22]"
            >
              {uploadingImage
                ? "Đang xử lý..."
                : isLoading
                  ? initialData
                    ? "Đang cập nhật..."
                    : "Đang tạo..."
                  : initialData
                    ? "Cập nhật"
                    : "Tạo mới"}
            </Button>
          </div>
        </form>

        {/* Loading Overlay */}
        {uploadingImage && (
          <div className="absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B8922E]"></div>
              <p className="text-sm text-white font-medium">Đang tải lên...</p>
            </div>
          </div>
        )}
      </div>

      {/* Notification Modal */}
      {notification && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className={`rounded-lg p-6 shadow-lg max-w-sm w-full mx-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {notification.type === 'success' ? (
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' 
                    ? 'text-green-800' 
                    : 'text-red-800'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
