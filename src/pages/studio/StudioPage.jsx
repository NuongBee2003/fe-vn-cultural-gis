import React, { useState, useRef } from "react";
import { Download, Image as ImageIcon, Sparkles, Type, Wand2, Loader2, Upload } from "lucide-react";
import Replicate from "replicate";
import defaultImg from "@/assets/img/generate-picture/default-img.png";

const FRAMES = [
  { id: "frame1", name: "Trống Đồng", url: "https://images.unsplash.com/photo-1578305698337-b4d08182b8ab?auto=format&fit=crop&q=80&w=200", border: "border-[12px] border-double border-yellow-700" },
  { id: "frame2", name: "Gỗ Mộc", url: "https://images.unsplash.com/photo-1574868019904-20b8f041ffce?auto=format&fit=crop&q=80&w=200", border: "border-[16px] border-amber-900" },
  { id: "frame3", name: "Hoàng Gia", url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=200", border: "border-[8px] border-solid border-yellow-500 rounded-lg p-2 bg-yellow-50" },
  { id: "frame4", name: "Tối Giản", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200", border: "border-[20px] border-white shadow-xl" }
];

const AI_STYLES = [
  {
    id: "style_hue_royal",
    name: "Cung Đình Huế",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=200",
    prompt: "A breathtaking scene inside the ancient Hue Imperial Citadel of Vietnam, Nguyen dynasty royal palace, traditional Vietnamese architecture, golden hour sunset lighting, vibrant royal atmosphere, ultra realistic, 8k, cinematic, masterpiece."
  },
  {
    id: "style_hoian",
    name: "Phố Cổ Hội An",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=200",
    prompt: "Hoi An ancient town Vietnam at night, colorful silk lanterns glowing warmly, traditional yellow-walled ancient houses, reflections in the river, romantic cinematic lighting, ultra realistic, 8k, masterpiece."
  },
  {
    id: "style_tet",
    name: "Tết Việt Nam",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=200",
    prompt: "Vietnamese Lunar New Year Tet celebration scene, vibrant red and gold decorations, blooming peach blossoms and kumquat trees, red lanterns, festive joyful atmosphere, traditional Vietnamese setting, ultra realistic, cinematic, 8k."
  },
  {
    id: "style_taybac",
    name: "Tây Bắc",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=200",
    prompt: "Majestic Northwest Vietnam mountain landscape, spectacular golden terraced rice fields at harvest season, ethnic minority hill tribe villages, morning fog rolling through mountain valleys, cinematic golden hour lighting, ultra realistic, 8k."
  },
  {
    id: "style_dongho",
    name: "Tranh Đông Hồ",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200",
    prompt: "Traditional Vietnamese Dong Ho folk painting style, handmade Dong Ho woodblock print on natural paper, vibrant flat colors, traditional rural Vietnamese life scene, cultural heritage artwork, highly detailed."
  },
  {
    id: "style_saigon_old",
    name: "Sài Gòn Xưa",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=200",
    prompt: "Old Saigon Vietnam street scene in the 1960s-1980s, vintage colonial architecture, old cyclos and motorcycles, nostalgic warm retro film color grading, cinematic lighting, ultra realistic, highly detailed."
  },
  {
    id: "style_mekong",
    name: "Miền Tây Sông Nước",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=200",
    prompt: "Mekong Delta Vietnam floating market scene at sunrise, colorful wooden boats loaded with tropical fruits, calm river reflections, lush green vegetation, tropical morning mist atmosphere, ultra realistic, cinematic, 8k."
  },
  {
    id: "style_royal_nguyen",
    name: "Cổ Phục Triều Nguyễn",
    image: "https://images.unsplash.com/photo-1524492449090-1abe1e7c2c4f?auto=format&fit=crop&q=80&w=200",
    prompt: "Inside an ancient Vietnamese royal palace of the Nguyen dynasty, intricate traditional Vietnamese architecture with dragon motifs and lacquered wood, royal ceremonial atmosphere, dramatic cinematic lighting, ultra realistic, 8k, masterpiece."
  }
];

export default function StudioPage() {
  const [originalBlob, setOriginalBlob] = useState(null); // Ảnh gốc để gửi API
  const [photoUrl, setPhotoUrl] = useState(defaultImg);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [selectedStyle, setSelectedStyle] = useState(AI_STYLES[0]);
  const [text, setText] = useState("Ngàn năm văn hiến");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalBlob(file);
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const generateAIImage = async () => {
    const token = import.meta.env.VITE_REPLICATE_API_TOKEN;
    if (!token) {
      alert("Vui lòng cấu hình VITE_REPLICATE_API_TOKEN trong file .env!");
      return;
    }

    setIsGenerating(true);
    try {
      const replicate = new Replicate({ auth: token });

      const input = {
        prompt: selectedStyle.prompt,
        ...(originalBlob && { input_images: [originalBlob] }), // Đính kèm ảnh nếu có
      };
      const output = await replicate.run("black-forest-labs/flux-2-pro", { input });

      // output is a URL string or array of URLs
      const imageUrl = Array.isArray(output) ? output[0] : output.url?.() ?? output;
      setPhotoUrl(String(imageUrl));
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi xảy ra khi gọi API Replicate. Vui lòng kiểm tra lại Token!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      alert("Đã xuất bưu thiếp thành công! (Đây là tính năng Demo)");
      setIsDownloading(false);
    }, 1500);
  };

  return (
    <div className="flex-1 h-full bg-stone-100 flex overflow-hidden">
      {/* Left side: Preview Area */}
      <div className="flex-1 p-8 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
        <div
          ref={previewRef}
          className={`relative max-w-2xl w-full aspect-[4/3] bg-stone-300 shadow-2xl transition-all duration-300 ${selectedFrame.border} flex items-center justify-center overflow-hidden`}
        >
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-800 z-30 text-amber-500">
              <Loader2 className="animate-spin mb-4" size={48} />
              <p className="font-medium animate-pulse">AI đang phác họa bức tranh...</p>
              <p className="text-xs text-stone-400 mt-2">Có thể mất 20-40 giây</p>
            </div>
          ) : (
            <img src={photoUrl} alt="Generated Art" className="absolute inset-0 w-full h-full object-cover z-0" />
          )}
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>
          {text && !isGenerating && (
            <div className="relative z-20 w-full p-8 flex flex-col items-center justify-center h-full pointer-events-none">
              <div className="mt-auto mb-8 bg-black/40 backdrop-blur-sm px-6 py-4 border border-white/20 rounded-sm">
                <h2
                  className="text-4xl md:text-5xl text-white text-center tracking-widest drop-shadow-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {text}
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Sidebar Controls */}
      <div className="w-96 bg-white border-l border-stone-200 flex flex-col shadow-xl z-10 overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <Sparkles size={24} />
            <h1 className="text-2xl font-bold font-serif">Studio Văn Hóa</h1>
          </div>
          <p className="text-stone-500 text-sm">Chọn chủ đề và để AI vẽ nên bức tranh truyền thống.</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8">

          {/* Upload Section (Optional) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <Upload size={16} /> 1. Ảnh tham chiếu <span className="font-normal text-stone-400">(tùy chọn)</span>
            </label>
            <label className="border-2 border-dashed border-stone-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 hover:border-amber-500 transition-colors">
              <input type="file" className="hidden" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handlePhotoUpload} />
              <ImageIcon className="text-stone-400 mb-1.5" size={24} />
              {originalBlob
                ? <span className="text-xs text-amber-700 font-medium">✓ Đã chọn ảnh. Bấm để đổi</span>
                : <span className="text-xs text-stone-500">Tải ảnh lên để AI tham chiếu (JPEG, PNG, GIF, WEBP)</span>
              }
            </label>
          </div>

          {/* AI Styles Section */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <Wand2 size={16} /> 2. Chọn Phong cách & Tạo ảnh
            </label>
            <div className="grid grid-cols-2 gap-3">
              {AI_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedStyle.id === style.id ? 'border-amber-600 shadow-md scale-95' : 'border-transparent hover:border-stone-300'}`}
                >
                  <img src={style.image} alt={style.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-4 text-[11px] text-white font-medium text-left">
                    {style.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Frames Section */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <ImageIcon size={16} /> 2. Chọn Khung viền
            </label>
            <div className="grid grid-cols-2 gap-3">
              {FRAMES.map(frame => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${selectedFrame.id === frame.id ? 'border-amber-600 shadow-md scale-95' : 'border-transparent hover:border-stone-300'}`}
                >
                  <img src={frame.url} alt={frame.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 text-[11px] text-white font-medium text-center">
                    {frame.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Section */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <Type size={16} /> 3. Lời tựa
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 text-sm"
              placeholder="Nhập lời tựa..."
            />
            
            <button
              onClick={generateAIImage}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-900 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
              {isGenerating ? "Đang vẽ..." : "Yêu cầu AI tạo ảnh"}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-stone-100 bg-stone-50">
          <button
            onClick={handleDownload}
            disabled={isDownloading || isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <span className="animate-pulse">Đang xử lý...</span>
            ) : (
              <>
                <Download size={20} />
                Tải Bưu Thiếp Về Máy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
