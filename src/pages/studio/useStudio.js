import { useState, useRef, useEffect } from "react";
import { generateImageBlob } from "@/api/AiGenerateImage";
import { AI_STYLES } from "@/constants/stylesImage";
import defaultImg from "@/assets/img/generate-picture/default-img.png";

export function useStudio() {
  const [photoUrl, setPhotoUrl] = useState(defaultImg);
  const [selectedStyle, setSelectedStyle] = useState(AI_STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [caption, setCaption] = useState("Ngàn năm văn hiến");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const prevBlobUrl = useRef(null);

  // Cleanup blob URL khi unmount
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

  return {
    // state
    photoUrl,
    selectedStyle,
    setSelectedStyle,
    customPrompt,
    setCustomPrompt,
    caption,
    setCaption,
    isGenerating,
    isGenerated,
    isDownloading,
    error,
    // actions
    buildFinalPrompt,
    handleGenerate,
    handleDownload,
  };
}
