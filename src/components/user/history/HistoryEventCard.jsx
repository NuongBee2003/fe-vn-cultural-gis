import { Clock, User } from "lucide-react";

export default function HistoryEventCard({ event, activeGroup, isEven }) {
  return (
    <div
      className={`relative flex flex-col lg:flex-row gap-8 lg:gap-0 items-center ${isEven ? "lg:flex-row-reverse" : ""
        }`}
    >
      {/* Timeline Node */}
      <div
        className="absolute left-4 lg:left-1/2 w-5 h-5 rounded-full border-4 border-white shadow-md transform lg:-translate-x-1/2 z-10 hidden lg:block transition-all duration-300"
        style={{ backgroundColor: activeGroup.eraColor }}
      ></div>

      {/* Content Panel */}
      <div
        className={`w-full lg:w-1/2 ${isEven ? "lg:pl-12" : "lg:pr-12"
          }`}
      >
        <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          {event.image && (
            <div className="relative h-56 mb-5 overflow-hidden rounded-xl bg-slate-100">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                  <Clock size={14} />
                  {event.period || event.date}
                </span>
              </div>
            </div>
          )}

          {/* Text */}
          <h3
            className="text-xl font-bold mb-3"
            style={{ color: activeGroup.eraColor }}
          >
            {event.title}
          </h3>
          <p className="text-slate-600 mb-5 leading-relaxed text-[15px]">
            {event.description}
          </p>

          {/* Figure (if exists) */}
          {event.figure && (
            <div className="pt-5 border-t border-slate-100 mt-5">
              <div className="flex flex-col sm:flex-row gap-4">
                {event.figureImage ? (
                  <img
                    src={event.figureImage}
                    alt={event.figure}
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md border border-slate-200 shrink-0"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm shrink-0"
                    style={{
                      backgroundColor: `${activeGroup.eraColor}15`,
                      color: activeGroup.eraColor,
                    }}
                  >
                    <User size={20} />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                    Nhân vật tiêu biểu
                  </p>
                  <p className="text-base font-bold text-slate-800 mb-2">
                    {event.figure}
                  </p>
                  {event.figureDescription && (
                    <div className="bg-slate-50 rounded-xl p-3.5 text-sm text-slate-600 leading-relaxed border border-slate-100 italic">
                      "{event.figureDescription}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
