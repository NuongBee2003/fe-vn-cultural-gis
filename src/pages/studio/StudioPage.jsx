import React, { useState, useRef, useEffect } from "react";
import {
  Download, Sparkles, Type, Wand2, Loader2, ChevronDown, ChevronUp, Pencil,
} from "lucide-react";
import defaultImg from "@/assets/img/generate-picture/default-img.png";
import { generateImageBlob } from "@/utils/hfClient";

const AI_STYLES = [
  {
    id: "style_hue_royal",
    name: "Cung Đình Huế",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=400",
    prompt: "A breathtaking scene inside the ancient Hue Imperial Citadel of Vietnam, Nguyen dynasty royal palace, traditional Vietnamese architecture, golden hour sunset lighting, vibrant royal atmosphere, ultra realistic, 8k, cinematic, masterpiece",
  },
  {
    id: "style_hoian",
    name: "Phố Cổ Hội An",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=400",
    prompt: "Hoi An ancient town Vietnam at night, colorful silk lanterns glowing warmly, traditional yellow-walled ancient houses, reflections in the river, romantic cinematic lighting, ultra realistic, 8k, masterpiece",
  },
  {
    id: "style_tet",
    name: "Tết Việt Nam",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400",
    prompt: "Vietnamese Lunar New Year Tet celebration scene, vibrant red and gold decorations, blooming peach blossoms and kumquat trees, red lanterns, festive joyful atmosphere, traditional Vietnamese setting, ultra realistic, cinematic, 8k",
  },
  {
    id: "style_taybac",
    name: "Tây Bắc",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400",
    prompt: "Majestic Northwest Vietnam mountain landscape, spectacular golden terraced rice fields at harvest season, ethnic minority hill tribe villages, morning fog rolling through mountain valleys, cinematic golden hour lighting, ultra realistic, 8k",
  },
  {
    id: "style_dongho",
    name: "Tranh Đông Hồ",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400",
    prompt: "Traditional Vietnamese Dong Ho folk painting style, handmade Dong Ho woodblock print on natural paper, vibrant flat colors, traditional rural Vietnamese life scene, cultural heritage artwork, highly detailed",
  },
  {
    id: "style_saigon_old",
    name: "Sài Gòn Xưa",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=400",
    prompt: "Old Saigon Vietnam street scene in the 1960s, vintage colonial architecture, old cyclos and motorcycles, nostalgic warm retro film color grading, cinematic lighting, ultra realistic, highly detailed",
  },
  {
    id: "style_mekong",
    name: "Miền Tây Sông Nước",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=400",
    prompt: "Mekong Delta Vietnam floating market scene at sunrise, colorful wooden boats loaded with tropical fruits, calm river reflections, lush green vegetation, tropical morning mist atmosphere, ultra realistic, cinematic, 8k",
  },
  {
    id: "style_royal_nguyen",
    name: "Cổ Phục Triều Nguyễn",
    image: "https://images.unsplash.com/photo-1524492449090-1abe1e7c2c4f?auto=format&fit=crop&q=80&w=400",
    prompt: "Inside an ancient Vietnamese royal palace of the Nguyen dynasty, intricate traditional Vietnamese architecture with dragon motifs and lacquered wood, royal ceremonial atmosphere, dramatic cinematic lighting, ultra realistic, 8k, masterpiece",
  },
];



export default function StudioPage() {
  const [photoUrl, setPhotoUrl] = useState(defaultImg);
  const [selectedStyle, setSelectedStyle] = useState(AI_STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [caption, setCaption] = useState("Ngàn năm văn hiến");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  // Cleanup blob URLs để tránh memory leak
  const prevBlobUrl = useRef(null);
  useEffect(() => {
    return () => {
      if (prevBlobUrl.current) URL.revokeObjectURL(prevBlobUrl.current);
    };
  }, []);

  const buildFinalPrompt = () => {
    const base = selectedStyle.prompt;
    const extra = customPrompt.trim();
    return extra ? `${base}, ${extra}` : base;
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setIsGenerated(false);
    setError(null);

    try {
      const blobUrl = await generateImageBlob(buildFinalPrompt(), {
        width: 1024,
        height: 1024,
      });

      // Revoke blob URL cũ nếu có
      if (prevBlobUrl.current) URL.revokeObjectURL(prevBlobUrl.current);
      prevBlobUrl.current = blobUrl;

      setPhotoUrl(blobUrl);
      setIsGenerated(true);
    } catch (err) {
      console.error("[Studio] Tạo ảnh thất bại:", err);
      setError("Không tạo được ảnh. Pollinations đang bận, thử lại nhé!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!isGenerated) return;
    setIsDownloading(true);
    try {
      // photoUrl đã là blob URL nên download thẳng được
      const a = document.createElement("a");
      a.href = photoUrl;
      a.download = `studio-van-hoa-${Date.now()}.png`;
      a.click();
    } catch {
      alert("Không tải được ảnh, thử lại!");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 h-full flex overflow-hidden bg-stone-50">

      {/* ── Left: Preview ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 bg-stone-100">
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

          {/* Ảnh — không cần onLoad/onError nữa vì đã fetch xong mới set */}
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
                style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
              >
                {caption}
              </p>
            </div>
          )}
        </div>

        {/* Style + status badge */}
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

      {/* ── Right: Controls ── */}
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
                <span className="normal-case font-normal text-stone-400">(tùy chọn)</span>
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
                  placeholder="Thêm mô tả chi tiết... VD: with a woman in ao dai, sunset, cherry blossoms"
                />
                <p className="text-xs text-stone-400 leading-relaxed">
                  Prompt của bạn sẽ được ghép thêm vào phong cách đã chọn.
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

          {/* ── 3. Caption + Generate ── */}
          <div className="px-6 pt-4 pb-4">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Type size={12} />
              3. Lời tựa
            </p>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50 text-sm text-stone-700 placeholder:text-stone-300"
              placeholder="Nhập lời tựa hiển thị trên ảnh..."
            />

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
    </div>
  );
}