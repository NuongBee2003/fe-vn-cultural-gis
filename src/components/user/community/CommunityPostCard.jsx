import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Send, Share2, Loader2, Pencil, Trash2, Check, X as XIcon, MapPin } from "lucide-react";
import { createComment, updateComment, deleteComment } from "@/api/commentApi";
import { toggleLikePost, getPostDetail } from "@/api/postApi";
import PostLikesModal from "./PostLikesModal";
import CommentItem from "./CommentItem";
import { useNotify } from "@/context/NotifyContext";
import MentionInput, { getPlainTextFromMarkup } from "@/components/ui/input/MentionInput";
import { useMentionUsers } from "@/hooks/useMentionUsers";
import ImageMasonryGallery from "@/components/user/map/ImageMasonryGallery";

// ─── helpers ────────────────────────────────────────────────────────────────

function getInitials(name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/g).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function getStatusBadge(status) {
  if (status === "published" || status === "accepted")
    return { label: "Đã duyệt",   className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (status === "rejected")
    return { label: "Bị từ chối", className: "bg-rose-50 text-rose-700 border-rose-200" };
  return   { label: "Chờ duyệt",  className: "bg-amber-50 text-amber-700 border-amber-200" };
}

// ─── main component ──────────────────────────────────────────────────────────

export default function CommunityPostCard({ post, showStatus = false, highlightCommentId = null }) {
  const notify = useNotify();
  const navigate = useNavigate();
  const mentionUsers = useMentionUsers(); // singleton cache — không gọi API thêm
  
  const isLogin = localStorage.getItem("isLogin") === "true" || !!localStorage.getItem("token");

  const [localComments, setLocalComments] = useState(post.comments || []);
  const [liked, setLiked] = useState(post.likedYN === "Y");
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const [mainCommentDraft, setMainCommentDraft] = useState("");
  const [mainMentionIds, setMainMentionIds] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  
  const [replyToId, setReplyToId] = useState(null);
  const [draft, setDraft] = useState("");
  const [draftMentionIds, setDraftMentionIds] = useState([]);

  // Image Gallery states
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const allAssets = post.assets || [];
  const galleryImages = allAssets.map(a => a.url);

  const handleImageClick = (index) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  /**
   * Render text và highlight @username.
   * Chỉ highlight nếu username thực sự tồn tại trong hệ thống.
   * Sắp xếp username theo độ dài giảm dần để tránh prefix matching sai.
   */
  const renderContent = useCallback((text) => {
    if (!text) return null;
    if (mentionUsers.length === 0) return text;

    const escapedNames = mentionUsers
      .map((u) => u.display.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);

    const pattern = new RegExp(`@(${escapedNames.join("|")})`, "g");
    const parts   = [];
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
      parts.push(
        <span key={match.index} className="text-amber-600 font-semibold">
          {match[0]}
        </span>
      );
      lastIndex = pattern.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts.length > 0 ? parts : text;
  }, [mentionUsers]);

  // ── commentsTree (flat list → nested tree) ─────────────────────────────────
  const commentsTree = useMemo(() => {
    const normalized = (localComments || []).map((c) => ({
      ...c,
      createdAtLabel: c.createdAtLabel || (c.created_at ? formatDateTime(c.created_at) : ""),
      author: {
        name:   c.author?.name   || c.user?.username || "Ẩn danh",
        avatar: c.author?.avatar || c.user?.avatar   || "",
      },
    }));

    const byId    = Object.fromEntries(normalized.map((c) => [c.id, { ...c, replies: [] }]));
    const roots   = [];

    normalized.forEach((c) => {
      if (c.parent_id && byId[c.parent_id]) {
        byId[c.parent_id].replies.push(byId[c.id]);
      } else {
        roots.push(byId[c.id]);
      }
    });

    return roots;
  }, [localComments]);

  // ── handlers ───────────────────────────────────────────────────────────────
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

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditDraft(comment.content);
    setReplyToId(null);
  };

  const handleSaveEdit = async (commentId) => {
    const text = getPlainTextFromMarkup(editDraft).trim();
    if (!text) return;
    setIsSavingEdit(true);
    try {
      const res = await updateComment(commentId, text);
      setLocalComments((prev) =>
        prev.map((c) => c.id === commentId ? { ...c, content: res?.content ?? text } : c)
      );
      setEditingCommentId(null);
      setEditDraft("");
    } catch (err) {
      console.error("Lỗi khi sửa bình luận:", err);
      notify.error(err.message || "Không thể sửa bình luận lúc này");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const ok = await notify.confirm("Xóa bình luận này?", { title: "Xóa bình luận", confirmLabel: "Xóa" });
    if (!ok) return;
    setDeletingCommentId(commentId);
    try {
      await deleteComment(commentId);
      setLocalComments((prev) => prev.filter((c) => c.id !== commentId && c.parent_id !== commentId));
    } catch (err) {
      console.error("Lỗi khi xóa bình luận:", err);
      notify.error(err.message || "Không thể xóa bình luận lúc này");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handlePostMainComment = async () => {
    const text = getPlainTextFromMarkup(mainCommentDraft).trim();
    if (!text) return;
    setIsSubmittingComment(true);
    try {
      const res = await createComment({ post_id: post.id, content: text, parent_id: null, mentioned_user_ids: mainMentionIds });
      setLocalComments((prev) => [
        ...prev,
        { id: res.id, content: res.content, createdAtLabel: "Vừa xong", editYN: "Y", delYN: "Y",
          author: { name: res.user?.username || "Bạn", avatar: res.user?.avatar || "" } },
      ]);
      setMainCommentDraft("");
      setMainMentionIds([]);
    } catch (err) {
      console.error("Lỗi khi đăng bình luận:", err);
      notify.error(err.message || "Không thể đăng bình luận lúc này");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handlePostReplyComment = async (parentId) => {
    const text = getPlainTextFromMarkup(draft).trim();
    if (!text) return;
    try {
      const res = await createComment({ post_id: post.id, content: text, parent_id: parentId, mentioned_user_ids: draftMentionIds });
      setLocalComments((prev) => [
        ...prev,
        { id: res.id, parent_id: res.parent_id, content: res.content, createdAtLabel: "Vừa xong",
          editYN: "Y", delYN: "Y", author: { name: res.user?.username || "Bạn", avatar: res.user?.avatar || "" } },
      ]);
      setDraft("");
      setDraftMentionIds([]);
      setReplyToId(null);
    } catch (err) {
      console.error("Lỗi khi đăng phản hồi:", err);
      notify.error(err.message || "Không thể gửi phản hồi lúc này");
    }
  };

  const handleCommentToggle = async () => {
    const nextVal = !commentsOpen;
    setCommentsOpen(nextVal);
    if (nextVal) {
      try {
        const latest = await getPostDetail(post.id);
        if (latest) {
          setLocalComments(latest.comments || []);
          setLiked(latest.likedYN === "Y");
          setLikeCount(latest.likeCount ?? 0);
        }
      } catch (err) {
        console.error("Lỗi khi tải bình luận:", err);
      }
    }
  };

  // ── derived ────────────────────────────────────────────────────────────────
  const badge        = getStatusBadge(post.status);
  const primaryAsset = post.assets.find((a) => a.is_primary) || post.assets[0];
  const extraAssets  = primaryAsset ? post.assets.filter((a) => a.id !== primaryAsset.id) : post.assets;

  /** Props chung truyền xuống mọi CommentItem */
  const commentSharedProps = {
    isLogin, mentionUsers, renderContent, highlightCommentId,
    editingCommentId, setEditingCommentId,
    editDraft, setEditDraft, isSavingEdit, handleSaveEdit, handleEditComment,
    deletingCommentId, handleDeleteComment,
    replyToId, setReplyToId,
    draft, setDraft, draftMentionIds, setDraftMentionIds,
    handlePostReplyComment,
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ── Header bài viết ── */}
        <header className="flex items-start gap-3 p-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-semibold">
            {getInitials(post.author.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{post.author.name}</p>
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
            <span>{localComments.length} bình luận</span>
          </div>

          {/* Nút Like / Bình luận */}
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
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
              onClick={handleCommentToggle}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <MessageCircle size={16} className="text-slate-500" />
              Bình luận
            </button>
          </div>

          {/* ── Khu vực bình luận ── */}
          {commentsOpen && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Bình luận</h3>

              {/* Ô nhập bình luận chính */}
              {isLogin ? (
                <div className="flex items-center gap-2 mb-4">
                  <MentionInput
                    value={mainCommentDraft}
                    onChange={(e) => setMainCommentDraft(e.target.value)}
                    onMentionsChange={setMainMentionIds}
                    placeholder="Viết bình luận công khai..."
                    disabled={isSubmittingComment}
                    wrapperClassName="flex-1 h-10 color-black rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100/40 focus-within:bg-white focus-within:border-amber-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handlePostMainComment}
                    disabled={isSubmittingComment || !mainCommentDraft.trim()}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-opacity"
                    aria-label="Gửi bình luận"
                    title="Gửi"
                  >
                    {isSubmittingComment ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mb-4">Vui lòng đăng nhập để bình luận.</p>
              )}

              {/* Danh sách bình luận (đệ quy) */}
              {commentsTree.length > 0 ? (
                <div className="space-y-4">
                  {commentsTree.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      depth={0}
                      {...commentSharedProps}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Chưa có bình luận nào.</p>
              )}
            </div>
          )}
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
