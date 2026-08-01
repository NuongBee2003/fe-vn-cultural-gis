import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Loader2, MapPin } from "lucide-react";
import { toggleLikePost, sharePost } from "@/api/user/postApi";
import PostLikesModal from "./PostLikesModal";
import { useNotify } from "@/context/NotifyContext";
import ImageMasonryGallery from "@/components/user/map/ImageMasonryGallery";

function getInitials(name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/g).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function getStatusBadge(status) {
  if (status === "published" || status === "accepted")
    return { label: "Đã duyệt",   className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (status === "rejected")
    return { label: "Bị từ chối", className: "bg-rose-50 text-rose-700 border-rose-200" };
  return   { label: "Chờ duyệt",  className: "bg-amber-50 text-amber-700 border-amber-200" };
}

export default function CommunityPostCard({
  post,
  showStatus = false,
  onCommentClick = null
}) {
  const notify = useNotify();
  const navigate = useNavigate();
  
  const isLogin = localStorage.getItem("isLogin") === "true" || !!localStorage.getItem("token");

  const [liked, setLiked] = useState(post.likedYN === "Y");
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Sync likes state if post changes
  useEffect(() => {
    setLiked(post.likedYN === "Y");
    setLikeCount(post.likeCount || 0);
  }, [post.likedYN, post.likeCount]);

  // Image Gallery states
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const allAssets = post.assets || [];
  const galleryImages = allAssets.map(a => a.url);

  const handleImageClick = (index) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const handleToggleLike = async () => {
    if (!isLogin) { notify.warning("Vui lòng đăng nhập để thích bài viết", "Chưa đăng nhập"); return; }
    if (isLiking) return;
    setIsLiking(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
    try {
      const res = await toggleLikePost(post.id);
      setLiked(res.likedYN === "Y");
      setLikeCount(res.likeCount);
    } catch (err) {
      setLiked(!newLiked);
      setLikeCount((prev) => prev + (newLiked ? -1 : 1));
      console.error("Lỗi khi thích bài viết:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const res = await sharePost(post.id);
      if (res && res.shareUrl) {
        await navigator.clipboard.writeText(res.shareUrl);
        notify.success("Đã sao chép liên kết chia sẻ vào bộ nhớ tạm!", "Chia sẻ bài viết");
      } else {
        throw new Error("Không lấy được đường dẫn chia sẻ");
      }
    } catch (err) {
      console.error("Lỗi khi chia sẻ bài viết:", err);
      notify.error(err.message || "Không thể chia sẻ bài viết lúc này");
    } finally {
      setIsSharing(false);
    }
  };

  const badge = getStatusBadge(post.status);
  const commentCount = post.comments ? post.comments.length : 0;

  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ── Header bài viết ── */}
        <header className="flex items-start gap-3 p-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-semibold">
            {getInitials(post.author?.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{post.author?.name}</p>
              <span className="text-slate-300">•</span>
              <p className="text-xs text-slate-500">{post.createdAtLabel}</p>
              {showStatus && (
                <span className={"ml-auto rounded-full border px-2 py-1 text-[10px] font-semibold " + badge.className}>
                  {badge.label}
                </span>
              )}
            </div>
            <h2 className="mt-1 text-base font-semibold text-slate-900 leading-snug">{post.title}</h2>

          {(post.category || post.location?.name) ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {post.category ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                  {post.category}
                </span>
              ) : null}
              {post.location?.name ? (
                <button
                  type="button"
                  onClick={() => {
                    if (post.location.lat && post.location.lng) {
                      navigate(
                        `/?lat=${post.location.lat}&lng=${post.location.lng}&location_id=${post.location.id}&name=${encodeURIComponent(post.location.name)}`
                      );
                    }
                  }}
                  className="rounded-full bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 text-[11px] font-medium text-indigo-700 transition-colors cursor-pointer border-none flex items-center gap-1.5"
                >
                  <MapPin size={11} className="shrink-0" />
                  {post.location.name}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

        {/* ── Body bài viết ── */}
        <div className="px-4 pb-4">
          {/* Nội dung văn bản */}
          <div className="space-y-3">
            {String(post.content || "").split(/\n\n+/g).map((para, idx) => (
              <p key={idx} className="text-sm leading-6 text-slate-700">{para}</p>
            ))}
          </div>

          {/* Ảnh */}
          {allAssets.length > 0 && (
            <div className="mt-4">
              {allAssets.length === 1 && (
                <div 
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer"
                  onClick={() => handleImageClick(0)}
                >
                  <img src={allAssets[0].url} alt="Ảnh bài viết" className="max-h-[500px] w-full object-contain bg-black/5" loading="lazy" />
                </div>
              )}
              {allAssets.length === 2 && (
                <div className="grid grid-cols-2 gap-2">
                  {allAssets.map((asset, idx) => (
                    <div 
                      key={asset.id} 
                      className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-pointer h-64"
                      onClick={() => handleImageClick(idx)}
                    >
                      <img src={asset.url} alt="Ảnh bài viết" className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
              {allAssets.length === 3 && (
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    className="col-span-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-pointer h-64 sm:h-80"
                    onClick={() => handleImageClick(0)}
                  >
                    <img src={allAssets[0].url} alt="Ảnh bài viết" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div 
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-pointer h-40"
                    onClick={() => handleImageClick(1)}
                  >
                    <img src={allAssets[1].url} alt="Ảnh bài viết" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div 
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-pointer h-40"
                    onClick={() => handleImageClick(2)}
                  >
                    <img src={allAssets[2].url} alt="Ảnh bài viết" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                </div>
              )}
              {allAssets.length >= 4 && (
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    className="col-span-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-pointer h-64 sm:h-80"
                    onClick={() => handleImageClick(0)}
                  >
                    <img src={allAssets[0].url} alt="Ảnh bài viết" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div 
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-pointer h-40"
                    onClick={() => handleImageClick(1)}
                  >
                    <img src={allAssets[1].url} alt="Ảnh bài viết" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div 
                    className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-pointer h-40"
                    onClick={() => handleImageClick(2)}
                  >
                    <img src={allAssets[2].url} alt="Ảnh bài viết" className="h-full w-full object-cover" loading="lazy" />
                    {allAssets.length > 3 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">+{allAssets.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Thống kê like / comment */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span
              onClick={() => setLikesModalOpen(true)}
              className="cursor-pointer hover:underline hover:text-slate-800 transition-colors font-medium"
            >
              {likeCount} lượt thích
            </span>
            <span
              onClick={() => onCommentClick && onCommentClick(post.id)}
              className="cursor-pointer hover:underline hover:text-slate-800 transition-colors font-medium"
            >
              {commentCount} bình luận
            </span>
          </div>

          {/* Nút Like / Bình luận / Chia sẻ */}
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleToggleLike}
              disabled={isLiking}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all
                ${liked ? "text-rose-500 bg-rose-50 hover:bg-rose-100" : "text-slate-700 hover:bg-slate-50"}
                disabled:opacity-60`}
            >
              <Heart
                size={16}
                className={`transition-transform duration-150 ${liked ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-500"}`}
              />
              Thích
            </button>
            <button
              type="button"
              onClick={() => onCommentClick && onCommentClick(post.id)}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <MessageCircle size={16} className="text-slate-500" />
              Bình luận
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={isSharing}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-all cursor-pointer"
            >
              {isSharing ? (
                <Loader2 size={16} className="animate-spin text-slate-500" />
              ) : (
                <Share2 size={16} className="text-slate-500" />
              )}
              Chia sẻ
            </button>
          </div>
        </div>
      </article>

      {/* Modal danh sách người thích */}
      {likesModalOpen && (
        <PostLikesModal postId={post.id} onClose={() => setLikesModalOpen(false)} />
      )}

      {/* Image Gallery */}
      {galleryImages.length > 0 && (
        <ImageMasonryGallery
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          images={galleryImages}
          title={post.title || "Hình ảnh bài viết"}
          initialIndex={galleryIndex}
        />
      )}
    </>
  );
}
