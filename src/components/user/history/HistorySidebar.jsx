export default function HistorySidebar({ groupedTimeline, activePeriod, onSelectPeriod }) {
  return (
    <div className="w-full xl:w-72 shrink-0 order-1 xl:order-2">
      <div className="sticky top-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm xl:max-h-[calc(100vh-4rem)] flex flex-col">
        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider pb-2 border-b border-slate-100 shrink-0">
          Các Thời Kỳ Lịch Sử
        </h3>

        <div className="flex xl:flex-col gap-2 overflow-x-auto xl:overflow-x-visible xl:overflow-y-auto custom-scrollbar flex-1 pb-2 xl:pb-0">
          {groupedTimeline.map((group) => {
            const isActive = activePeriod === group.id;
            return (
              <button
                key={group.id}
                onClick={() => {
                  onSelectPeriod(group.id);
                  document.getElementById("history-scroll-container")?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className={`text-left px-4 py-3 rounded-xl text-sm transition-all whitespace-nowrap xl:whitespace-normal shrink-0 xl:shrink border ${isActive
                    ? "font-bold shadow-md transform scale-[1.02]"
                    : "text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200"
                  }`}
                style={
                  isActive
                    ? { backgroundColor: group.eraColor, color: "white", borderColor: group.eraColor }
                    : {}
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? 'bg-white' : ''}`}
                    style={!isActive ? { backgroundColor: group.eraColor } : {}}
                  />
                  <span className="leading-snug">{group.period}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
