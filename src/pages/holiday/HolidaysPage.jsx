import { HOLIDAYS } from "@/constants/holiday";
import InfoHoliday from "@/components/user/holiday/InfoHoliday";

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
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((item) => (
                    <InfoHoliday key={item.label} item={item} />
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