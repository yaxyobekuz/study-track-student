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
 * ⚠️ IKKI KO'RINISH, BITTA MA'LUMOT. Kengroq ekranda (≥640px) ro'yxat
 * manba loyihadagidek saralanadigan ustunli JADVAL; telefonda esa
 * (Telegram ilovasi, ~400px) o'sha maydonlar ixcham qatorga yig'iladi —
 * sakkiz ustun u yerda gorizontal skrollga aylanardi. Ikkala ko'rinish
 * ham AYNI `rows` va AYNI `open()` dan foydalanadi.
 */

/**
 * "BARCHA FANLAR" QIYMATI — BO'SH SATR EMAS.
 *
 * ⚠️ Radix Select bo'sh satrli `<Select.Item>` ni TAQIQLAYDI va xato
 * tashlaydi ("must have a value prop that is not an empty string") —
 * bo'sh satr uning uchun "tanlov tozalandi" degani. Bu xato ishlab
 * turgan saytda test tarixi sahifasini BUTUNLAY OQ qilib qo'ygan edi.
 *
 * Lokalda takrorlanmadi, chunki `package-lock.json` git'da yo'q:
 * serverda Radix'ning eskiroq (tekshiruvi bor) versiyasi, lokalda esa
 * yangisi turibdi. Maxsus qiymat IKKALA versiyada ham ishlaydi.
 */
const ALL_SUBJECTS = "__all__";

const SORTS = [
  { key: "date", label: "Sana", value: (r) => r.submittedAt || r.createdAt || "" },
  { key: "subject", label: "Fan", value: (r) => r.subjectName || r.testTitle || "" },
  { key: "score", label: "Natija", value: (r) => r.score ?? -1 },
];

const DiagnosticHistoryPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(diagnosticsQueries.myAttempts(100));

  const [subject, setSubject] = useState(ALL_SUBJECTS);
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
      { value: ALL_SUBJECTS, label: "Barcha fanlar" },
      ...names.sort().map((name) => ({ value: name, label: name })),
    ];
  }, [attempts]);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = attempts.filter((a) => {
      if (subject !== ALL_SUBJECTS && a.subjectName !== subject) return false;
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

  /**
   * Urinishni ochish — tugallanmagani davom ettiriladi, tugallangani
   * tahlilga olib boradi. Bitta joyda: jadval va telefon qatori ikkalasi
   * ham shuni chaqiradi, aks holda ikkisi turli sahifaga olib ketardi.
   */
  const open = (row) =>
    navigate(
      row.status === "in_progress"
        ? `/diagnostics/take/${row.id}`
        : `/diagnostics/result/${row.id}`,
    );

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

        <div>
          <h1 className="text-xl font-bold text-gray-900">Test tarixi</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Barcha imtihonlaringiz va ularning tahlili.
          </p>
        </div>

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

        {/* ── FILTRLAR + JADVAL — BITTA KARTADA ── */}
        {/* ⚠️ Filtr va ro'yxat bir kartada: filtr NIMANI toraytirayotgani
            ko'z oldida turadi. Alohida kartalarda bo'lsa, filtr qo'yilgan-u
            ro'yxat "nega qisqardi" degan savol tug'ilardi. */}
        <Card className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
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
          </div>

          {/* ⚠️ Telefonda jadval sarlavhasi yo'q — saralash shu tugmalarda.
              Kengroq ekranda esa ustun sarlavhasining o'zi bosiladi. */}
          <div className="flex flex-wrap gap-2 sm:hidden">
            {SORTS.map((column) => (
              <SortPill
                key={column.key}
                column={column}
                sort={sort}
                onToggle={toggleSort}
              />
            ))}
          </div>

          {rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              {attempts.length === 0
                ? "Hali test topshirilmagan. Birinchi diagnostikadan keyin natijalaringiz shu yerda tahlili bilan chiqadi."
                : "Bu shartlarga mos test topilmadi."}
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              {/* ── SARLAVHA (faqat keng ekranda) ── */}
              <div
                className={cn(
                  "hidden items-center gap-1.5 bg-gray-50/80 px-2 py-2.5 text-[11px] font-semibold text-gray-500 sm:grid",
                  TABLE_GRID,
                )}
              >
                <SortHeader column={SORTS[0]} sort={sort} onToggle={toggleSort} />
                <SortHeader column={SORTS[1]} sort={sort} onToggle={toggleSort} />
                <span className="text-right">Savollar</span>
                <span className="text-right">To'g'ri</span>
                <span className="text-right">Noto'g'ri</span>
                <SortHeader
                  column={SORTS[2]}
                  sort={sort}
                  onToggle={toggleSort}
                  align="right"
                />
                <span className="text-center">Daraja</span>
                <span />
              </div>

              <div className="divide-y divide-gray-100">
                {rows.map((row) => {
                  const name = row.subjectName || row.testTitle || "Diagnostika";
                  const date = formatDateUz(row.submittedAt || row.createdAt);
                  const score = row.score != null ? `${Math.round(row.score)}%` : "—";
                  const action = row.status === "in_progress" ? "Davom etish" : "Tahlil";

                  return (
                    <div key={row.id}>
                      {/* ── KENG EKRAN: jadval qatori ── */}
                      <div
                        className={cn(
                          "hidden items-center gap-1.5 px-2 py-3 text-sm sm:grid",
                          TABLE_GRID,
                        )}
                      >
                        <span className="text-xs text-gray-600">{date}</span>
                        <span
                          className="truncate text-[13px] font-semibold text-gray-900"
                          title={name}
                        >
                          {name}
                        </span>
                        <span className="text-right tabular-nums text-gray-700">
                          {row.totalQuestions ?? 0}
                        </span>
                        <span className="text-right font-semibold tabular-nums text-emerald-600">
                          {row.correctCount ?? 0}
                        </span>
                        <span className="text-right font-semibold tabular-nums text-rose-600">
                          {row.wrongCount ?? 0}
                        </span>
                        <span
                          className="text-right font-bold tabular-nums"
                          style={{ color: scoreColor(row.score) }}
                        >
                          {score}
                        </span>
                        <span className="flex justify-center">
                          {row.grade ? (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                                GRADE_BADGE[row.grade],
                              )}
                            >
                              {GRADE_LABELS[row.grade]}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </span>
                        <span className="flex justify-end">
                          {/* ⚠️ Jadvalda "Davom" — "Davom etish" 52px ustunga
                              sig'masdi. Telefon qatorida to'liq so'z qoladi. */}
                          <button
                            type="button"
                            onClick={() => open(row)}
                            className="rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-white"
                          >
                            {row.status === "in_progress" ? "Davom" : "Tahlil"}
                          </button>
                        </span>
                      </div>

                      {/* ── TELEFON: o'sha ma'lumot, ixcham ── */}
                      <div className="flex items-start gap-3 p-3 sm:hidden">
                        <span
                          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums"
                          style={{
                            backgroundColor: `${scoreColor(row.score)}1A`,
                            color: scoreColor(row.score),
                          }}
                        >
                          {score}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate font-semibold text-gray-900">{name}</p>
                            {row.grade && (
                              <span
                                className={cn(
                                  "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                  GRADE_BADGE[row.grade],
                                )}
                              >
                                {GRADE_LABELS[row.grade]}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{date}</p>

                          <div className="mt-2 flex items-center gap-3 text-xs">
                            <span className="text-gray-500">
                              Savol{" "}
                              <b className="text-gray-900">{row.totalQuestions ?? 0}</b>
                            </span>
                            <span className="text-gray-500">
                              To'g'ri{" "}
                              <b className="text-emerald-600">{row.correctCount ?? 0}</b>
                            </span>
                            <span className="text-gray-500">
                              Xato <b className="text-rose-600">{row.wrongCount ?? 0}</b>
                            </span>

                            <button
                              type="button"
                              onClick={() => open(row)}
                              className="ml-auto shrink-0 rounded-lg bg-gray-900 px-3 py-1.5 font-semibold text-white"
                            >
                              {action}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>

      <BottomNavbar />
    </div>
  );
};

/**
 * JADVAL USTUNLARI — sarlavha va qatorlar AYNI shablonni ishlatadi.
 *
 * ⚠️ HAR PIKSEL HISOBLANGAN. Panel konteyneri `max-w-xl` — kompyuterda
 * ham jadvalga ~504px qoladi (karta va qator ichki chegaralaridan
 * keyin). Birinchi versiyada qat'iy ustunlar hammasini yeb qo'ydi va
 * FAN ustuniga ~10px qoldi: "Ingliz tili" o'rniga "I." ko'rinardi.
 *
 *   80 + 84(fan, kamida) + 44 + 40 + 50 + 44 + 52 + 52 = 446
 *   + 7 ta oraliq × 6px (42) + ichki chegara 2 × 8px (16) = 504
 *
 * Fan ustuni `minmax(84px, 1fr)` — kamida "Matematika" sig'adi, joy
 * bo'lsa kengayadi. Shablon ikki joyda alohida yozilsa, sarlavha va
 * raqamlar bir-biridan siljib ketardi.
 */
const TABLE_GRID =
  "grid-cols-[80px_minmax(84px,1fr)_44px_40px_50px_44px_52px_52px]";

/** Saralanadigan ustun sarlavhasi — rasmdagidek o'q belgisi bilan. */
const SortHeader = ({ column, sort, onToggle, align = "left" }) => {
  const active = sort.key === column.key;
  const Icon = active ? (sort.dir === 1 ? ChevronUp : ChevronDown) : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={() => onToggle(column.key)}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1 transition-colors hover:text-gray-900",
        align === "right" && "justify-end",
        active && "text-gray-900",
      )}
    >
      {column.label}
      <Icon size={12} className={active ? "" : "opacity-50"} />
    </button>
  );
};

/** Telefondagi saralash tugmasi — sarlavha yo'q joyda uning o'rnini bosadi. */
const SortPill = ({ column, sort, onToggle }) => {
  const active = sort.key === column.key;
  const Icon = active ? (sort.dir === 1 ? ChevronUp : ChevronDown) : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={() => onToggle(column.key)}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600",
      )}
    >
      {column.label}
      <Icon size={12} className={active ? "" : "opacity-50"} />
    </button>
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
