import { Loader2 } from "lucide-react";

export default function StudioPreview({
  photoUrl,
  selectedStyle,
  caption,
  isGenerating,
  isGenerated,
  error,
}) {
  return (
    <div className="w-full shrink-0 md:flex-1 flex flex-col items-center justify-center p-5 md:p-8 gap-4 bg-stone-100 min-h-[50vh] md:min-h-0">
      {/* Canvas */}
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl bg-stone-900"
        style={{ aspectRatio: "4/3" }}
      >
        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/95 z-30 text-amber-400 gap-3">
            <Loader2 className="animate-spin" size={40} />
            <p className="text-sm font-medium animate-pulse">AI đang phác họa bức tranh...</p>
            <p className="text-xs text-stone-500">Có thể mất 20–40 giây</p>
          </div>
        )}

        {/* Error overlay */}
        {error && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/90 z-30 text-red-400 gap-3 p-6">
            <p className="text-sm text-center">{error}</p>
          </div>
        )}

        {/* Ảnh */}
        <img
          src={photoUrl}
          alt="Generated Art"
          className="w-full h-full object-contain"
        />

        {/* Gradient overlay */}
        {!isGenerating && isGenerated && (
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        )}

        {/* Caption */}
        {caption && !isGenerating && isGenerated && (
          <div className="absolute bottom-0 inset-x-0 p-6 pointer-events-none">
            <p
              className="text-white text-center text-3xl tracking-widest drop-shadow-lg"
              style={{
                fontFamily: "'Playfair Display', serif",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}
            >
              {caption}
            </p>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 text-xs">
        <span className="px-2.5 py-1 bg-white rounded-full border border-stone-200 shadow-sm font-medium text-stone-600">
          {selectedStyle.name}
        </span>
        {isGenerated && !isGenerating && (
          <span className="px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-700 font-medium">
            ✓ Đã tạo
          </span>
        )}
      </div>
    </div>
  );
}
