// Router
import { Link } from "react-router-dom";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Icons
import { ChevronRight } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";

// Queries
import { diagnosticsQueries } from "../queries/diagnostics.queries";

// Data
import { GRADE_LABELS, scoreColor } from "../data/diagnostics.data";

// Utils
import { formatDateUz } from "@/shared/utils/date.utils";

/**
 * PROFILDAGI DIAGNOSTIKA BLOKLARI.
 *
 * ⚠️ BITTA SO'ROV (`dashboard`) — barcha bloklar AYNI to'plamdan
 * hisoblanadi. Har blok o'zi so'rov qilsa, ular bir-biriga zid raqam
 * ko'rsatib qolardi (o'rtacha bir joyda 88%, ikkinchisida 79%).
 * So'rov diagnostika ro'yxati sahifasi bilan bir xil kalitda, ya'ni
 * profilga kirish qo'shimcha yuk bermaydi.
 *
 * ⚠️ TEST ISHLAMAGAN O'QUVCHIDA BLOK CHIQMAYDI. Nol bilan to'ldirilgan
 * to'rtta karta "natijang yomon" degan taassurot berardi — aslida hali
 * hech narsa bo'lmagan.
 */

const GRADE_ORDER = ["GOOD", "MEDIUM", "BAD"];
const GRADE_COLOR = { GOOD: "#10B981", MEDIUM: "#CA8A04", BAD: "#EF4444" };

/** Foizni ko'rsatish — ma'lumot yo'q bo'lsa nol emas, chiziqcha. */
const pct = (value) => (value == null ? "—" : `${Math.round(value)}%`);

const StatBox = ({ label, value, hint = null }) => (
  <div className="rounded-2xl bg-white p-3.5">
    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
      {label}
    </p>
    <p className="mt-1 truncate text-lg font-bold text-gray-900">{value}</p>
    {hint && <p className="truncate text-xs text-gray-500">{hint}</p>}
  </div>
);

/**
 * NATIJALAR TAQSIMOTI — halqa diagramma.
 *
 * ⚠️ HALQA SANOQDAN QURILADI, o'rtacha balldan EMAS. Bir vaqtlar admin
 * panelida aynan shu blok o'rtacha ballni ko'rsatib turardi va "yaxshi/
 * o'rta/zaif" taqsimoti umuman ko'rinmasdi.
 */
const DistributionRing = ({ counts, total }) => {
  const size = 104;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Ulushlar ketma-ket joylashtiriladi: har biri oldingilarining
  // yig'indisidan boshlanadi (`reduce` — render'dan keyin o'zgaruvchi
  // qayta yozilmasligi uchun, react-compiler qoidasi).
  const arcs = GRADE_ORDER.reduce(
    (acc, key) => {
      const count = counts[key] || 0;
      if (count > 0) {
        acc.items.push({
          key,
          count,
          offset: acc.used,
          length: (count / total) * circumference,
        });
      }
      return { items: acc.items, used: acc.used + (count / total) * circumference };
    },
    { items: [], used: 0 },
  ).items;

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={stroke}
          />
          {arcs.map((arc) => (
            <circle
              key={arc.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={GRADE_COLOR[arc.key]}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={`${arc.length} ${circumference - arc.length}`}
              strokeDashoffset={-arc.offset}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{total}</span>
          <span className="text-[11px] text-gray-400">test</span>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        {GRADE_ORDER.map((key) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: GRADE_COLOR[key] }}
            />
            <span className="flex-1 text-gray-600">{GRADE_LABELS[key]}</span>
            <span className="font-semibold tabular-nums text-gray-900">
              {counts[key] || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DiagnosticProfileCards = () => {
  const { data: dashboard, isLoading } = useQuery(diagnosticsQueries.dashboard());

  if (isLoading || !dashboard) return null;

  const summary = dashboard.summary ?? {};
  const subjects = dashboard.subjects ?? [];
  const trend = dashboard.trend ?? [];

  // Hali test ishlamagan o'quvchiga bo'sh raqamlar ko'rsatilmaydi.
  if (!summary.attempts) return null;

  const counts = trend.reduce((acc, row) => {
    if (row.grade) acc[row.grade] = (acc[row.grade] || 0) + 1;
    return acc;
  }, {});
  const graded = GRADE_ORDER.reduce((sum, key) => sum + (counts[key] || 0), 0);

  // Eng so'nggisi tepada — profilda odam avval "oxirgi marta nima bo'ldi"
  // degan savolga javob qidiradi.
  const recent = [...trend].reverse().slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <StatBox label="Testlar" value={summary.attempts} />
        <StatBox
          label="O'rtacha"
          value={pct(summary.averageScore)}
          hint={summary.gradeLabel || null}
        />
        <StatBox
          label="Eng kuchli"
          value={summary.bestSubject?.subject || "—"}
          hint={
            summary.bestSubject ? pct(summary.bestSubject.averageScore) : null
          }
        />
        <StatBox
          label="Eng kuchsiz"
          value={summary.worstSubject?.subject || "—"}
          hint={
            summary.worstSubject ? pct(summary.worstSubject.averageScore) : null
          }
        />
      </div>

      {subjects.length > 0 && (
        <Card title="Fanlar bo'yicha o'zlashtirish">
          <p className="text-xs text-gray-400">Har fandan o'rtacha</p>

          <div className="mt-3 space-y-3">
            {subjects.map((row) => (
              <div key={row.subjectId || row.subject}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate font-medium text-gray-900">
                    {row.subject}
                  </span>
                  {/* ⚠️ Foiz yonida MAXRAJ ham turadi: "17%" o'zi
                      12 ta savoldanmi yoki 120 tadanmi ekanini aytmaydi. */}
                  <span className="shrink-0 tabular-nums text-gray-500">
                    {row.correct}/{row.answered} ·{" "}
                    <span className="font-semibold text-gray-900">
                      {pct(row.averageScore)}
                    </span>
                  </span>
                </div>

                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, row.averageScore ?? 0))}%`,
                      backgroundColor: scoreColor(row.averageScore),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {graded > 0 && (
        <Card title="Natijalar taqsimoti">
          <p className="mb-3 text-xs text-gray-400">Testlar darajasi</p>
          <DistributionRing counts={counts} total={graded} />
        </Card>
      )}

      {recent.length > 0 && (
        <Card title="Testlar tarixi">
          <p className="text-xs text-gray-400">
            Ustiga bosib natijani batafsil ko'ring
          </p>

          <div className="mt-3 space-y-2">
            {recent.map((row) => (
              <Link
                key={row.attemptId}
                to={`/diagnostics/result/${row.attemptId}`}
                className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-colors active:bg-gray-100"
              >
                <span
                  className="h-8 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: scoreColor(row.score) }}
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">
                    {row.subject || "Aralash"}
                  </span>
                  <span className="block text-xs text-gray-400">
                    {formatDateUz(row.date)}
                  </span>
                </span>

                <span
                  className="shrink-0 text-sm font-bold tabular-nums"
                  style={{ color: scoreColor(row.score) }}
                >
                  {pct(row.score)}
                </span>

                <ChevronRight
                  className="size-4 shrink-0 text-gray-300"
                  strokeWidth={1.5}
                />
              </Link>
            ))}
          </div>

          <Link
            to="/diagnostics/history"
            className="mt-3 block text-center text-sm font-medium text-primary"
          >
            Barcha natijalar
          </Link>
        </Card>
      )}
    </>
  );
};

export default DiagnosticProfileCards;
