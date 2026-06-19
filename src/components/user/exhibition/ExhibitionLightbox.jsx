import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Heart,
  MapPin,
  User,
  Calendar,
  Volume2
} from "lucide-react";
import { toggleLikeExhibition } from "@/api/exhibitionApi";

export default function ExhibitionLightbox({ item, onClose, onLikeUpdate }) {
  const { i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [likesCount, setLikesCount] = useState(item?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (item?.id) {
      setLikesCount(item.likes || 0);
      try {
        const likedList = JSON.parse(localStorage.getItem("likedExhibitions") || "[]");
        setIsLiked(likedList.includes(item.id));
      } catch (e) {
        console.error(e);
      }
    }
  }, [item]);

  const handleLikeToggle = async () => {
    if (!item?.id) return;
    try {
      const action = isLiked ? "unlike" : "like";
      const res = await toggleLikeExhibition(item.id, action);
      if (res) {
        setLikesCount(res.likes);
        const likedList = JSON.parse(localStorage.getItem("likedExhibitions") || "[]");
        let updatedList;
        if (isLiked) {
          updatedList = likedList.filter(id => id !== item.id);
        } else {
          updatedList = [...likedList, item.id];
        }
        localStorage.setItem("likedExhibitions", JSON.stringify(updatedList));
        setIsLiked(!isLiked);
        if (onLikeUpdate) {
          onLikeUpdate(item.id, res.likes);
        }
      }
    } catch (err) {
      console.error("Lỗi khi toggle like:", err);
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const currentLang = i18n.language || "vi";
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Tối ưu hóa giọng đọc chậm rãi, rõ ràng như hướng dẫn viên du lịch
      utterance.rate = 0.88;
      utterance.pitch = 1.0;

      if (currentLang.startsWith("en")) {
        utterance.lang = "en-US";
      } else if (currentLang.startsWith("zh")) {
        utterance.lang = "zh-CN";
      } else {
        utterance.lang = "vi-VN";
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const text = `${item.title}. ${item.description}`;
      speak(text);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-label="Đóng"
      />

      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col lg:flex-row bg-white rounded-2xl overflow-hidden shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {/* Modern Frameless Image Container */}
        <div className="lg:w-[58%] bg-stone-950 flex items-center justify-center p-6 sm:p-8 min-h-[280px] lg:min-h-0 lg:max-h-[90vh] overflow-hidden select-none">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-w-full max-h-[45vh] lg:max-h-[82vh] object-contain rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-[1.02] filter contrast-[1.01]"
          />
        </div>

        {/* Info Column */}
        <div className="lg:w-[42%] flex flex-col overflow-y-auto p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Triển lãm ảo
          </p>
          <h2
            className="mt-2 text-2xl font-semibold text-stone-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {item.description}
          </p>

          {/* Voice Over Audio Guide button */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeech}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isSpeaking
                  ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm animate-pulse"
                  : "bg-amber-50/50 hover:bg-amber-50 border-amber-200/60 text-amber-800 shadow-xs"
              }`}
            >
              {isSpeaking ? (
                <>
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-0.5 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <span className="w-0.5 h-4 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <span className="w-0.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span>Dừng thuyết minh</span>
                </>
              ) : (
                <>
                  <Volume2 size={13.5} className="text-amber-600" />
                  <span>Nghe thuyết minh (TTS)</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {item.styleTag && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
                {item.styleTag}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
              {item.province}
            </span>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-stone-600">
            <li className="flex items-center gap-2">
              <User size={15} className="text-stone-400 shrink-0" />
              <span>
                <span className="text-stone-400">Tác giả:</span>{" "}
                <span className="font-medium text-stone-800">{item.author}</span>
              </span>
            </li>
            
            <li className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLikeToggle}
                className="flex items-center gap-2 text-stone-600 hover:text-rose-600 transition-colors group cursor-pointer"
              >
                <Heart
                  size={15}
                  className={`shrink-0 transition-transform active:scale-125 group-hover:scale-110 ${
                    isLiked
                      ? "fill-rose-500 text-rose-500"
                      : "text-stone-400 group-hover:text-rose-500"
                  }`}
                />
                <span className={isLiked ? "text-rose-600 font-semibold" : ""}>
                  {likesCount} lượt thích
                </span>
              </button>
            </li>

            <li className="flex items-center gap-2">
              <Calendar size={15} className="text-stone-400 shrink-0" />
              <span>
                Đăng ngày{" "}
                {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </li>
            {item.placeName && (
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-amber-600 shrink-0" />
                <span>{item.placeName}</span>
              </li>
            )}
          </ul>

          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col gap-3">
            <button
              type="button"
              disabled
              title="Sẽ kết nối bản đồ khi có API"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed"
            >
              <MapPin size={15} />
              Xem trên bản đồ (sắp có)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
