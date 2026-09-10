// Icons
import { Target, Loader2, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

// Data
import { scoreColor } from "../data/diagnostics.data";

/**
 * BITTA FAN KARTASI — o'zlashtirish foizi, o'sish, mavzu yorliqlari va
 * o'sha fanning zaif mavzularini mashq qilish tugmasi.
 *
 * ⚠️ TUGMA HAR FANDA ALOHIDA. "Umumiy mashq" tugmasi o'quvchini eng
 * zaif fanga majburlab yuborardi; bu yerda u qaysi fandan mashq
 * qilishni O'ZI tanlaydi.
 */
const SubjectResultCard = ({ subject, onPractice, busy = false }) => {
  const color =
    subject.averageScore != null ? scoreColor(subject.averageScore) : "#94A3B8";

  // ⚠️ O'SISH — PUNKT farqi (foiz emas): "61% dan 68% ga" — 7 punkt.
  const growth = subject.growth;
  const GrowthIcon =
    growth == null ? null : growth > 0 ? ArrowUpRight : growth < 0 ? ArrowDownRight : Minus;
  const growthClass =
    growth > 0 ? "text-emerald-600" : growth < 0 ? "text-rose-600" : "text-gray-400";

  return (
    <div className="rounded-2xl bg-white p-4 xs:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">{subject.subject}</p>
          <p className="mt-0.5 text-sm text-gray-500">
            {subject.tests} test · {subject.questions} savol
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-2xl font-bold tabular-nums" style={{ color }}>
            {subject.averageScore != null
              ? `${Math.round(subject.averageScore)}%`
              : "—"}
          </p>
          {GrowthIcon && (
            <p
              className={`flex items-center justify-end gap-0.5 text-xs font-medium ${growthClass}`}
            >
              <GrowthIcon size={13} />
              {growth > 0 ? "+" : ""}
              {growth} ball
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
          style={{
            width: `${Math.min(100, Math.max(0, subject.averageScore ?? 0))}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {(subject.strongTopics.length > 0 || subject.weakTopics.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {subject.strongTopics.slice(0, 2).map((t) => (
            <span
              key={t.topicId || t.topic}
              className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
            >
              {t.topic} {Math.round(t.score)}%
            </span>
          ))}
          {subject.weakTopics.slice(0, 2).map((t) => (
            <span
              key={t.topicId || t.topic}
              className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700"
            >
              {t.topic} {Math.round(t.score)}%
            </span>
          ))}
        </div>
      )}

      {/* Zaif mavzu yo'q bo'lsa mashq qiladigan narsa ham yo'q. */}
      {subject.weakTopics.length > 0 && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onPractice?.(subject)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 disabled:opacity-60"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Target size={15} />}
          Zaif mavzularni mashq qilish
        </button>
      )}
    </div>
  );
};

export default SubjectResultCard;
