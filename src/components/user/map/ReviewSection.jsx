import { useState } from "react";
import { Star, ChevronDown, ChevronUp, Loader2, UserCircle2, Send } from "lucide-react";
import { usePlaceReviews, useCreateReview } from "@/api/useLocationQuery";
import { useQueryClient } from "@tanstack/react-query";

// ── helpers ──────────────────────────────────────────────────────────────────

function StarBar({ value, max = 5, size = 14, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const filled = interactive ? star <= (hovered || value) : star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`transition-transform ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
            aria-label={`${star} sao`}
          >
            <Star
              size={size}
              className={filled ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
            />
          </button>
        );
      })}
    </div>
  );
}

function RatingBar({ rating, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-3 text-right text-gray-500">{rating}</span>
      <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-5 text-right text-gray-400">{count}</span>
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

// ── ReviewCard ────────────────────────────────────────────────────────────────

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 120;
  const text = review.comment || "";
  const isLong = text.length > LIMIT;

  return (
    <div className="flex gap-2.5">
      {/* Avatar */}
      {review.user?.avatar ? (
        <img
          src={review.user.avatar}
          alt={review.user.username}
          className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
        />
      ) : (
        <UserCircle2 size={32} className="shrink-0 text-gray-300" />
      )}

      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-semibold text-gray-800">
            {review.user?.username || "Người dùng ẩn danh"}
          </span>
          <StarBar value={review.rating} size={11} />
          <span className="ml-auto text-[10px] text-gray-400 shrink-0">
            {timeAgo(review.created_at)}
          </span>
        </div>

        {/* Comment */}
        {text && (
          <div className="mt-0.5">
            <p className="text-[12px] leading-relaxed text-gray-600">
              {isLong && !expanded ? `${text.slice(0, LIMIT)}…` : text}
            </p>
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-0.5 flex items-center gap-0.5 text-[11px] text-blue-500 hover:underline"
              >
                {expanded ? (
                  <><ChevronUp size={12} /> Thu gọn</>
                ) : (
                  <><ChevronDown size={12} /> Xem thêm</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── WriteReviewForm ───────────────────────────────────────────────────────────

function WriteReviewForm({ placeId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateReview();

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) { setError("Vui lòng chọn số sao."); return; }
    if (!token) { setError("Bạn cần đăng nhập để đánh giá."); return; }
    setError("");

    mutate(
      { placeId, rating, comment: comment.trim(), token },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
          queryClient.invalidateQueries({ queryKey: ["place-reviews", placeId] });
          onSuccess?.();
        },
        onError: (err) => setError(err?.message || "Có lỗi xảy ra, thử lại nhé."),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <p className="mb-2 text-[12px] font-semibold text-gray-700">Viết đánh giá của bạn</p>

      {/* Stars */}
      <div className="flex items-center gap-2 mb-2">
        <StarBar value={rating} size={20} interactive onRate={setRating} />
        {rating > 0 && (
          <span className="text-[12px] text-amber-600 font-medium">
            {["", "Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"][rating]}
          </span>
        )}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Chia sẻ trải nghiệm của bạn... (tuỳ chọn)"
        rows={2}
        maxLength={500}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[12px] text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
      />

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">{comment.length}/500</span>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          Gửi đánh giá
        </button>
      </div>
    </form>
  );
}

// ── ReviewSection (main export) ───────────────────────────────────────────────

const PAGE_SIZE = 5;

export default function ReviewSection({ placeId }) {
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = usePlaceReviews(placeId);

  const reviews = data?.reviews ?? [];
  const total = data?.total ?? 0;
  const ratingAvg = data?.rating_avg;

  // Thống kê theo sao
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    rating: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  const displayed = showAll ? reviews : reviews.slice(0, PAGE_SIZE);

  // Skeleton
  if (isLoading) {
    return (
      <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-2.5 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="h-2.5 w-full rounded bg-gray-100" />
              <div className="h-2.5 w-3/4 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      {/* ── Header + Rating Summary ── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-bold text-gray-800">
            Đánh giá{total > 0 && <span className="ml-1 text-gray-400 font-normal">({total})</span>}
          </p>
          {ratingAvg !== null && (
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-[22px] font-extrabold text-gray-900 leading-none">
                {Number(ratingAvg).toFixed(1)}
              </span>
              <div>
                <StarBar value={ratingAvg} size={13} />
                <p className="text-[10px] text-gray-400 mt-0.5">trên 5</p>
              </div>
            </div>
          )}
        </div>

        {/* Rating bars */}
        {total > 0 && (
          <div className="flex-1 space-y-0.5 max-w-[140px]">
            {starCounts.map(({ rating, count }) => (
              <RatingBar key={rating} rating={rating} count={count} total={total} />
            ))}
          </div>
        )}
      </div>

      {/* ── Write review toggle ── */}
      <button
        type="button"
        onClick={() => setShowForm((v) => !v)}
        className="mt-2.5 w-full rounded-xl border border-dashed border-blue-300 py-2 text-[12px] font-medium text-blue-600 hover:bg-blue-50 transition-colors"
      >
        {showForm ? "Ẩn form đánh giá" : "✏️  Viết đánh giá"}
      </button>

      {showForm && (
        <WriteReviewForm
          placeId={placeId}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* ── Reviews list ── */}
      {total === 0 ? (
        <p className="mt-3 text-center text-[12px] text-gray-400">
          Chưa có đánh giá nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {displayed.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}

          {total > PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="w-full rounded-xl border border-gray-200 py-2 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {showAll
                ? "Thu gọn"
                : `Xem thêm ${total - PAGE_SIZE} đánh giá`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
