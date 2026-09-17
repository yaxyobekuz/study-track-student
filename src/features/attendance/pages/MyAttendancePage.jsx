// React
import { useState } from "react";

// Icons
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ListChecks,
} from "lucide-react";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Utils
import { cn } from "@/shared/utils/cn";
import {
  formatDateUz,
  formatMonthUz,
  getDayOfWeekUz,
} from "@/shared/utils/date.utils";

// Components
import Card from "@/shared/components/ui/Card";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import BackHeader from "@/shared/components/layout/BackHeader";
import AttendanceCalendar from "../components/AttendanceCalendar";

// Data & queries
import {
  ATTENDANCE_STATUSES,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../data/attendance.data";
import { attendanceQueries } from "../queries/attendance.queries";
import {
  currentMonthKey,
  shiftMonthKey,
  toLocalDay,
} from "../utils/attendance.utils";

/**
 * "Davomatim" — o'quvchi tanlangan oyda qaysi kunlari kelgani, kech qolgani
 * yoki kelmaganini ko'radi. Kelajak oylar ochilmaydi: ular hali belgilanmagan.
 */
const MyAttendancePage = () => {
  const [monthKey, setMonthKey] = useState(currentMonthKey);

  const { data, isLoading, isError, isPlaceholderData } = useQuery(
    attendanceQueries.myMonth(monthKey),
  );

  const records = data?.records ?? [];
  const summary = data?.summary;
  // Davomat foizi = (keldi + kech keldi) / belgilangan kunlar; sababli ham maxrajda
  const percent =
    summary?.total > 0 ? Math.round((summary.came / summary.total) * 100) : null;
  const isCurrentMonth = monthKey >= currentMonthKey();

  return (
    <div className="animate__animated animate__fadeIn min-h-screen bg-gray-100 pb-28">
      <BackHeader href="/dashboard" title="Davomatim" />

      <div className="container space-y-5 pt-5">
        {/* Oy tanlash */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-2">
          <button
            type="button"
            onClick={() => setMonthKey((key) => shiftMonthKey(key, -1))}
            className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Oldingi oy"
          >
            <ChevronLeft className="size-5" strokeWidth={1.5} />
          </button>

          <p className="font-semibold text-gray-900">{formatMonthUz(monthKey)}</p>

          <button
            type="button"
            onClick={() => setMonthKey((key) => shiftMonthKey(key, 1))}
            disabled={isCurrentMonth}
            className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Keyingi oy"
          >
            <ChevronRight className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {isLoading ? (
          <LoaderCard />
        ) : isError ? (
          <Card className="text-center">
            <AlertCircle className="mx-auto size-8 text-red-400" />
            <p className="mt-2 text-sm text-gray-500">
              Davomat ma'lumotini yuklab bo'lmadi
            </p>
          </Card>
        ) : (
          <div
            className={cn(
              "space-y-5 transition-opacity",
              isPlaceholderData && "opacity-60",
            )}
          >
            {/* Yig'indi */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-white">
              <p className="text-sm opacity-90">Davomat</p>
              <p className="mt-2 text-3xl font-bold">
                {percent === null ? "—" : `${percent}%`}
              </p>
              <p className="mt-1 text-xs opacity-90">
                {summary?.total > 0
                  ? `${summary.total} kundan ${summary.came} kun kelgansiz`
                  : "Bu oyda davomat hali belgilanmagan"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 xs:grid-cols-4">
              {ATTENDANCE_STATUSES.map((status) => (
                <div
                  key={status}
                  className={cn(
                    "flex h-20 flex-col items-center justify-center rounded-2xl",
                    STATUS_COLORS[status],
                  )}
                >
                  <b className="text-2xl font-bold">{summary?.[status] ?? 0}</b>
                  <p className="mt-0.5 text-sm">{STATUS_LABELS[status]}</p>
                </div>
              ))}
            </div>

            {/* Kalendar */}
            <Card
              title="Kalendar"
              icon={<CalendarDays className="size-5 text-primary" />}
            >
              <div className="mt-4">
                <AttendanceCalendar monthKey={monthKey} records={records} />
              </div>
            </Card>

            {/* Kunlar ro'yxati — yangisi yuqorida */}
            <Card
              title="Kunlar"
              icon={<ListChecks className="size-5 text-primary" />}
            >
              {records.length === 0 ? (
                <p className="mt-3 py-4 text-center text-sm text-gray-500">
                  Bu oyda davomat belgilanmagan
                </p>
              ) : (
                <div className="mt-3 divide-y divide-gray-100">
                  {[...records].reverse().map((rec) => (
                    <DayRow key={rec.id} record={rec} />
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

/** Bitta kun: sana, hafta kuni, sinf, holat va izoh. */
const DayRow = ({ record }) => {
  const day = toLocalDay(record.date);

  return (
    <div className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="font-medium text-gray-900">{formatDateUz(day)}</p>
        <p className="text-xs text-gray-500">
          {getDayOfWeekUz(day)}
          {record.class?.name ? ` · ${record.class.name}` : ""}
        </p>
        {record.excuseReason && (
          <p className="mt-1 text-xs text-gray-600">{record.excuseReason}</p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
            STATUS_COLORS[record.status],
          )}
        >
          {STATUS_LABELS[record.status] ?? record.status}
        </span>
        {record.autoMarked && (
          <p className="mt-0.5 text-[11px] text-gray-400">avtomatik</p>
        )}
      </div>
    </div>
  );
};

export default MyAttendancePage;
