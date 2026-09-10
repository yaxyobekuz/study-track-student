// React
import { useMemo, useState } from "react";

// Router
import { useNavigate } from "react-router-dom";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Toast
import { toast } from "sonner";

// Icons
import { Award, Target, BookOpen, ClipboardList, Loader2, Play } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";
import ScoreRing from "../components/ScoreRing";
import AiTipBanner from "../components/AiTipBanner";
import EmptyBlock from "../components/EmptyBlock";
import DiagnosticTrendChart from "../components/DiagnosticTrendChart";

// Hooks
import useMe from "@/features/auth/hooks/useMe";

// Queries
import { diagnosticsQueries } from "../queries/diagnostics.queries";
import {
  useStartDiagnostic,
  usePracticeWeakTopics,
} from "../queries/diagnostics.mutations";

// Data
import { GRADE_LABELS, scoreColor } from "../data/diagnostics.data";

/**
 * DIAGNOSTIKA — BOSH SAHIFA.
 *
 * ⚠️ ALOHIDA SAHIFA, "Diagnostika" TABIDAN BOSHQA. Tab — ishlash uchun
 * (qaysi test ochiq, qaysisini boshlash mumkin); bu sahifa esa
 * "men qayerda turibman" degan savolga javob beradi. Ikkalasi bitta
 * ekranga sig'dirilsa, o'quvchi test boshlash tugmasini raqamlar orasidan
 * qidirib qolardi.
 *
 * ⚠️ BITTA SO'ROV (`dashboard`). Barcha bloklar AYNI to'plamdan
 * hisoblanadi — aks holda o'rtacha ball bir blokda 88%, ikkinchisida
 * 79% bo'lib chiqardi.
 */

/**
 * DAVR FILTRLARI — mijoz tomonida.
 *
 * ⚠️ SERVERGA QAYTA SO'ROV YUBORILMAYDI: `dashboard` oxirgi 50 urinishni
 * baribir olib keladi, davr esa shu ro'yxatdan kesib olinadi. Har tab
 * uchun so'rov yuborilsa, mobil internetda tab almashtirish sekin
 * bo'lardi.
 */
const PERIODS = [
  { key: "7", label: "7 kun", days: 7 },
  { key: "30", label: "30 kun", days: 30 },
  { key: "90", label: "3 oy", days: 90 },
  { key: "180", label: "6 oy", days: 180 },
  { key: "365", label: "1 yil", days: 365 },
  { key: "all", label: "Barchasi", days: null },
];

/** Foiz — ma'lumot yo'q bo'lsa nol emas, chiziqcha. */
const pct = (value) => (value == null ? "—" : `${Math.round(value)}%`);

/**
 * O'SISH YORLIG'I.
 *
 * ⚠️ "Barqaror" — 0 emas, TOR YO'LAK. Ikki test orasidagi 1-2 balllik
 * tebranish o'sish ham, pasayish ham emas; uni "o'sish" deb ko'rsatish
 * o'quvchiga yolg'on xabar berardi.
 */
const growthBadge = (growth) => {
  if (growth == null) return { label: "Yangi", className: "bg-white/10 text-white/70" };
  if (growth > 5) return { label: "O'sish", className: "bg-emerald-500/20 text-emerald-300" };
  if (growth < -5) return { label: "Pasayish", className: "bg-rose-500/20 text-rose-300" };
  return { label: "Barqaror", className: "bg-amber-500/20 text-amber-300" };
};

const KpiCard = ({ icon, tone, label, value, badge }) => (
  <Card className="space-y-2">
    <div className="flex items-start justify-between gap-2">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tone}`}
      >
        {icon}
      </span>
      {badge != null && (
        <span className="shrink-0 text-xs font-semibold text-gray-500">{badge}</span>
      )}
    </div>

    <div className="min-w-0">
      <p className="truncate text-base font-bold text-gray-900">{value}</p>
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
    </div>
  </Card>
);

const DiagnosticOverviewPage = () => {
  const navigate = useNavigate();
  const { me } = useMe();

  const { data: dashboard, isLoading } = useQuery(diagnosticsQueries.dashboard());
  const startDiagnostic = useStartDiagnostic();
  const practice = usePracticeWeakTopics();

  /**
   * ⚠️ "HOZIR" BIR MARTA OLINADI (`useState` ning dangasa boshlang'ichi).
   * `Date.now()` ni to'g'ridan-to'g'ri render ichida chaqirish
   * react-compiler qoidasini buzadi: har render boshqa natija beradi va
   * davr chegarasi sahifa ochiq turganda jimgina siljib ketardi.
   */
  const [nowMs] = useState(() => Date.now());

  const [period, setPeriod] = useState("30");
  const [busy, setBusy] = useState(false);

  const trend = useMemo(() => dashboard?.trend ?? [], [dashboard]);

  const visible = useMemo(() => {
    const days = PERIODS.find((p) => p.key === period)?.days;
    if (!days || nowMs == null) return trend;
    const from = nowMs - days * 24 * 60 * 60 * 1000;
    return trend.filter((row) => new Date(row.date).getTime() >= from);
  }, [trend, period, nowMs]);

  if (isLoading) return <LoaderCard />;

  const summary = dashboard?.summary ?? {};
  const subjects = dashboard?.subjects ?? [];
  const badge = growthBadge(summary.growth);

  /**
   * "Test ishlash" — mustaqil diagnostika.
   *
   * ⚠️ FAN YUBORILMAYDI: bosh sahifadagi tugma "menga nima kerakligini
   * o'zing hal qil" degani, aralash test esa barcha fanlardan kesim
   * beradi. Aniq fan bo'yicha boshlash "Diagnostika" tabida qoladi.
   */
  const startFree = () => {
    setBusy(true);
    startDiagnostic.mutate(
      {},
      {
        onSuccess: (attempt) => navigate(`/diagnostics/take/${attempt.id}`),
        onError: (err) => {
          toast.error(err.response?.data?.message || "Test boshlanmadi");
          setBusy(false);
        },
      },
    );
  };

  const practiceSubject = (recommendation) => {
    if (!recommendation?.subjectId) return;
    setBusy(true);
    practice.mutate(
      { subjectId: recommendation.subjectId },
      {
        onSuccess: (attempt) => navigate(`/diagnostics/take/${attempt.id}`),
        onError: (err) => {
          toast.error(err.response?.data?.message || "Mashq boshlanmadi");
          setBusy(false);
        },
      },
    );
  };

  return (
    <div className="min-h-screen pt-5 pb-40 animate__animated animate__fadeIn">
      <div className="container space-y-4">
        {/* ── SALOMLASHUV ─────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-gray-900">
              Salom, {me?.firstName || "o'quvchi"} 👋
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Natijalaringizni bir qarashda ko'rib chiqing.
            </p>
          </div>

          <button
            type="button"
            onClick={startFree}
            disabled={busy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" strokeWidth={2} />
            )}
            Test ishlash
          </button>
        </div>

        {/* ── UMUMIY O'ZLASHTIRISH ────────── */}
        <div className="rounded-2xl bg-gray-900 p-4 xs:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">
              Umumiy o'zlashtirish
            </p>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          <div className="mt-4 flex justify-center">
            <ScoreRing
              value={summary.averageScore ?? 0}
              size={148}
              stroke={13}
              color={scoreColor(summary.averageScore)}
              trackColor="#1F2937"
            >
              <span className="text-3xl font-bold text-white">
                {pct(summary.averageScore)}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-white/50">
                o'rtacha
              </span>
            </ScoreRing>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3 text-center">
              {/* ⚠️ O'SISH — BALL FARQI (foiz emas). "30 ball o'sdi" va
                  "30% o'sdi" butunlay boshqa gap; bu yerda birinchisi. */}
              <p className="text-base font-bold text-white">
                {summary.growth == null
                  ? "—"
                  : `${summary.growth > 0 ? "+" : ""}${Math.round(summary.growth)}`}
              </p>
              <p className="text-[11px] text-white/50">O'sish (ball)</p>
            </div>

            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-base font-bold text-white">
                {summary.attempts ?? 0}
              </p>
              <p className="text-[11px] text-white/50">Ishlangan test</p>
            </div>
          </div>
        </div>

        {/* ── RIVOJLANISH DINAMIKASI ──────── */}
        <Card title="Rivojlanish dinamikasi">
          <p className="text-xs text-gray-400">Vaqt bo'yicha natijalaringiz</p>

          <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {PERIODS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setPeriod(item.key)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === item.key
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-3">
            {visible.length >= 2 ? (
              <DiagnosticTrendChart points={visible} />
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">
                Bu davr uchun yetarli ma'lumot yo'q.
              </p>
            )}
          </div>
        </Card>

        {/* ── KO'RSATKICHLAR ──────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            icon={<Award size={18} strokeWidth={1.5} />}
            tone="bg-emerald-50 text-emerald-600"
            label="Eng kuchli fan"
            value={summary.bestSubject?.subject || "—"}
            badge={
              summary.bestSubject ? pct(summary.bestSubject.averageScore) : null
            }
          />
          <KpiCard
            icon={<Target size={18} strokeWidth={1.5} />}
            tone="bg-rose-50 text-rose-600"
            label="Eng kuchsiz fan"
            value={summary.worstSubject?.subject || "—"}
            badge={
              summary.worstSubject ? pct(summary.worstSubject.averageScore) : null
            }
          />
          <KpiCard
            icon={<BookOpen size={18} strokeWidth={1.5} />}
            tone="bg-blue-50 text-blue-600"
            label="Oxirgi natija"
            value={pct(summary.lastScore)}
            badge={summary.grade ? GRADE_LABELS[summary.grade] : null}
          />
          <KpiCard
            icon={<ClipboardList size={18} strokeWidth={1.5} />}
            tone="bg-amber-50 text-amber-600"
            label="Ishlangan testlar"
            value={summary.attempts ?? 0}
          />
        </div>

        {/* ── AI TAVSIYASI ────────────────── */}
        <AiTipBanner
          recommendation={dashboard?.recommendation}
          onPractice={practiceSubject}
          busy={busy}
        />

        {/* ── FANLAR BO'YICHA NATIJALAR ───── */}
        {subjects.length === 0 ? (
          <EmptyBlock
            title="Fanlar bo'yicha natijalar"
            hint="Birinchi testdan keyin har bir fandan o'zlashtirish darajangiz va mavzular kesimi shu yerda chiqadi."
          />
        ) : (
          <Card title="Fanlar bo'yicha natijalar">
            <p className="text-xs text-gray-400">
              Har bir fandan o'zlashtirish darajangiz
            </p>

            <div className="mt-3 space-y-4">
              {subjects.map((row) => (
                <div key={row.subjectId || row.subject}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {row.subject}
                      </p>
                      <p className="text-xs text-gray-400">
                        {row.tests} test · {row.correct}/{row.answered} savol
                      </p>
                    </div>

                    <span
                      className="shrink-0 text-sm font-bold tabular-nums"
                      style={{ color: scoreColor(row.averageScore) }}
                    >
                      {pct(row.averageScore)}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(0, Math.min(100, row.averageScore ?? 0))}%`,
                        backgroundColor: scoreColor(row.averageScore),
                      }}
                    />
                  </div>

                  {/* Mavzular — kuchlisi ham, zaifi ham. Faqat zaifi
                      ko'rsatilsa, ekran "hammasi yomon" bo'lib ko'rinardi. */}
                  {(row.strongTopics?.length > 0 || row.weakTopics?.length > 0) && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(row.strongTopics ?? []).slice(0, 3).map((topic) => (
                        <span
                          key={topic.topicId}
                          className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
                        >
                          {topic.topic} {Math.round(topic.score)}%
                        </span>
                      ))}
                      {(row.weakTopics ?? []).slice(0, 3).map((topic) => (
                        <span
                          key={topic.topicId}
                          className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-700"
                        >
                          {topic.topic} {Math.round(topic.score)}%
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* ⚠️ To'liq ekran sahifasi — pastki navigatsiya SHU YERDA
          qo'shiladi (tarix va natija sahifalarida ham shunday).
          Usiz o'quvchi bosh sahifadan chiqa olmay qolardi. */}
      <BottomNavbar />
    </div>
  );
};

export default DiagnosticOverviewPage;
