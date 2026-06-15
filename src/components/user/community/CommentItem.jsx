/**
 * CommentItem
 * Hiển thị một bình luận (root hoặc reply) cùng với các bình luận con đệ quy.
 *
 * Cấu trúc:
 *   CommentItem (depth=0)   ← bình luận gốc
 *     CommentActions         ← thanh thao tác
 *     <div border-l>        ← kẻ đường dọc
 *       CommentItem (depth=1)  ← reply cấp 1
 *         CommentActions
 *         <div border-l>
 *           CommentItem (depth=2)  ← reply cấp 2 …
 */
import CommentActions from "./CommentActions";

function getInitials(name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/g).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function CommentItem({
  comment,
  depth = 0,
  highlightCommentId,
  // props forwarded to CommentActions
  isLogin,
  mentionUsers,
  editingCommentId,
  setEditingCommentId,
  editDraft,
  setEditDraft,
  isSavingEdit,
  handleSaveEdit,
  handleEditComment,
  deletingCommentId,
  handleDeleteComment,
  replyToId,
  setReplyToId,
  draft,
  setDraft,
  draftMentionIds,
  setDraftMentionIds,
  handlePostReplyComment,
  renderContent,
}) {
  /** Props chung cho CommentActions — tránh lặp lại ở phần đệ quy */
  const actionsProps = {
    isLogin,
    mentionUsers,
    editingCommentId,
    setEditingCommentId,
    editDraft,
    setEditDraft,
    isSavingEdit,
    handleSaveEdit,
    handleEditComment,
    deletingCommentId,
    handleDeleteComment,
    replyToId,
    setReplyToId,
    draft,
    setDraft,
    draftMentionIds,
    setDraftMentionIds,
    handlePostReplyComment,
  };

  const isHighlighted = Number(highlightCommentId) === Number(comment.id);

  return (
    <div
      id={`comment-${comment.id}`}
      className={`space-y-2 rounded-xl transition-all duration-500 p-1.5 ${
        isHighlighted ? "ring-2 ring-amber-400 bg-amber-50/30" : ""
      }`}
    >
      {/* ── Avatar + bubble ── */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`shrink-0 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold overflow-hidden ${
            depth > 0 ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-[11px]"
          }`}
        >
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

        {/* Nội dung + thanh thao tác */}
        <div className="min-w-0 flex-1">
          {/* Bubble nội dung */}
          <div className="rounded-2xl bg-slate-50 px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold text-slate-900">
                {comment.author?.name || "(Ẩn danh)"}
              </p>
              <span className="text-slate-300">•</span>
              <p className="text-xs text-slate-500">{comment.createdAtLabel}</p>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {renderContent(comment.content)}
            </p>
          </div>

          {/* Thanh thao tác (Trả lời / Sửa / Xóa + form) */}
          <CommentActions comment={comment} {...actionsProps} />
        </div>
      </div>

      {/* ── Bình luận con (đệ quy) ── */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-[18px] pl-4 sm:pl-8 border-l-2 border-slate-100 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              highlightCommentId={highlightCommentId}
              renderContent={renderContent}
              {...actionsProps}
            />
          ))}
        </div>
      )}
    </div>
  );
}
