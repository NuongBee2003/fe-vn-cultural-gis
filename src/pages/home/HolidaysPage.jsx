import { HOLIDAYS } from "@/constants/holiday";

export default function HolidaysPage() {
  return (
    <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden bg-slate-50">
      <div className="h-full overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <header className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              Lịch lễ Việt Nam
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Các ngày lễ & kỷ niệm quan trọng
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 max-w-2xl">
              Tổng hợp những ngày lễ chính và các ngày kỷ niệm phổ biến tại Việt Nam.
            </p>
          </header>

          {/* Groups */}
          <div className="space-y-12">
            {HOLIDAYS.map((group) => (
              <section key={group.title}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-semibold text-slate-800">{group.title}</h2>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    {group.items.length} ngày
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-amber-300 hover:shadow-md transition-all duration-200"
                    >
                      {/* Image */}
                      <div className="relative h-36 overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                        {/* Date badge overlay */}
                        <div className="absolute top-3 left-3">
                          <span className="rounded-lg bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                            {item.date}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                          {item.label}
                        </h3>
                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}