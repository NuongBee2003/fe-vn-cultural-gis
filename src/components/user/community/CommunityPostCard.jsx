import { useState } from "react";
import { Heart, MessageCircle, Send, Share2 } from "lucide-react";

function getInitials(name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/g).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function getStatusBadge(status) {
  if (status === "published") {
    return {
      label: "Đã duyệt",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  return {
    label: "Chờ duyệt",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  };
}

export default function CommunityPostCard({ post }) {
  const badge = getStatusBadge(post.status);
  const primaryAsset = post.assets.find((a) => a.is_primary) || post.assets[0];
  const extraAssets = primaryAsset
    ? post.assets.filter((a) => a.id !== primaryAsset.id)
    : post.assets;

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [replyToId, setReplyToId] = useState(null);
  const [draft, setDraft] = useState("");
  const [localComments, setLocalComments] = useState(() => post.comments || []);

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
            <span
              className={
                "ml-auto rounded-full border px-2 py-1 text-[10px] font-semibold " +
                badge.className
              }
            >
              {badge.label}
            </span>
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
            <h3 className="text-sm font-semibold text-slate-900">Bình luận</h3>

            {localComments.length ? (
              <div className="mt-3 space-y-3">
                {localComments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-semibold">
                      {getInitials(comment.author.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="rounded-2xl bg-slate-50 px-3 py-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-semibold text-slate-900">{comment.author.name}</p>
                          <span className="text-slate-300">•</span>
                          <p className="text-xs text-slate-500">{comment.createdAtLabel}</p>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{comment.content}</p>
                      </div>

                      <div className="mt-1.5 flex items-center gap-3 px-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyToId(comment.id);
                            setDraft("");
                          }}
                          className="text-xs font-medium text-slate-600 hover:text-slate-900"
                        >
                          Trả lời
                        </button>
                      </div>

                      {replyToId === comment.id ? (
                        <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">
                            Đang trả lời <span className="font-medium text-slate-700">{comment.author.name}</span>
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
                              onClick={() => {
                                const content = draft.trim();
                                if (!content) return;

                                const now = new Date();
                                setLocalComments((prev) => [
                                  ...prev,
                                  {
                                    id: `reply-${now.getTime()}`,
                                    content: `Trả lời @${comment.author.name}: ${content}`,
                                    createdAtLabel: "Vừa xong",
                                    author: { name: "Bạn" },
                                  },
                                ]);

                                setDraft("");
                                setReplyToId(null);
                              }}
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
                      ) : null}
                    </div>
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
