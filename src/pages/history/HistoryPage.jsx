import { HISTORY_TIMELINE } from "@/constants/history";
import { useState, useMemo } from "react";
import HistorySidebar from "@/components/user/history/HistorySidebar";
import HistoryEventCard from "@/components/user/history/HistoryEventCard";

export default function HistoryPage() {
  // Group the flat array by era
  const groupedTimeline = useMemo(() => {
    const groups = [];
    HISTORY_TIMELINE.forEach((event) => {
      let group = groups.find((g) => g.period === event.era);
      if (!group) {
        group = {
          id: event.era.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(),
          period: event.era,
          eraColor: event.eraColor,
          events: [],
        };
        groups.push(group);
      }
      group.events.push(event);
    });
    return groups;
  }, []);

  const [activePeriod, setActivePeriod] = useState(groupedTimeline[0]?.id);

  const activeGroup = useMemo(
    () => groupedTimeline.find((g) => g.id === activePeriod) || groupedTimeline[0],
    [activePeriod, groupedTimeline]
  );

  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-slate-50 flex">
      {/* Main Content */}
      <div
        id="history-scroll-container"
        className="flex-1 h-full overflow-y-auto px-6 py-8 md:py-12 scroll-smooth"
      >
        <div className="mx-auto max-w-6xl flex flex-col xl:flex-row gap-8">
          
          <div className="flex-1">
            {/* Header */}
            <header className="mb-12 text-center xl:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-2">
                Dòng Thời Gian
              </p>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl mb-4">
                Hành Trình Lịch Sử Việt Nam
              </h1>
              <p className="text-sm md:text-base text-slate-500 max-w-2xl leading-relaxed mx-auto xl:mx-0">
                Khám phá những cột mốc quan trọng, những triều đại hào hùng và các bậc danh nhân đã làm nên lịch sử hàng ngàn năm văn hiến của dân tộc.
              </p>
            </header>

            {/* Timeline Container (Only showing active period) */}
            <div className="relative pt-4">
              {/* Center Line for Desktop */}
              <div
                className="absolute left-4 lg:left-1/2 top-10 bottom-0 w-0.5 transform lg:-translate-x-1/2 rounded-full hidden lg:block"
                style={{ backgroundColor: `${activeGroup.eraColor}40` }}
              ></div>

              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Period Header */}
                <div className="flex items-center lg:justify-center mb-12 sticky top-4 z-20">
                  <div
                    className="px-8 py-3 rounded-full font-bold shadow-md backdrop-blur-md text-white text-lg tracking-wide border-2"
                    style={{
                      backgroundColor: activeGroup.eraColor,
                      borderColor: `${activeGroup.eraColor}80`,
                    }}
                  >
                    {activeGroup.period}
                  </div>
                </div>

                {/* Events */}
                <div className="space-y-12 pb-12">
                  {activeGroup.events.map((event, eIndex) => (
                    <HistoryEventCard
                      key={event.id || eIndex}
                      event={event}
                      activeGroup={activeGroup}
                      isEven={eIndex % 2 === 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Sidebar */}
          <HistorySidebar 
            groupedTimeline={groupedTimeline}
            activePeriod={activePeriod}
            onSelectPeriod={setActivePeriod}
          />
          
        </div>
      </div>
    </div>
  );
}
