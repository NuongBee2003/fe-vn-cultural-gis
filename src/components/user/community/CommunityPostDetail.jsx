import { Heart, MessageCircle } from "lucide-react";

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

export default function CommunityPostDetail({ post }) {
  if (!post) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">Chưa có bài viết</p>
          <p className="mt-1 text-sm text-slate-500">Hãy chọn một bài bên trái để xem chi tiết.</p>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(post.status);
  const primaryAsset = post.assets.find((a) => a.is_primary) || post.assets[0];
  const extraAssets = primaryAsset
    ? post.assets.filter((a) => a.id !== primaryAsset.id)
    : post.assets;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 p-4">
        <h2 className="text-lg font-semibold text-slate-900 leading-snug">{post.title}</h2>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[11px] font-semibold">
              {getInitials(post.author.name)}
            </span>
            <span className="font-medium text-slate-700">{post.author.name}</span>
          </span>

          <span className="text-slate-300">•</span>
          <span>{post.createdAtLabel}</span>

          <span className="text-slate-300">•</span>
          <span className={"rounded-full border px-2 py-1 text-[10px] font-semibold " + badge.className}>
            {badge.label}
          </span>

          <span className="ml-auto flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Heart size={14} className="text-slate-400" />
              {post.likeCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle size={14} className="text-slate-400" />
              {post.commentCount}
            </span>
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {primaryAsset ? (
          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={primaryAsset.url}
                alt="Ảnh bài viết"
                className="h-64 w-full object-cover sm:h-80"
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
                      className="h-24 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 space-y-3">
          {String(post.content || "")
            .split(/\n\n+/g)
            .map((para, idx) => (
              <p key={idx} className="text-sm leading-6 text-slate-700">
                {para}
              </p>
            ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Bình luận</h3>
            <span className="text-xs text-slate-500">{post.commentCount} bình luận</span>
          </div>

          {post.comments.length ? (
            <div className="mt-4 space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-semibold">
                      {getInitials(comment.author.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-semibold text-slate-900">{comment.author.name}</p>
                        <span className="text-slate-300">•</span>
                        <p className="text-xs text-slate-500">{comment.createdAtLabel}</p>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Chưa có bình luận nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
