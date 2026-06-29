import { useState, useRef, useEffect } from "react";
import { X, Camera, Loader2, User, Mail } from "lucide-react";
import { uploadImageToSupabase } from "@/lib/supabaseClient";
import { SUPABASE_BUCKETS } from "@/constants/supabaseConfig";
import { authApi } from "@/api/authApi";

export default function UserProfileModal({ isOpen, onClose, currentUser }) {
  const [username, setUsername] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setAvatarPreview(currentUser.avatar || "");
      setSelectedFile(null);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, GIF, WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Dung lượng file quá lớn. Vui lòng chọn file dưới 5MB.");
      return;
    }

    setErrorMsg("");
    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg("Tên người dùng không được để trống");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let avatarUrl = currentUser.avatar;

      // 1. Upload avatar to Supabase if a new file is selected
      if (selectedFile) {
        avatarUrl = await uploadImageToSupabase(selectedFile, SUPABASE_BUCKETS.AVATAR);
      }

      // 2. Update profile in database
      await authApi.updateProfile({
        username: username.trim(),
        avatar: avatarUrl,
      });

      setSuccessMsg("Cập nhật thông tin thành công!");
      setSelectedFile(null);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Lỗi cập nhật hồ sơ:", err);
      setErrorMsg(err.message || "Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const initial = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-label="Đóng"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md bg-[#241209] border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X size={16} />
        </button>

        <h2 className="text-xl font-bold text-center text-amber-400 mb-6 font-serif">
          Cập nhật hồ sơ
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-2">
            <div
              onClick={handleAvatarClick}
              className="relative w-24 h-24 rounded-full bg-[#5D4037] text-white flex items-center justify-center text-3xl font-bold shadow-md cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-amber-500 transition-all overflow-hidden group"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
              ) : (
                initial
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAvatarClick}
              className="text-xs text-amber-500/80 hover:text-amber-400 transition-colors flex items-center gap-1.5 mt-1 cursor-pointer bg-transparent border-none"
            >
              <Camera size={12} />
              Thay đổi ảnh đại diện
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/60 flex items-center gap-1.5">
              <Mail size={12} />
              Địa chỉ Email (Không thể thay đổi)
            </label>
            <div className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-400 text-sm select-none">
              {currentUser.email || "Chưa cập nhật email"}
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-1.5">
            <label htmlFor="username-input" className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/80 flex items-center gap-1.5">
              <User size={12} />
              Tên người dùng
            </label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--brand-primary-18)] bg-white/5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              placeholder="Nhập tên người dùng..."
              required
            />
          </div>

          {/* Error and Success Alert */}
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl leading-relaxed">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl leading-relaxed">
              {successMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-semibold cursor-pointer disabled:opacity-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#2c1810] text-sm font-semibold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
