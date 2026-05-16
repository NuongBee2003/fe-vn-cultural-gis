import { useState } from "react";
import Map from "@/components/user/map/Map";
import SearchBar from "@/components/user/map/SearchBar";
import FilterChips from "@/components/user/map/FilterChips";

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden">
      <Map activeFilter={activeFilter} search={search} />

      <div className="absolute top-3 left-30 right-3 z-[9999] flex flex-col gap-2.5 pointer-events-none">
        <SearchBar search={search} setSearch={setSearch} />
        <FilterChips
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>
    </div>
  );
}
