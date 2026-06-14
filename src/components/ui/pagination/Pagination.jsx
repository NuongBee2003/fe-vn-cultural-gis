import { useState, useEffect, useRef } from "react";

/**
 * Pagination: số trang là input inline, validation khi Enter/blur.
 *
 * Props:
 *  - page         {number}   trang hiện tại
 *  - totalPages   {number}   tổng số trang
 *  - onPageChange {fn}       callback khi chuyển trang
 *  - className    {string?}
 *  - size         {string?}  "sm" | "md"
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className = "",
  size = "md",
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const isSm = size === "sm";

  // Khi bắt đầu edit, điền giá trị hiện tại
  const startEdit = () => {
    setDraft(String(page));
    setError("");
    setEditing(true);
  };

  // Focus input khi bắt đầu edit
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // Reset khi page thay đổi từ bên ngoài
  useEffect(() => {
    setEditing(false);
    setError("");
  }, [page]);

  const commit = () => {
    const parsed = parseInt(draft, 10);
    if (isNaN(parsed) || draft.trim() === "") {
      setError("Số không hợp lệ");
      setEditing(false);
      return;
    }
    if (parsed < 1 || parsed > totalPages) {
      setError(`Trang ${parsed} không tồn tại (1–${totalPages})`);
      setEditing(false);
      return;
    }
    setError("");
    setEditing(false);
    if (parsed !== page) onPageChange(parsed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { setEditing(false); setError(""); }
  };

  const btnBase = [
    "inline-flex items-center justify-center rounded-md border font-medium transition-colors",
    "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
    isSm
      ? "border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
      : "border-input bg-background px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
  ].join(" ");

  return (
    <div className={`flex flex-col items-center gap-1 select-none ${className}`}>
      <div className="flex items-center gap-2">
        {/* Trang trước */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          className={btnBase}
        >
          Trang trước
        </button>

        {/* Số trang: click → input */}
        <div className="flex items-center gap-1">
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={draft}
              onChange={(e) => { setDraft(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              onBlur={commit}
              style={{ width: `${Math.max(2, String(totalPages).length + 1)}ch` }}
              className={[
                "text-center border-2 border-amber-400 rounded-md bg-white outline-none",
                "font-semibold text-gray-800 shadow-sm",
                isSm ? "text-xs px-1 py-0.5" : "text-sm px-1.5 py-1",
              ].join(" ")}
            />
          ) : (
            <button
              type="button"
              onClick={startEdit}
              title="Click để nhập số trang"
              className={[
                "rounded-md border font-semibold transition-colors cursor-pointer",
                "border-gray-300 bg-white text-gray-800 hover:border-amber-400 hover:bg-amber-50",
                isSm ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1",
              ].join(" ")}
            >
              {page}
            </button>
          )}
          <span className={`text-muted-foreground font-medium ${isSm ? "text-xs" : "text-sm"}`}>
            / {totalPages}
          </span>
        </div>

        {/* Trang sau */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          className={btnBase}
        >
          Trang sau
        </button>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <p className={`text-red-500 font-medium animate-in fade-in ${isSm ? "text-[11px]" : "text-xs"}`}>
          {error}
        </p>
      )}
    </div>
  );
}
