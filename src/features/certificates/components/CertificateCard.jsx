// Icons
import { BookOpen, CalendarClock, CircleCheckBig, Clock } from "lucide-react";

// Utils
import { cn } from "@/shared/utils/cn";

/**
 * BITTA SERTIFIKAT REJASI — o'quvchi ko'radigan karta.
 *
 * ⚠️ MUDDAT SANASI SERVER BERGAN YORLIQDAN (`dueDateLabel`): muddat
 * `@db.Date` va UTC yarim tunida yotadi, brauzerda qayta formatlansa
 * manfiy ofsetli mintaqada bir kun orqaga siljib ketardi
 * (`.claude/rules/dates.md` §4).
 *
 * ⚠️ MAVZU PROGRESSI SINFGA tegishli, o'quvchining o'ziga emas —
 * platformada shaxsiy mavzu o'rni yo'q. Shu sababli sinf nomi ham
 * yoziladi: raqam qayerdan kelgani ko'rinib turishi kerak.
 *
 * ⚠️ Progress bo'lmasa SABABI yoziladi, "—" emas: o'quvchi buni nosozlik
 * deb o'ylamasligi kerak.
 */
const CertificateCard = ({ plan }) => {
  const isPassed = plan.status === "passed";
  const overdue = !isPassed && plan.daysLeft !== null && plan.daysLeft < 0;
  const soon = !isPassed && plan.daysLeft !== null && plan.daysLeft >= 0 && plan.daysLeft <= 30;

  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-4 shadow-sm",
        overdue && "ring-1 ring-red-200",
      )}
    >
      {/* Yo'nalish va holat */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">{plan.track.name}</p>
          {plan.track.subject && (
            <p className="truncate text-xs text-gray-500">{plan.track.subject.name}</p>
          )}
        </div>

        {isPassed ? (
          <span className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            <CircleCheckBig className="size-3.5" strokeWidth={2} />
            Topshirdingiz
          </span>
        ) : (
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
              overdue
                ? "bg-red-50 text-red-700"
                : soon
                  ? "bg-amber-50 text-amber-700"
                  : "bg-gray-100 text-gray-600",
            )}
          >
            <Clock className="size-3.5" strokeWidth={2} />
            {plan.daysLeftLabel}
          </span>
        )}
      </div>

      {/* Muddat */}
      <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-600">
        <CalendarClock className="size-4 shrink-0 text-gray-400" strokeWidth={1.75} />
        {plan.dueDate ? (
          <span>
            Topshirish muddati:{" "}
            <span className="font-medium text-gray-900">{plan.dueDateLabel}</span>
          </span>
        ) : (
          <span className="text-gray-500">Muddat hali belgilanmagan</span>
        )}
      </div>

      {/* Mavzu progressi */}
      <div className="mt-3.5 rounded-xl bg-gray-50 p-3">
        {plan.progress?.available ? (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <BookOpen className="size-3.5" strokeWidth={1.75} />
                Mavzular
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {plan.progress.percent}%
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width] duration-700"
                style={{ width: `${Math.min(Math.max(plan.progress.percent, 0), 100)}%` }}
              />
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>
                {plan.progress.reachedTopics} / {plan.progress.totalTopics} mavzuga yetdingiz
              </span>
              <span>Yana {plan.progress.remainingTopics} mavzu</span>
            </div>

            {plan.progress.currentTopicName && (
              <p className="mt-1.5 truncate text-xs text-gray-600">
                Joriy mavzu: {plan.progress.currentTopicName}
                {plan.progress.className ? ` · ${plan.progress.className}` : ""}
              </p>
            )}
          </>
        ) : (
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <BookOpen className="size-3.5 shrink-0" strokeWidth={1.75} />
            {plan.progress?.reason || "Mavzu progressi hisoblanmadi"}
          </p>
        )}
      </div>

      {plan.note && (
        <p className="mt-3 text-xs text-gray-500">Izohingiz: {plan.note}</p>
      )}
    </div>
  );
};

export default CertificateCard;
