import { useEffect, useState, useMemo, useCallback } from "react";
import { X, Loader2, Send } from "lucide-react";
import { getPostDetail } from "@/api/postApi";
import { createComment, updateComment, deleteComment } from "@/api/commentApi";
import CommunityPostCard from "./CommunityPostCard";
import CommentItem from "./CommentItem";
import { useNotify } from "@/context/NotifyContext";
import MentionInput, { getPlainTextFromMarkup } from "@/components/ui/input/MentionInput";
import { useMentionUsers } from "@/hooks/useMentionUsers";

function formatDateTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function CommunityPostDetailModal({ postId, onClose, highlightCommentId = null }) {
  const notify = useNotify();
  const mentionUsers = useMentionUsers();
  
  const isLogin = localStorage.getItem("isLogin") === "true" || !!localStorage.getItem("token");

  const [post, setPost] = useState(null);
  const [localComments, setLocalComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comments-related States
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

  useEffect(() => {
    async function fetchPostDetail() {
      if (!postId) return;
      try {
        setLoading(true);
        const data = await getPostDetail(postId);
        if (data) {
          const statusMapped = data.status === 'accepted' ? 'published' : data.status;
          const createdAtLabel = data.created_at ? formatDateTime(data.created_at) : "";

          const formatted = {
            id: data.id,
            user_id: data.user_id,
            title: data.title,
            content: data.content,
            status: statusMapped,
            category: data.location?.place?.category?.name || data.location?.place?.category || null,
            location: data.location ? {
              id: data.location.id,
              name: data.location.place?.name || data.location.address || "",
              lat: data.location.lat ? Number(data.location.lat) : null,
              lng: data.location.lng ? Number(data.location.lng) : null
            } : null,
            created_at: data.created_at,
            createdAtLabel,
            author: {
              name: data.user?.username || "(Ẩn danh)",
              avatar: data.user?.avatar || ""
            },
            assets: data.assets || [],
            comments: (data.comments || []).map(c => ({
              id: c.id,
              parent_id: c.parent_id,
              content: c.content,
              createdAtLabel: c.createdAtLabel || (c.created_at ? formatDateTime(c.created_at) : ""),
              editYN: c.editYN || 'N',
              delYN: c.delYN || 'N',
              author: {
                name: c.user?.username || "(Ẩn danh)",
                avatar: c.user?.avatar || ""
              }
            })),
            likeCount: data.likeCount || 0,
            likedYN: data.likedYN || 'N',
          };
          
          setPost(formatted);
          setLocalComments(formatted.comments);
        } else {
          notify.error("Không tìm thấy bài viết");
          onClose();
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết bài viết:", err);
        notify.error("Không thể tải bài viết này");
        onClose();
      } finally {
        setLoading(false);
      }
    }

    fetchPostDetail();
  }, [postId, notify, onClose]);

  // Sync post comments list when localComments changes
  useEffect(() => {
    if (post) {
      setPost((prev) => {
        if (!prev) return prev;
        if (prev.comments === localComments) return prev;
        return {
          ...prev,
          comments: localComments,
        };
      });
    }
  }, [localComments]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Highlight username renderer helper
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

  // Construct Nested Comments Tree
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

  // Scroll to element helper
  const scrollToComment = (commentId) => {
    setTimeout(() => {
      const element = document.getElementById(`comment-${commentId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-2", "ring-amber-500", "duration-500");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-amber-500");
        }, 2000);
      }
    }, 150);
  };

  // Comment Handlers
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
      const res = await createComment({ post_id: postId, content: text, parent_id: null, mentioned_user_ids: mainMentionIds });
      setLocalComments((prev) => [
        ...prev,
        { id: res.id, content: res.content, createdAtLabel: "Vừa xong", editYN: "Y", delYN: "Y",
          author: { name: res.user?.username || "Bạn", avatar: res.user?.avatar || "" } },
      ]);
      setMainCommentDraft("");
      setMainMentionIds([]);
      
      // Auto scroll to the new main comment
      scrollToComment(res.id);
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
      const res = await createComment({ post_id: postId, content: text, parent_id: parentId, mentioned_user_ids: draftMentionIds });
      setLocalComments((prev) => [
        ...prev,
        { id: res.id, parent_id: res.parent_id, content: res.content, createdAtLabel: "Vừa xong",
          editYN: "Y", delYN: "Y", author: { name: res.user?.username || "Bạn", avatar: res.user?.avatar || "" } },
      ]);
      setDraft("");
      setDraftMentionIds([]);
      setReplyToId(null);

      // Auto scroll to the new reply comment
      scrollToComment(res.id);
    } catch (err) {
      console.error("Lỗi khi đăng phản hồi:", err);
      notify.error(err.message || "Không thể gửi phản hồi lúc này");
    }
  };

  const commentSharedProps = {
    isLogin, mentionUsers, renderContent, highlightCommentId,
    editingCommentId, setEditingCommentId,
    editDraft, setEditDraft, isSavingEdit, handleSaveEdit, handleEditComment,
    deletingCommentId, handleDeleteComment,
    replyToId, setReplyToId,
    draft, setDraft, draftMentionIds, setDraftMentionIds,
    handlePostReplyComment,
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Scrollbar styling for custom-scrollbar class */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #ffffff;
          border-radius: 16px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0; /* slate-200 */
          border-radius: 16px;
          border: 2px solid #ffffff;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #cbd5e1; /* slate-300 */
        }
      `}</style>

      {/* Click backdrop to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header (Fixed) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-white relative">
          <h2 className="text-sm font-bold text-slate-900 mx-auto">
            {loading ? "Đang tải..." : `Bài viết của ${post?.author?.name || "di sản"}`}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer border-none flex items-center justify-center shadow-sm"
            aria-label="Đóng"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Middle Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              <p className="text-sm text-slate-500 font-medium">Đang tải bài viết...</p>
            </div>
          ) : post ? (
            <div className="flex flex-col">
              {/* Render the post card (pure display card) */}
              <CommunityPostCard
                post={post}
                showStatus={false}
                onCommentClick={() => {
                  const inputEl = document.querySelector(`[placeholder="Viết bình luận công khai..."]`);
                  if (inputEl) {
                    inputEl.focus();
                  }
                }}
              />

              {/* Comments List */}
              <div className="px-5 pb-6 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Bình luận ({localComments.length})
                </h3>

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
            </div>
          ) : null}
        </div>

        {/* Footer (Fixed Input) */}
        {!loading && post && (
          <div className="px-5 py-4 border-t border-slate-100 bg-white flex-shrink-0">
            {isLogin ? (
              <div className="flex items-center gap-2">
                <MentionInput
                  value={mainCommentDraft}
                  onChange={(e) => setMainCommentDraft(e.target.value)}
                  onMentionsChange={setMainMentionIds}
                  placeholder="Viết bình luận công khai..."
                  disabled={isSubmittingComment}
                  wrapperClassName="flex-1 h-10 text-slate-800 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100/40 focus-within:bg-white focus-within:border-amber-400 transition-all"
                />
                <button
                  type="button"
                  onClick={handlePostMainComment}
                  disabled={isSubmittingComment || !mainCommentDraft.trim()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-opacity cursor-pointer shrink-0"
                  aria-label="Gửi bình luận"
                  title="Gửi"
                >
                  {isSubmittingComment ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center">Vui lòng đăng nhập để bình luận.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
