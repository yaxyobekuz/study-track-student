// Utils
import { cn } from "@/shared/utils/cn";

// Data
import {
  STATUS_COLORS,
  STATUS_LABELS,
  WEEKDAY_SHORT_LABELS,
} from "../data/attendance.data";
import {
  daysInMonthKey,
  firstWeekdayOfMonthKey,
  tashkentToday,
} from "../utils/attendance.utils";

/**
 * Oy kalendari — har kun o'z holati rangida. Belgilanmagan kun rangsiz.
 *
 * @param {object} props
 * @param {number} props.monthKey - YYYYMM
 * @param {Array<{date: string, status: string}>} props.records
 */
const AttendanceCalendar = ({ monthKey, records }) => {
  // Sana UTC yarim tunida — kun raqami `getUTCDate()` bilan olinadi
  const recordsByDay = new Map(
    records.map((rec) => [new Date(rec.date).getUTCDate(), rec]),
  );

  const now = tashkentToday();
  const today = now.monthKey === monthKey ? now.day : null;

  const emptyCells = Array.from({ length: firstWeekdayOfMonthKey(monthKey) });
  const dayCells = Array.from(
    { length: daysInMonthKey(monthKey) },
    (_, i) => i + 1,
  );

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-gray-400">
        {WEEKDAY_SHORT_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {dayCells.map((day) => {
          const rec = recordsByDay.get(day);

          return (
            <div
              key={day}
              title={rec ? STATUS_LABELS[rec.status] : undefined}
              className={cn(
                "flex aspect-square items-center justify-center rounded-full border-2 text-sm",
                rec ? STATUS_COLORS[rec.status] : "text-gray-400",
                day === today ? "border-primary" : "border-transparent",
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
