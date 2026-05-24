import { useState } from "react";
import {
  Download, Sparkles, Type, Wand2, Loader2, ChevronDown, ChevronUp, Pencil,
} from "lucide-react";
import { AI_STYLES } from "@/constants/stylesImage";

export default function StudioControls({
  selectedStyle,
  setSelectedStyle,
  customPrompt,
  setCustomPrompt,
  buildFinalPrompt,
  isGenerating,
  isGenerated,
  isDownloading,
  handleGenerate,
  handleDownload,
}) {
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  return (
    <div className="w-88 bg-white border-l border-stone-200 flex flex-col shadow-xl z-10 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-stone-100 bg-linear-to-br from-amber-50 to-stone-50">
        <div className="flex items-center gap-2 text-amber-800 mb-1">
          <Sparkles size={20} />
          <h1 className="text-xl font-bold font-serif">Studio Văn Hóa</h1>
        </div>
        <p className="text-stone-500 text-xs leading-relaxed">
          Chọn phong cách và để AI vẽ nên bức tranh truyền thống Việt Nam.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── 1. Chọn phong cách ── */}
        <div className="px-6 pt-5 pb-4 border-b border-stone-100">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            1. Chọn phong cách
          </p>
          <div className="grid grid-cols-2 gap-2">
            {AI_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style)}
                className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
                  selectedStyle.id === style.id
                    ? "ring-2 ring-amber-500 ring-offset-1 scale-95"
                    : "hover:scale-95 hover:ring-2 hover:ring-stone-300 hover:ring-offset-1"
                }`}
              >
                <img src={style.image} alt={style.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-1.5 left-2 right-2 text-[10px] text-white font-semibold leading-tight text-left">
                  {style.name}
                </span>
                {selectedStyle.id === style.id && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── 2. Tùy chỉnh prompt ── */}
        <div className="px-6 pt-4 pb-4 border-b border-stone-100">
          <button
            onClick={() => setShowCustomPrompt(!showCustomPrompt)}
            className="w-full flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider hover:text-stone-700 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Pencil size={12} />
              2. Tùy chỉnh prompt
              <span className="normal-case font-normal text-stone-400">(Viết tiếng anh sẽ chính xác hơn)</span>
            </span>
            {showCustomPrompt ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showCustomPrompt && (
            <div className="mt-3 flex flex-col gap-2">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50 text-sm text-stone-700 placeholder:text-stone-300 resize-none"
                placeholder="VD: with a woman in ao dai, sunset, cherry blossoms"
              />
              <p className="text-xs text-stone-400">
                Prompt sẽ được ghép thêm vào phong cách đã chọn.
              </p>
              {customPrompt.trim() && (
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-700 font-medium mb-1">Preview prompt:</p>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {buildFinalPrompt()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── + Generate ── */}
        <div className="px-6 pt-4 pb-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-900 active:scale-95 text-white py-2.5 rounded-xl font-medium transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isGenerating
              ? <><Loader2 className="animate-spin" size={15} /> Đang vẽ...</>
              : <><Wand2 size={15} /> Tạo ảnh AI</>
            }
          </button>
        </div>
      </div>

      {/* ── Footer: Download ── */}
      <div className="px-6 py-4 border-t border-stone-100 bg-stone-50">
        <button
          onClick={handleDownload}
          disabled={isDownloading || isGenerating || !isGenerated}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white py-3 rounded-xl font-semibold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 text-sm"
        >
          {isDownloading
            ? <span className="animate-pulse">Đang tải...</span>
            : <><Download size={16} /> Tải ảnh về máy</>
          }
        </button>
        {!isGenerated && (
          <p className="text-center text-xs text-stone-400 mt-2">Tạo ảnh trước để tải về</p>
        )}
      </div>
    </div>
  );
}
