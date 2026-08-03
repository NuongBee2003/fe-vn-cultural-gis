import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Flag, X, Loader2, CheckCircle2, AlertCircle, MapPin, MessageSquare } from "lucide-react";
import { createReport } from "@/api/user/reportApi";

const LOCATION_OPTIONS = [
  { id: "WRONG_LOCATION", label: "Vị trí không chính xác / sai vị trí trên bản đồ" },
  { id: "CLOSED", label: "Địa điểm đã ngừng hoạt động / đóng cửa" },
  { id: "INCORRECT_INFO", label: "Thông tin địa điểm sai sự thật" },
  { id: "INAPPROPRIATE_CONTENT", label: "Hình ảnh hoặc nội dung không phù hợp" },
  { id: "OTHER", label: "Ý kiến khác" },
];

const COMMENT_OPTIONS = [
  { id: "OFFENSIVE", label: "Nội dung phản cảm, thô tục hoặc xúc phạm" },
  { id: "SPAM", label: "Spam, tin rác hoặc quảng cáo trái phép" },
  { id: "FAKE_NEWS", label: "Thông tin sai sự thật, tin giả" },
  { id: "HATE_SPEECH", label: "Ngôn từ gây thù ghét hoặc kích động" },
  { id: "OTHER", label: "Ý kiến khác" },
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType = "location", // "location" | "comment" | "review"
  targetData = null,
}) {
  const options = targetType === "location" ? LOCATION_OPTIONS : COMMENT_OPTIONS;

  const [selectedOptionId, setSelectedOptionId] = useState(options[0].id);
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedOptionId(options[0].id);
      setCustomReason("");
      setError("");
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, targetType]);

  if (!isOpen) return null;

  const isOther = selectedOptionId === "OTHER";
  const selectedOptionObj = options.find((opt) => opt.id === selectedOptionId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedOptionId) {
      setError("Vui lòng chọn một lý do báo cáo.");
      return;
    }

    if (isOther && !customReason.trim()) {
      setError("Vui lòng nhập lý do khác của bạn.");
      return;
    }

    try {
      setIsSubmitting(true);

      const reportTypeLabel = selectedOptionObj ? selectedOptionObj.label : "Khác";
      const payload = {
        location_id: targetType === "location" ? targetData?.id : undefined,
        comment_id: targetType === "comment" ? targetData?.id : undefined,
        review_id: targetType === "review" ? targetData?.id : undefined,
        report_type: reportTypeLabel,
        description: isOther ? customReason.trim() : reportTypeLabel,
      };

      await createReport(payload);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity duration-200">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Flag size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {targetType === "location" ? "Báo cáo địa điểm" : targetType === "review" ? "Báo cáo đánh giá" : "Báo cáo bình luận"}
              </h3>
              <p className="text-xs text-slate-500">Giúp chúng tôi giữ môi trường thông tin tin cậy</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">Đã gửi báo cáo!</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Cảm ơn đóng góp của bạn. Ban quản trị sẽ xác minh và xử lý trong thời gian sớm nhất.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Target Item Preview */}
            {targetData && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                {targetType === "location" ? (
                  <>
                    <MapPin size={18} className="mt-0.5 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {targetData.name || "Địa điểm chưa đặt tên"}
                      </p>
                      {targetData.address && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{targetData.address}</p>
                      )}
                    </div>
                  </>
                ) : targetType === "review" ? (
                  <>
                    <MessageSquare size={18} className="mt-0.5 shrink-0 text-amber-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">
                        Đánh giá của {targetData.user?.username || targetData.author?.name || "(Ẩn danh)"} ({targetData.rating} ⭐)
                      </p>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        "{targetData.comment || "Không có nhận xét"}"
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <MessageSquare size={18} className="mt-0.5 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">
                        Bình luận của {targetData.author?.name || targetData.user?.username || "(Ẩn danh)"}
                      </p>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        "{targetData.content}"
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Radio Options List */}
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Vui lòng chọn lý do báo cáo:
              </label>
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "border-rose-300 bg-rose-50/40 ring-2 ring-rose-100"
                        : "border-slate-200 bg-white hover:bg-slate-50/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_reason"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setSelectedOptionId(opt.id)}
                      className="h-4 w-4 accent-rose-600 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <span className={`text-xs font-medium ${isSelected ? "text-rose-900 font-semibold" : "text-slate-700"}`}>
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Custom Reason Textarea - Enabled ONLY when "OTHER" is selected */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Lý do khác / Chi tiết bổ sung
                </label>
                {!isOther && (
                  <span className="text-[10px] italic text-slate-400">
                    (Chỉ nhập khi chọn "Ý kiến khác")
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                disabled={!isOther}
                placeholder={
                  isOther
                    ? "Mô tả cụ thể vấn đề hoặc lý do bạn muốn báo cáo..."
                    : "Chỉ cho phép nhập khi bạn chọn tùy chọn 'Ý kiến khác' ở trên."
                }
                className={`w-full rounded-xl border px-3 py-2.5 text-xs transition-colors focus:outline-none ${
                  isOther
                    ? "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed resize-none"
                }`}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                <AlertCircle size={15} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Flag size={14} />
                    Gửi báo cáo
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
