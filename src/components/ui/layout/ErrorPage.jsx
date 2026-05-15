import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[var(--brand-bg)]">
      <div className="flex flex-col items-center gap-6 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-[var(--brand-primary-12)] flex items-center justify-center">
          <AlertTriangle size={36} className="text-[var(--brand-primary)]" />
        </div>

        <h1
          className="text-7xl font-extrabold text-[var(--brand-primary)] tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          404
        </h1>

        <div>
          <h2 className="text-xl font-semibold text-[var(--muted-2)] mb-2">
            Trang không tồn tại
          </h2>
          <p className="text-sm text-[var(--muted-1)] max-w-md leading-relaxed">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng
            quay về trang chủ.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
            text-[var(--brand-on-primary)] bg-[var(--brand-primary)] border-none cursor-pointer
            transition-all duration-200 hover:bg-[var(--brand-primary-variant)]
            hover:shadow-lg hover:shadow-[var(--brand-primary-35)]"
        >
          <Home size={16} />
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
