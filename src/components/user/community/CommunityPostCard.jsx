import { useState, useMemo } from "react";
import { Heart, MessageCircle, Send, Share2, Loader2 } from "lucide-react";
import { createComment } from "@/api/commentApi";

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
  const badge = getStatusBadge(post.status);
  const primaryAsset = post.assets.find((a) => a.is_primary) || post.assets[0];
  const extraAssets = primaryAsset
    ? post.assets.filter((a) => a.id !== primaryAsset.id)
    : post.assets;

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [replyToId, setReplyToId] = useState(null);
  const [draft, setDraft] = useState("");
  const [localComments, setLocalComments] = useState(() => post.comments || []);
  const [mainCommentDraft, setMainCommentDraft] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const isLogin = localStorage.getItem("isLogin") === "true" || !!token;

  const handlePostMainComment = async () => {
    const text = mainCommentDraft.trim();
    if (!text) return;

    setIsSubmittingComment(true);
    try {
      const res = await createComment({
        post_id: post.id,
        content: text,
        parent_id: null
      });

      const formatted = {
        id: res.id,
        content: res.content,
        createdAtLabel: "Vừa xong",
        author: {
          name: res.user?.username || "Bạn",
          avatar: res.user?.avatar || ""
        }
      };

      setLocalComments((prev) => [...prev, formatted]);
      setMainCommentDraft("");
    } catch (err) {
      console.error("Lỗi khi đăng bình luận:", err);
      alert(err.message || "Không thể đăng bình luận lúc này");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handlePostReplyComment = async (parentId) => {
    const text = draft.trim();
    if (!text) return;

    try {
      const res = await createComment({
        post_id: post.id,
        content: text,
        parent_id: parentId
      });

      const formatted = {
        id: res.id,
        parent_id: res.parent_id,
        content: res.content,
        createdAtLabel: "Vừa xong",
        author: {
          name: res.user?.username || "Bạn",
          avatar: res.user?.avatar || ""
        }
      };

      setLocalComments((prev) => [...prev, formatted]);
      setDraft("");
      setReplyToId(null);
    } catch (err) {
      console.error("Lỗi khi đăng phản hồi:", err);
      alert(err.message || "Không thể gửi phản hồi lúc này");
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
          <span>{post.likeCount} lượt thích</span>
          <span>{localComments.length} bình luận</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Heart size={16} className="text-slate-500" />
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
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Share2 size={16} className="text-slate-500" />
            Chia sẻ
          </button>
        </div>

        {commentsOpen ? (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Bình luận</h3>

            {/* Ô nhập bình luận chính */}
            {isLogin ? (
              <div className="flex items-center gap-2 mb-4">
                <input
                  value={mainCommentDraft}
                  onChange={(e) => setMainCommentDraft(e.target.value)}
                  placeholder="Viết bình luận công khai..."
                  disabled={isSubmittingComment}
                  className="h-10 flex-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100/40 focus:bg-white px-4 text-sm text-slate-700 outline-none focus-visible:border-amber-400 focus-visible:ring-3 focus-visible:ring-amber-200/70 transition-all"
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
                            {comment.content}
                          </p>
                        </div>

                        {/* Nút phản hồi */}
                        {isLogin && (
                          <div className="mt-1.5 flex items-center gap-3 px-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyToId(comment.id);
                                setDraft("");
                              }}
                              className="text-xs font-medium text-amber-600 hover:text-amber-800"
                            >
                              Trả lời
                            </button>
                          </div>
                        )}

                        {/* Form phản hồi lồng ngay dưới bình luận gốc */}
                        {replyToId === comment.id && (
                          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3">
                            <p className="text-xs text-slate-500">
                              Đang trả lời <span className="font-medium text-slate-700">{comment.author?.name}</span>
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="Viết phản hồi..."
                                className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus-visible:border-amber-400 focus-visible:ring-3 focus-visible:ring-amber-200/70"
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
                                  {reply.content}
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
