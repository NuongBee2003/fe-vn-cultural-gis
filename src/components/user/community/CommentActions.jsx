/**
 * CommentActions
 * Thanh thao tác phía dưới một bình luận:
 *   - Nút Trả lời / Sửa / Xóa
 *   - Form chỉnh sửa inline (khi editingCommentId === comment.id)
 *   - Form trả lời inline   (khi replyToId      === comment.id)
 */
import { useState } from "react";
import { Loader2, Pencil, Trash2, Check, X as XIcon, Send, Flag } from "lucide-react";
import MentionInput from "@/components/ui/input/MentionInput";
import ReportModal from "@/components/common/ReportModal";

export default function CommentActions({
  comment,
  isLogin,
  mentionUsers,
  // edit state
  editingCommentId,
  setEditingCommentId,
  editDraft,
  setEditDraft,
  isSavingEdit,
  handleSaveEdit,
  handleEditComment,
  // delete state
  deletingCommentId,
  handleDeleteComment,
  // reply state
  replyToId,
  setReplyToId,
  draft,
  setDraft,
  setDraftMentionIds,
  handlePostReplyComment,
}) {
  const isOwnComment = comment.editYN === "Y";
  const [reportModalOpen, setReportModalOpen] = useState(false);

  /** Khi bấm "Trả lời" — điền sẵn @tên tác giả vào ô */
  const handleReplyClick = () => {
    setReplyToId(comment.id);
    const authorName = comment.author?.name || "";
    const matchedUser = mentionUsers.find((u) => u.display === authorName);
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
  };

  return (
    <>
      {/* ── Thanh nút ── */}
      {isLogin && (
        <div className="mt-1 flex items-center gap-3 px-2">
          <button
            type="button"
            onClick={handleReplyClick}
            className="text-xs font-medium text-amber-600 hover:text-amber-800 cursor-pointer border-none bg-transparent"
          >
            Trả lời
          </button>

          {isOwnComment && editingCommentId !== comment.id && (
            <button
              type="button"
              onClick={() => handleEditComment(comment)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer border-none bg-transparent"
            >
              <Pencil size={11} /> Sửa
            </button>
          )}

          {comment.delYN === "Y" && (
            <button
              type="button"
              onClick={() => handleDeleteComment(comment.id)}
              disabled={deletingCommentId === comment.id}
              className="text-xs font-medium text-rose-500 hover:text-rose-700 flex items-center gap-1 disabled:opacity-50 cursor-pointer border-none bg-transparent"
            >
              {deletingCommentId === comment.id ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Trash2 size={11} />
              )}{" "}
              Xóa
            </button>
          )}

          {!isOwnComment && (
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="text-xs font-medium text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer border-none bg-transparent transition-colors"
              title="Báo cáo bình luận này"
            >
              <Flag size={11} /> Báo cáo
            </button>
          )}
        </div>
      )}

      {/* ── Form chỉnh sửa inline ── */}
      {editingCommentId === comment.id && (
        <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50/50 p-3">
          <MentionInput
            multiLine
            rows={2}
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            wrapperClassName="w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/70"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => { setEditingCommentId(null); setEditDraft(""); }}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer border-none bg-transparent"
            >
              <XIcon size={12} /> Hủy
            </button>
            <button
              type="button"
              onClick={() => handleSaveEdit(comment.id)}
              disabled={isSavingEdit || !editDraft.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50 cursor-pointer border-none"
            >
              {isSavingEdit ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Lưu
            </button>
          </div>
        </div>
      )}

      {/* ── Form trả lời inline ── */}
      {replyToId === comment.id && (
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">
            Đang trả lời{" "}
            <span className="font-medium text-slate-700">{comment.author?.name}</span>
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 cursor-pointer border-none"
              aria-label="Gửi phản hồi"
              title="Gửi"
            >
              <Send size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => { setReplyToId(null); setDraft(""); }}
            className="mt-2 text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer border-none bg-transparent"
          >
            Hủy
          </button>
        </div>
      )}

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="comment"
        targetData={comment}
      />
    </>
  );
}
