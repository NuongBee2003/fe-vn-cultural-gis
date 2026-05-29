import { Search, X } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-lg pointer-events-auto w-full md:w-[300px] shrink-0">
      <Search size={15} className="text-gray-400 shrink-0" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm địa điểm..."
        className="flex-1 border-none outline-none text-[13.5px] text-gray-800 bg-transparent min-w-0"
      />
      {search ? (
        <button
          onClick={() => setSearch("")}
          className="p-0 bg-transparent border-none cursor-pointer flex items-center shrink-0"
        >
          <X size={13} className="text-gray-400" />
        </button>
      ) : null}
    </div>
  );
}
