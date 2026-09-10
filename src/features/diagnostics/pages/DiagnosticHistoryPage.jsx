// React
import { useMemo, useState } from "react";

// Router
import { useNavigate } from "react-router-dom";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ClipboardList,
  TrendingUp,
  Award,
  Target,
  Search,
} from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";

// Queries
import { diagnosticsQueries } from "../queries/diagnostics.queries";

// Data
import { GRADE_LABELS, GRADE_BADGE, scoreColor } from "../data/diagnostics.data";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatDateUz } from "@/shared/utils/date.utils";

/**
 * TEST TARIXI — o'quvchining barcha diagnostika urinishlari.
 *
 * ⚠️ KO'RSATKICHLAR FILTRDAN MUSTAQIL. "Jami / O'rtacha / Eng yuqori /
 * Eng past" BUTUN tarixni o'lchaydi; fan tanlash va qidiruv faqat
 * pastdagi ro'yxatni toraytiradi. Ular ham filtrlansa, "o'rtacha
 * natijam qancha" degan savolga javob ekrandagi filtrga qarab
 * o'zgarib turardi.
 *
 * ⚠️ JADVAL EMAS, KARTALAR RO'YXATI. Panel Telegram ilovasi ichida,
 * ~400px enida ochiladi: sakkiz ustunli jadval u yerda gorizontal
 * skroll bo'lib qolardi. Ma'lumot va amallar admin paneldagi jadval
 * bilan AYNI — faqat joylashuvi telefon uchun.
 */

const SORTS = [
  { key: "date", label: "Sana", value: (r) => r.submittedAt || r.createdAt || "" },
  { key: "subject", label: "Fan", value: (r) => r.subjectName || r.testTitle || "" },
  { key: "score", label: "Natija", value: (r) => r.score ?? -1 },
];

const DiagnosticHistoryPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(diagnosticsQueries.myAttempts(100));

  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");
  // ⚠️ Sukut bo'yicha sana bo'yicha KAMAYISH tartibida — server ham
  // shunday qaytaradi, ya'ni birinchi ko'rinish "eng yangisi tepada".
  const [sort, setSort] = useState({ key: "date", dir: -1 });

  const attempts = useMemo(() => data ?? [], [data]);

  const stats = useMemo(() => {
    const scores = attempts.filter((a) => a.score != null).map((a) => a.score);
    return {
      total: attempts.length,
      average: scores.length
        ? Math.round((scores.reduce((n, x) => n + x, 0) / scores.length) * 10) / 10
        : null,
      best: scores.length ? Math.max(...scores) : null,
      worst: scores.length ? Math.min(...scores) : null,
    };
  }, [attempts]);

  const subjectOptions = useMemo(() => {
    const names = [...new Set(attempts.map((a) => a.subjectName).filter(Boolean))];
    return [
      { value: "", label: "Barcha fanlar" },
      ...names.sort().map((name) => ({ value: name, label: name })),
    ];
  }, [attempts]);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = attempts.filter((a) => {
      if (subject && a.subjectName !== subject) return false;
      if (!needle) return true;
      // Qidiruv fan VA test nomi bo'yicha — o'quvchi ko'pincha testni
      // nomi bilan eslaydi, fan nomi bilan emas.
      return `${a.subjectName || ""} ${a.testTitle || ""}`
        .toLowerCase()
        .includes(needle);
    });

    const column = SORTS.find((s) => s.key === sort.key);
    if (!column) return filtered;

    return [...filtered].sort((a, b) => {
      const va = column.value(a);
      const vb = column.value(b);
      if (va < vb) return -1 * sort.dir;
      if (va > vb) return 1 * sort.dir;
      return 0;
    });
  }, [attempts, subject, query, sort]);

  const toggleSort = (key) =>
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 1 ? -1 : 1 } : { key, dir: -1 },
    );

  if (isLoading) return <LoaderCard />;

  return (
    <div className="min-h-screen pb-28 animate__animated animate__fadeIn">
      <div className="container space-y-4 pt-4">
        <button
          type="button"
          onClick={() => navigate("/tests/diagnostics")}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500"
        >
          <ArrowLeft size={16} />
          Diagnostikaga qaytish
        </button>

        <h1 className="text-xl font-bold text-gray-900">Test tarixi</h1>

        {/* ── KO'RSATKICHLAR ────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <StatMini
            icon={ClipboardList}
            tint="#8A94FF"
            label="Jami testlar"
            value={stats.total}
          />
          <StatMini
            icon={TrendingUp}
            tint="#F59E0B"
            label="O'rtacha"
            value={stats.average != null ? `${stats.average}%` : "—"}
          />
          <StatMini
            icon={Award}
            tint="#10B981"
            label="Eng yuqori"
            value={stats.best != null ? `${Math.round(stats.best)}%` : "—"}
          />
          <StatMini
            icon={Target}
            tint="#EF4444"
            label="Eng past"
            value={stats.worst != null ? `${Math.round(stats.worst)}%` : "—"}
          />
        </div>

        {/* ── FILTRLAR ──────────────────────── */}
        <Card className="space-y-3">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Fan
            </p>
            <Select
              value={subject}
              onChange={setSubject}
              options={subjectOptions}
              placeholder="Barcha fanlar"
            />
          </div>

          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Qidiruv
            </p>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Fan yoki test nomi…"
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
            <span className="self-center text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Saralash
            </span>
            {SORTS.map((column) => {
              const active = sort.key === column.key;
              const Icon = active
                ? sort.dir === 1
                  ? ChevronUp
                  : ChevronDown
                : ArrowUpDown;
              return (
                <button
                  key={column.key}
                  type="button"
                  onClick={() => toggleSort(column.key)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600",
                  )}
                >
                  {column.label}
                  <Icon size={12} className={active ? "" : "opacity-50"} />
                </button>
              );
            })}
          </div>
        </Card>

        {/* ── RO'YXAT ───────────────────────── */}
        {rows.length === 0 ? (
          <Card>
            <p className="py-8 text-center text-sm text-gray-500">
              {attempts.length === 0
                ? "Hali test topshirilmagan."
                : "Bu shartlarga mos test topilmadi."}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="rounded-2xl bg-white p-4 xs:p-5">
                <div className="flex items-start gap-3">
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums"
                    style={{
                      backgroundColor: `${scoreColor(row.score)}1A`,
                      color: scoreColor(row.score),
                    }}
                  >
                    {row.score != null ? `${Math.round(row.score)}%` : "—"}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">
                      {row.subjectName || row.testTitle || "Diagnostika"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {formatDateUz(row.submittedAt || row.createdAt)}
                    </p>
                  </div>

                  {row.grade && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-1 text-xs font-medium",
                        GRADE_BADGE[row.grade],
                      )}
                    >
                      {GRADE_LABELS[row.grade]}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3 text-xs">
                  <span className="text-gray-500">
                    Savollar:{" "}
                    <span className="font-semibold text-gray-900">
                      {row.totalQuestions ?? 0}
                    </span>
                  </span>
                  <span className="text-gray-500">
                    To'g'ri:{" "}
                    <span className="font-semibold text-emerald-600">
                      {row.correctCount ?? 0}
                    </span>
                  </span>
                  <span className="text-gray-500">
                    Noto'g'ri:{" "}
                    <span className="font-semibold text-rose-600">
                      {row.wrongCount ?? 0}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        row.status === "in_progress"
                          ? `/diagnostics/take/${row.id}`
                          : `/diagnostics/result/${row.id}`,
                      )
                    }
                    className="ml-auto shrink-0 rounded-lg bg-gray-900 px-3 py-1.5 font-semibold text-white"
                  >
                    {row.status === "in_progress" ? "Davom etish" : "Tahlil"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

/** ⚠️ Ikonka TANADA nomlanadi — sahifadagi `Metric` bilan bir xil sabab. */
const StatMini = ({ icon, tint, label, value }) => {
  const Icon = icon;

  return (
    <div className="rounded-2xl bg-white p-4">
      <span
        className="mb-2.5 flex size-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${tint}1F`, color: tint }}
      >
        <Icon size={18} />
      </span>
      <p className="truncate text-xl font-bold tabular-nums text-gray-900">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
    </div>
  );
};

export default DiagnosticHistoryPage;
