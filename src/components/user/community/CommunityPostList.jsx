import { ArrowUpDown, Heart, MessageCircle, Search, X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
];

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

export default function CommunityPostList({
  posts,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2.5 shadow-sm">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bài viết..."
            className="flex-1 border-none outline-none text-[13.5px] text-slate-800 bg-transparent"
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="p-0 bg-transparent border-none cursor-pointer flex items-center"
              aria-label="Xóa tìm kiếm"
            >
              <X size={14} className="text-slate-400" />
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">{posts.length} bài viết</div>
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <ArrowUpDown size={14} className="text-slate-400" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus-visible:border-amber-400 focus-visible:ring-3 focus-visible:ring-amber-200/70"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {posts.length ? (
          <div className="space-y-2">
            {posts.map((post) => {
              const isSelected = post.id === selectedId;
              const badge = getStatusBadge(post.status);

              return (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => onSelect(post.id)}
                  className={
                    "w-full text-left rounded-xl border p-3 transition " +
                    (isSelected
                      ? "border-amber-300 bg-amber-50/50"
                      : "border-slate-200 bg-white hover:bg-slate-50")
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-semibold">
                      {getInitials(post.author.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                          {post.title}
                        </p>
                        <span
                          className={
                            "shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold " +
                            badge.className
                          }
                        >
                          {badge.label}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {post.author.name} • {post.createdAtLabel}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-600 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Heart size={14} className="text-slate-400" />
                          {post.likeCount}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle size={14} className="text-slate-400" />
                          {post.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-500">Không tìm thấy bài viết phù hợp.</div>
        )}
      </div>
    </div>
  );
}
