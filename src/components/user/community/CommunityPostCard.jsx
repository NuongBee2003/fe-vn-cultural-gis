import { useState, useMemo, useCallback } from "react";
import { Heart, MessageCircle, Send, Share2, Loader2, Pencil, Trash2, Check, X as XIcon } from "lucide-react";
import { createComment, updateComment, deleteComment } from "@/api/commentApi";
import { toggleLikePost } from "@/api/postApi";
import { useNotify } from "@/context/NotifyContext";
import MentionInput, { getPlainTextFromMarkup } from "@/components/ui/input/MentionInput";
import { useMentionUsers } from "@/hooks/useMentionUsers";

function getInitials(name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/g).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function getStatusBadge(status) {
  if (status === "published" || status === "accepted") {
    return {
      label: "Đã duyệt",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
  if (status === "rejected") {
    return {
      label: "Bị từ chối",
      className: "bg-rose-50 text-rose-700 border-rose-200",
    };
  }

  return {
    label: "Chờ duyệt",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  };
}

export default function CommunityPostCard({ post, showStatus = false }) {
  const notify = useNotify();
  const mentionUsers = useMentionUsers(); // singleton cache — không gọi API thêm

  /**
   * Render text và highlight @username.
   * Chỉ highlight nếu username thực sự tồn tại trong hệ thống.
   * Sắp xếp username theo độ dài giảm dần để tránh prefix matching sai.
   */
  const renderContent = useCallback((text) => {
    if (!text) return null;
    if (mentionUsers.length === 0) return text; // chưa load xong → trả về plain text

    // Escape ky tự đặc biệt trong username trước khi đưa vào regex
    const escapedNames = mentionUsers
      .map((u) => u.display.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length); // dài hơn được match trước

    const pattern = new RegExp(`@(${escapedNames.join("|")})`, "g");
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      // Phần text thường trước mention
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <span key={match.index} className="text-amber-600 font-semibold">
          {match[0]}
        </span>
      );
      lastIndex = pattern.lastIndex;
    }

    // Phần text còn lại sau mention cuối
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  }, [mentionUsers]);

  const badge = getStatusBadge(post.status);
  const primaryAsset = post.assets.find((a) => a.is_primary) || post.assets[0];
  const extraAssets = primaryAsset
    ? post.assets.filter((a) => a.id !== primaryAsset.id)
    : post.assets;

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [replyToId, setReplyToId] = useState(null);
  const [draft, setDraft] = useState("");
  const [draftMentionIds, setDraftMentionIds] = useState([]);      // IDs được @ trong reply
  const [localComments, setLocalComments] = useState(() => post.comments || []);
  const [mainCommentDraft, setMainCommentDraft] = useState("");
  const [mainMentionIds, setMainMentionIds] = useState([]);         // IDs được @ trong bình luận chính
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Edit/Delete comment state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const isLogin = localStorage.getItem("isLogin") === "true" || !!token;

  const [liked, setLiked] = useState(post.likedYN === "Y");
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleToggleLike = async () => {
    if (!isLogin) {
      notify.warning("Vui lòng đăng nhập để thích bài viết", "Chưa đăng nhập");
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
    try {
      const res = await toggleLikePost(post.id);
      setLiked(res.likedYN === "Y");
      setLikeCount(res.likeCount);
    } catch (err) {
      // Revert nếu lỗi
      setLiked(!newLiked);
      setLikeCount((prev) => prev + (newLiked ? -1 : 1));
      console.error("Lỗi khi thích bài viết:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditDraft(comment.content); // plain text – MentionInput sẽ parse @username
    setReplyToId(null);
  };

  const handleSaveEdit = async (commentId) => {
    const text = getPlainTextFromMarkup(editDraft).trim();
    if (!text) return;
    setIsSavingEdit(true);
    try {
      const res = await updateComment(commentId, text);
      setLocalComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: res?.content ?? text } : c
        )
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
      setLocalComments((prev) =>
        prev.filter((c) => c.id !== commentId && c.parent_id !== commentId)
      );
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
      const res = await createComment({
        post_id: post.id,
        content: text,
        parent_id: null,
        mentioned_user_ids: mainMentionIds,  // IDs chính xác từ react-mentions
      });

      const formatted = {
        id: res.id,
        content: res.content,
        createdAtLabel: "Vừa xong",
        editYN: "Y",
        delYN: "Y",
        author: {
          name: res.user?.username || "Bạn",
          avatar: res.user?.avatar || ""
        }
      };

      setLocalComments((prev) => [...prev, formatted]);
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
      const res = await createComment({
        post_id: post.id,
        content: text,
        parent_id: parentId,
        mentioned_user_ids: draftMentionIds,  // IDs chính xác từ react-mentions
      });

      const formatted = {
        id: res.id,
        parent_id: res.parent_id,
        content: res.content,
        createdAtLabel: "Vừa xong",
        editYN: "Y",
        delYN: "Y",
        author: {
          name: res.user?.username || "Bạn",
          avatar: res.user?.avatar || ""
        }
      };

      setLocalComments((prev) => [...prev, formatted]);
      setDraft("");
      setDraftMentionIds([]);
      setReplyToId(null);
    } catch (err) {
      console.error("Lỗi khi đăng phản hồi:", err);
      notify.error(err.message || "Không thể gửi phản hồi lúc này");
    }
  };

  const commentsTree = useMemo(() => {
    const list = localComments || [];
    const topLevel = list.filter((c) => !c.parent_id);
    const replies = list.filter((c) => c.parent_id);
    
    return topLevel.map((parent) => {
      const parentReplies = replies.filter(
        (r) => Number(r.parent_id) === Number(parent.id)
      );
      return {
        ...parent,
        replies: parentReplies,
      };
    });
  }, [localComments]);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
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
              <span
                className={
                  "ml-auto rounded-full border px-2 py-1 text-[10px] font-semibold " +
                  badge.className
                }
              >
                {badge.label}
              </span>
            )}
          </div>
          <h2 className="mt-1 text-base font-semibold text-slate-900 leading-snug">
            {post.title}
          </h2>

          {(post.category || post.location?.name) ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {post.category ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                  {post.category}
                </span>
              ) : null}
              {post.location?.name ? (
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                  {post.location.name}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <div className="px-4 pb-4">
        <div className="space-y-3">
          {String(post.content || "")
            .split(/\n\n+/g)
            .map((para, idx) => (
              <p key={idx} className="text-sm leading-6 text-slate-700">
                {para}
              </p>
            ))}
        </div>

        {primaryAsset ? (
          <div className="mt-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={primaryAsset.url}
                alt="Ảnh bài viết"
                className="h-72 w-full object-cover sm:h-96"
                loading="lazy"
              />
            </div>

            {extraAssets.length ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {extraAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={asset.url}
                      alt="Ảnh bài viết"
                      className="h-28 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{likeCount} lượt thích</span>
          <span>{localComments.length} bình luận</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all
              ${liked
                ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                : "text-slate-700 hover:bg-slate-50"
              } disabled:opacity-60`}
          >
            <Heart
              size={16}
              className={`transition-transform duration-150 ${liked ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-500"}`}
            />
            Thích
          </button>
          <button
            type="button"
            onClick={() => setCommentsOpen((v) => !v)}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <MessageCircle size={16} className="text-slate-500" />
            Bình luận
          </button>
        </div>

        {commentsOpen ? (
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
                  wrapperClassName="flex-1 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100/40 focus-within:bg-white focus-within:border-amber-400 transition-all"
                />
                <button
                  type="button"
                  onClick={handlePostMainComment}
                  disabled={isSubmittingComment || !mainCommentDraft.trim()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-opacity"
                  aria-label="Gửi bình luận"
                  title="Gửi"
                >
                  {isSubmittingComment ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mb-4">
                Vui lòng đăng nhập để bình luận.
              </p>
            )}

            {/* Danh sách bình luận dạng phân cấp */}
            {commentsTree.length ? (
              <div className="space-y-4">
                {commentsTree.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    {/* Bình luận gốc */}
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-semibold">
                        {comment.author?.avatar ? (
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(comment.author?.name)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="rounded-2xl bg-slate-50 px-3 py-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-semibold text-slate-900">
                              {comment.author?.name || "(Ẩn danh)"}
                            </p>
                            <span className="text-slate-300">•</span>
                            <p className="text-xs text-slate-500">
                              {comment.createdAtLabel}
                            </p>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            {renderContent(comment.content)}
                          </p>
                        </div>

                        {/* Nút phản hồi + sửa + xóa */}
                        {isLogin && (
                          <div className="mt-1.5 flex items-center gap-3 px-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyToId(comment.id);
                                const authorName = comment.author?.name || "";
                                const matchedUser = mentionUsers.find(u => u.display === authorName);
                                if (matchedUser) {
                                  setDraft(`@[${matchedUser.display}](${matchedUser.id}) `);
                                  setDraftMentionIds([matchedUser.id]);
                                } else if (authorName) {
                                  setDraft(`@${authorName} `);
                                  setDraftMentionIds([]);
                                } else {
                                  setDraft("");
                                  setDraftMentionIds([]);
                                }
                                setEditingCommentId(null);
                              }}
                              className="text-xs font-medium text-amber-600 hover:text-amber-800"
                            >
                              Trả lời
                            </button>
                            {comment.editYN === "Y" && editingCommentId !== comment.id && (
                              <button
                                type="button"
                                onClick={() => handleEditComment(comment)}
                                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
                              >
                                <Pencil size={11} /> Sửa
                              </button>
                            )}
                            {comment.delYN === "Y" && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deletingCommentId === comment.id}
                                className="text-xs font-medium text-rose-500 hover:text-rose-700 flex items-center gap-1 disabled:opacity-50"
                              >
                                {deletingCommentId === comment.id
                                  ? <Loader2 size={11} className="animate-spin" />
                                  : <Trash2 size={11} />} Xóa
                              </button>
                            )}
                          </div>
                        )}

                        {/* Inline edit form */}
                        {editingCommentId === comment.id && (
                          <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50/50 p-3">
                            <MentionInput
                              multiLine
                              rows={2}
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              wrapperClassName="w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/70"
                            />
                            <div className="mt-2 flex items-center gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => { setEditingCommentId(null); setEditDraft(""); }}
                                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                              >
                                <XIcon size={12} /> Hủy
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(comment.id)}
                                disabled={isSavingEdit || !editDraft.trim()}
                                className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                              >
                                {isSavingEdit ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Lưu
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Form phản hồi lồng ngay dưới bình luận gốc */}
                        {replyToId === comment.id && (
                          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3">
                            <p className="text-xs text-slate-500">
                              Đang trả lời <span className="font-medium text-slate-700">{comment.author?.name}</span>
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <MentionInput
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onMentionsChange={setDraftMentionIds}
                                placeholder="Viết phản hồi..."
                                wrapperClassName="flex-1 h-10 rounded-full border border-slate-200 bg-white focus-within:border-amber-400 transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => handlePostReplyComment(comment.id)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800"
                                aria-label="Gửi phản hồi"
                                title="Gửi"
                              >
                                <Send size={16} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyToId(null);
                                setDraft("");
                              }}
                              className="mt-2 text-xs font-medium text-slate-500 hover:text-slate-700"
                            >
                              Hủy
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Replies (bình luận con) */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-[18px] pl-11 border-l-2 border-slate-100 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <div className="h-7 w-7 shrink-0 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-semibold">
                              {reply.author?.avatar ? (
                                <img
                                  src={reply.author.avatar}
                                  alt={reply.author.name}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                getInitials(reply.author?.name)
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="rounded-2xl bg-slate-50 px-3 py-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-xs font-semibold text-slate-900">
                                    {reply.author?.name || "(Ẩn danh)"}
                                  </p>
                                  <span className="text-slate-300">•</span>
                                  <p className="text-xs text-slate-500">
                                    {reply.createdAtLabel}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm leading-6 text-slate-700">
                                  {renderContent(reply.content)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Chưa có bình luận nào.</p>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
