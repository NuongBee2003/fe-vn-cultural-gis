import { Heart, MapPin } from "lucide-react";

export default function ExhibitionCard({ item, onClick, showStatus }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group relative w-full mb-4 break-inside-avoid rounded-2xl overflow-hidden bg-stone-200 text-left cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <p className="text-white text-sm font-semibold leading-snug line-clamp-2">
          {item.title}
        </p>
        <p className="text-white/75 text-xs mt-1">{item.author}</p>
      </div>

      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
        {showStatus && item.status === "pending" && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/95 text-white backdrop-blur-xs border border-amber-400 shadow-sm animate-pulse">
            Chờ duyệt
          </span>
        )}
        {showStatus && item.status === "rejected" && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-600/95 text-white backdrop-blur-xs border border-rose-500 shadow-sm">
            Từ chối
          </span>
        )}
        {showStatus && item.status === "accepted" && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600/95 text-white backdrop-blur-xs border border-emerald-500 shadow-sm">
            Đã duyệt
          </span>
        )}

        {item.styleTag && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-white backdrop-blur-sm">
            {item.styleTag}
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/45 text-white text-[10px] font-medium backdrop-blur-sm">
        <Heart size={10} className="fill-white" />
        {item.likes}
      </div>

      {(item.placeName || item.province) && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-white/90 text-[10px] opacity-100 group-hover:opacity-0 transition-opacity">
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{item.placeName ? `${item.placeName}, ${item.province}` : item.province}</span>
        </div>
      )}
    </button>
  );
}
