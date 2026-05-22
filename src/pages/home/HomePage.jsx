import { useState } from "react";
import Map from "@/components/user/map/Map";
import SearchBar from "@/components/user/map/SearchBar";
import FilterChips from "@/components/user/map/FilterChips";
import UserProfile from "@/components/user/map/UserProfile";

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden">
      <Map activeFilter={activeFilter} search={search} />

      <div className="absolute top-3 left-30 right-3 z-[9999] flex flex-row items-center gap-3 pointer-events-none">
        <div className="shrink-0 pointer-events-auto">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
        <div className="flex-1 pr-3 overflow-hidden pointer-events-auto">
          <FilterChips
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>
        <div className="shrink-0 pointer-events-auto">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
