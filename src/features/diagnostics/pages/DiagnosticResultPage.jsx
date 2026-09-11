// React
import { useState } from "react";

// Router
import { useNavigate, useParams } from "react-router-dom";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Toast
import { toast } from "sonner";

// Icons
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Circle,
  ChevronDown,
  Sparkles,
  Loader2,
  Lightbulb,
  Clock,
  Target,
  Download,
  BookOpen,
  ListChecks,
  LayoutGrid,
} from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import ScoreRing from "../components/ScoreRing";
import FindingCards from "../components/FindingCards";
import SubjectBars from "../components/SubjectBars";
import ErrorPatternCard from "../components/ErrorPatternCard";
import GapCards from "../components/GapCards";
import RoadmapTimeline from "../components/RoadmapTimeline";
import SectionHeader from "../components/SectionHeader";

// Queries
import { diagnosticsQueries } from "../queries/diagnostics.queries";
import { useExplainDiagnosticAnswer } from "../queries/diagnostics.mutations";

// API
import { diagnosticsAPI } from "../api/diagnostics.api";

// Data
import {
  scoreColor,
  toneOf,
  TONES,
  GRADE_LABELS,
  GRADE_BADGE,
  ERROR_REASONS,
} from "../data/diagnostics.data";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatDateUz, formatClockUz } from "@/shared/utils/date.utils";
import { downloadBlob } from "@/shared/utils/download.utils";

/**
 * DIAGNOSTIKA NATIJASI (o'quvchi ko'rinishi).
 *
 * ⚠️ SAHIFA AI'NI KUTMAYDI. Ball, mavzular kesimi va yo'l xaritasi
 * darhol chiziladi — ular QOIDALAR bilan hisoblangan. AI matni tayyor
 * bo'lgach o'zi qo'shiladi.
 *
 * ⚠️ TO'G'RI JAVOB SERVER RUXSAT BERSAGINA KO'RINADI (`showAnswers`).
 * O'qituvchi "javoblarni ko'rsatma" deb qo'ysa, server `isCorrect` ni
 * umuman yubormaydi — bu yerda uni "chizmaslik" bilan cheklanib
 * bo'lmaydi, chunki ma'lumot baribir tarmoqda ketardi.
 */
const DiagnosticResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(diagnosticsQueries.result(attemptId));
  const { data: insights = [] } = useQuery(diagnosticsQueries.insights(attemptId));

  const attempt = data?.attempt;
  const breakdown = data?.breakdown ?? [];
  const questions = data?.questions ?? [];
  const errors = data?.errorPatterns;
  const showAnswers = data?.showAnswers;
  const findings = data?.findings ?? [];
  const gaps = data?.gaps ?? [];
  const subjects = data?.subjects ?? [];
  const curve = data?.predictionCurve ?? [];

  const [exporting, setExporting] = useState(false);

  /**
   * ⚠️ ENG KUCHLI/ENG ZAIF SERVERDAN KELGAN `findings` DAN OLINADI, bu
   * yerda qayta hisoblanmaydi: aks holda sarlavhadagi mavzu topilmalar
   * blokidagi mavzudan farq qilib qolardi.
   */
  const strongest = findings.find((f) => f.kind === "strength") || null;
  const weakest = findings.find((f) => f.kind === "blocker") || null;

  const subjectLabel =
    subjects.length > 0
      ? subjects.map((s) => s.subject).join(", ")
      : attempt?.testTitle || "Diagnostika";

  const exportResult = async () => {
    setExporting(true);
    try {
      const response = await diagnosticsAPI.exportResult(attemptId);
      downloadBlob(response);
    } catch {
      toast.error("Hisobotni yuklab bo'lmadi");
    } finally {
      setExporting(false);
    }
  };

  const feedback = insights.find((i) => i.kind === "feedback");
  const roadmapInsight = insights.find((i) => i.kind === "roadmap");
  const planInsight = insights.find((i) => i.kind === "plan");
  const roadmap = roadmapInsight?.output ?? data?.roadmap;

  if (isLoading) return <LoaderCard />;

  if (!attempt) {
    return (
      <div className="container pt-4">
        <Card>
          <p className="py-8 text-center text-gray-500">Natija topilmadi</p>
        </Card>
      </div>
    );
  }

  // Pastki paneldagi maslahat — eng zaif mavzu bo'lsa o'sha, bo'lmasa
  // umumiy undov. Manba loyihada ham shu joyda bitta aniq qadam turadi.
  const nextStep = weakest?.topic
    ? `${weakest.topic} mavzusini mustahkamlang`
    : "Keyingi testda natijangizni yanada oshiring";

  return (
    <div className="min-h-screen pb-44 animate__animated animate__fadeIn">
      {/* ── SARLAVHA — "NATIJA TAYYOR" ────── */}
      {/* ⚠️ YOPISHQOQ: uzun sahifada (40 ta savol) pastga tushgan o'quvchi
          qaysi test natijasini ko'rayotganini va hisobotni qayerdan
          olishini yo'qotmasligi kerak. */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="container flex items-center gap-3 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Orqaga"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
          </button>

          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <BookOpen size={17} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              Natija tayyor
            </p>
            <p className="truncate text-xs text-gray-400">{subjectLabel}</p>
          </div>

          <button
            type="button"
            onClick={exportResult}
            disabled={exporting}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            {exporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span className="hidden xs:inline">Hisobotni yuklab olish</span>
            <span className="xs:hidden">Hisobot</span>
          </button>
        </div>
      </header>

      <div className="container space-y-4 pt-4">
        {/* ── BALL ────────────────────────── */}
        <Card>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            {/* ⚠️ Halqa ichida FOIZ va DARAJA — bitta qarashda ikkalasi.
                Ilgari ostida "foiz" so'zi turardi: u raqamning o'zidan
                ko'rinib turadi, daraja esa yo'q edi. */}
            <ScoreRing
              value={attempt.score ?? 0}
              size={148}
              color={scoreColor(attempt.score)}
            >
              <span className="text-4xl font-bold tabular-nums text-gray-900">
                {attempt.score != null ? Math.round(attempt.score) : "—"}
                <span className="text-lg text-gray-400">%</span>
              </span>
              {attempt.grade && (
                <span
                  className="text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: scoreColor(attempt.score) }}
                >
                  {GRADE_LABELS[attempt.grade]}
                </span>
              )}
            </ScoreRing>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              {attempt.grade && (
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                    GRADE_BADGE[attempt.grade],
                  )}
                >
                  {GRADE_LABELS[attempt.grade]} daraja
                </span>
              )}

              <p className="mt-2 text-lg font-bold leading-snug text-gray-900">
                Natijangiz{" "}
                <span style={{ color: scoreColor(attempt.score) }}>
                  {attempt.score != null ? `${Math.round(attempt.score)}%` : "—"}
                </span>
                {" — "}
                {subjectLabel}
              </p>

              {/* ⚠️ "Eng kuchli / Yaxshilash kerak" — bitta jumlada ikkala
                  yo'nalish: faqat kamchilikni ko'rsatish o'quvchini
                  ruhlantirmaydi, faqat kuchli tomonni ko'rsatish esa
                  nima qilishni aytmaydi. */}
              {(strongest?.topic || weakest?.topic) && (
                <p className="mt-1 text-sm text-gray-500">
                  {strongest?.topic && `Eng kuchli: ${strongest.topic}.`}
                  {weakest?.topic && ` Yaxshilash kerak: ${weakest.topic}.`}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-400">
                {attempt.testTitle || "Mustaqil mashq"}
                {attempt.submittedAt && ` · ${formatDateUz(attempt.submittedAt)}`}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Metric
              icon={CheckCircle2}
              tone="text-emerald-600"
              label="To'g'ri"
              value={`${attempt.correctCount ?? 0}/${
                attempt.gradedQuestions ?? attempt.totalQuestions ?? 0
              }`}
            />
            <Metric
              icon={Target}
              tone="text-blue-600"
              label="Aniqlik"
              value={attempt.accuracy != null ? `${Math.round(attempt.accuracy)}%` : "—"}
            />
            <Metric
              icon={Clock}
              tone="text-gray-700"
              label="Vaqt"
              value={formatClockUz(attempt.timeSpentSec)}
            />
          </div>

          {attempt.confidence?.margin > 0 && (
            <p className="mt-3 text-center text-xs text-gray-400">
              Ishonch oralig'i: {attempt.confidence.low}% — {attempt.confidence.high}%
              ({attempt.totalQuestions} savol asosida)
            </p>
          )}
        </Card>

        {/* ── FANLAR KESIMI ───────────────── */}
        <SubjectBars subjects={subjects} />

        {/* ── 3 TA ASOSIY TOPILMA ─────────── */}
        <FindingCards findings={findings} />

        {/* ── MAVZULAR KESIMI ─────────────── */}
        <Card>
          <SectionHeader
            icon={LayoutGrid}
            title="Mavzular kesimi"
            subtitle="Har mavzu bo'yicha aniqlik"
          />

          {breakdown.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              Bu testda mavzu bo'yicha kesim yo'q.
            </p>
          ) : (
            <div className="mt-4 space-y-3.5">
              {breakdown.map((topic) => (
                <div key={topic.topicId ?? topic.topic}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-medium text-gray-900">
                      {topic.topic}
                    </span>
                    <span
                      className="shrink-0 font-semibold tabular-nums"
                      style={{ color: TONES[toneOf(topic.score)].color }}
                    >
                      {topic.score}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
                      style={{
                        width: `${topic.score}%`,
                        backgroundColor: TONES[toneOf(topic.score)].color,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {topic.questions} savol · {TONES[toneOf(topic.score)].label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── AI MENTOR IZOHI ─────────────── */}
        {/* ⚠️ Matn FONDA tayyorlanadi — sahifa uni KUTMAYDI: ball va
            kesimlar qoidalar bilan darhol chiziladi, AI izohi tayyor
            bo'lgach shu yerga o'zi qo'shiladi. */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 xs:p-5">
          <SectionHeader icon={Sparkles} title="AI Mentor izohi" />

          {!feedback ? (
            <p className="mt-3 text-sm text-gray-500">
              Bu urinish uchun AI izohi tayyorlanmagan. Savollar tahlilida har
              bir savol bo'yicha AI tushuntirishini olishingiz mumkin.
            </p>
          ) : feedback.status !== "done" ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              {feedback.status === "failed" ? (
                "AI izohi tayyorlanmadi — birozdan keyin qayta oching."
              ) : (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  AI izohi tayyorlanmoqda…
                </>
              )}
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm leading-relaxed text-gray-700">
                {feedback.output.summary}
              </p>

              {feedback.output.weaknesses?.length > 0 && (
                <div className="space-y-2">
                  {feedback.output.weaknesses.map((item, i) => (
                    <div key={i} className="rounded-xl bg-white p-3">
                      <p className="text-sm font-medium text-rose-700">{item.title}</p>
                      <p className="mt-0.5 text-sm text-gray-600">{item.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {feedback.output.strengths?.length > 0 && (
                <div className="space-y-2">
                  {feedback.output.strengths.map((item, i) => (
                    <div key={i} className="rounded-xl bg-white p-3">
                      <p className="text-sm font-medium text-emerald-700">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-600">{item.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── XATO TAHLILI ────────────────── */}
        <ErrorPatternCard patterns={errors} />

        {/* ── YOPISH KERAK BO'LGAN MAVZULAR ─ */}
        <GapCards gaps={gaps} />

        {/* ── SHAXSIY O'QUV YO'LI ─────────── */}
        <RoadmapTimeline roadmap={roadmap} curve={curve} />

        {/* ── BUGUNGI REJA ────────────────── */}
        {planInsight?.status === "done" && planInsight.output?.items?.length > 0 && (
          <Card>
            <SectionHeader
              icon={Lightbulb}
              tone="amber"
              title={planInsight.output.title}
              subtitle={`~${planInsight.output.totalMinutes} daqiqa`}
            />

            <div className="mt-4 space-y-2">
              {planInsight.output.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-gray-500">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    {item.detail && (
                      <p className="text-sm text-gray-500">{item.detail}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {item.minutes} daq.
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── SAVOLLAR TAHLILI ────────────── */}
        <Card>
          <SectionHeader
            icon={ListChecks}
            title="Savollar tahlili"
            subtitle={
              showAnswers
                ? "Savolni bosing — AI tushuntiradi"
                : "O'qituvchi javoblarni yashirgan"
            }
          />

          <div className="mt-4 space-y-2.5">
            {questions.map((question, index) => (
              <QuestionRow
                key={question.id}
                index={index}
                question={question}
                attemptId={attemptId}
                showAnswers={showAnswers}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* ── PASTKI PANEL: EXCEL + FAOL TESTLAR ── */}
      {/* ⚠️ YOPISHQOQ va sahifaning OXIRGI QADAMI. Natijani ko'rgan
          o'quvchiga ikki narsa kerak: natijani saqlab olish va keyingi
          testga o'tish — ular sahifaning qayerida bo'lmasin qo'l ostida.
          Shu panel bor ekan, bu sahifada ilova pastki navbari
          ko'rsatilmaydi: ikkita pastki panel ekranning uchdan birini
          yeb qo'yardi (orqaga qaytish — tepadagi sarlavhada). */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white/95 backdrop-blur">
        <div className="container flex items-center gap-3 py-3">
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-sm font-semibold text-gray-900">
              Natijani yuklab oling yoki keyingi testni ishlang
            </p>
            <p className="truncate text-xs text-gray-400">{nextStep}</p>
          </div>

          <button
            type="button"
            onClick={exportResult}
            disabled={exporting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:flex-none"
          >
            {exporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Excelga
          </button>

          <button
            type="button"
            onClick={() => navigate("/tests/diagnostics")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:flex-none"
          >
            Faol testlar
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ⚠️ Ikonka PARAMETRDA emas, TANADA nomlanadi. Bu paneldagi eslint
 * sozlamasi JSX ichidagi foydalanishni ko'rmaydi (`react` plagini yo'q)
 * va `no-unused-vars` faqat O'ZGARUVCHILAR uchun `^[A-Z_]` naqshini
 * hisobga oladi — funksiya argumenti uchun emas.
 */
const Metric = ({ icon, tone = "text-gray-500", label, value }) => {
  const Icon = icon;

  return (
    <div className="rounded-xl border border-gray-100 bg-slate-50 p-3">
      <Icon size={16} className={tone} strokeWidth={1.75} />
      <p className="mt-2 text-base font-bold tabular-nums text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-400">{label}</p>
    </div>
  );
};

/**
 * Bitta savol qatori — ochilganda AI izohi so'raladi (bir marta).
 *
 * ⚠️ IZOH FAQAT OCHILGANDA SO'RALADI. 40 savolli natijada hammasini
 * oldindan so'rash 40 ta model chaqiruvi bo'lardi; server javobni
 * keshlaydi, shuning uchun qayta ochishda so'rov ketmaydi.
 */
const QuestionRow = ({ question, index, attemptId, showAnswers }) => {
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const { mutate: explain, isPending } = useExplainDiagnosticAnswer();

  const answer = question.answer;
  const status = !showAnswers
    ? answer?.isSkipped
      ? "skipped"
      : "answered"
    : answer?.isSkipped
      ? "skipped"
      : answer?.isCorrect === true
        ? "correct"
        : answer?.isCorrect === false
          ? "wrong"
          : "ungraded";

  /**
   * HOLAT KO'RINISHI — bitta jadvalda: ikonka, karta rangi, belgi.
   *
   * ⚠️ MA'NO FAQAT RANG BILAN BERILMAYDI: har kartada "To'g'ri" / "Xato"
   * matnli belgisi ham turadi — rang ko'rmaydigan o'quvchi uchun.
   */
  const STATUS_VIEW = {
    correct: {
      icon: CheckCircle2,
      card: "border-emerald-200 bg-emerald-50/40",
      head: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
      label: "To'g'ri",
    },
    wrong: {
      icon: XCircle,
      card: "border-rose-200 bg-rose-50/40",
      head: "text-rose-500",
      badge: "bg-rose-100 text-rose-700",
      label: "Xato",
    },
    skipped: {
      icon: MinusCircle,
      card: "border-gray-200 bg-gray-50",
      head: "text-gray-400",
      badge: "bg-gray-200 text-gray-600",
      label: "O'tkazilgan",
    },
    answered: {
      icon: Check,
      card: "border-gray-200 bg-white",
      head: "text-blue-500",
      badge: "bg-blue-50 text-blue-700",
      label: "Javob berilgan",
    },
    ungraded: {
      icon: Circle,
      card: "border-gray-200 bg-white",
      head: "text-blue-500",
      badge: "bg-blue-50 text-blue-700",
      label: "Tekshirilmoqda",
    },
  };
  const view = STATUS_VIEW[status] || STATUS_VIEW.ungraded;
  const StatusIcon = view.icon;

  const selected = new Set(answer?.selectedOptionIds || []);

  /**
   * ⚠️ VARIANT ID SI EMAS, MATNI. Id ko'rsatilsa o'quvchi "6aa1…" degan
   * qatorni ko'rardi. Matnli javob (`short`/`essay`) bo'lsa o'sha matn
   * ishlatiladi.
   */
  const optionText = (ids) =>
    (question.options || [])
      .filter((o) => ids.has?.(o.id) ?? ids.includes(o.id))
      .map((o) => o.text)
      .filter(Boolean)
      .join(", ");

  const givenAnswer = answer?.textAnswer || optionText(selected);
  const correctAnswer = showAnswers
    ? optionText((question.options || []).filter((o) => o.isCorrect).map((o) => o.id))
    : null;

  const toggle = () => {
    const opening = !open;
    setOpen(opening);
    if (opening && !explanation && showAnswers) {
      explain(
        { attemptId, questionId: question.id },
        {
          onSuccess: (result) => setExplanation(result),
          onError: () => setExplanation({ explanation: null }),
        },
      );
    }
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border transition-colors", view.card)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-3.5 text-left"
      >
        <StatusIcon
          size={20}
          strokeWidth={2}
          className={cn("mt-0.5 shrink-0", view.head)}
        />

        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-gray-900">
          <span className="text-gray-400">{index + 1}.</span> {question.text}
        </span>

        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold",
            view.badge,
          )}
        >
          {view.label}
        </span>

        <ChevronDown
          size={16}
          className={cn(
            "mt-0.5 shrink-0 text-gray-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-black/5 px-3.5 pb-3.5 pt-3">
          {/* ⚠️ JAVOB MATN BILAN YOZILADI, faqat rang bilan emas. Ikkalasi
              bir qatorda — "men nima dedim / to'g'risi nima edi" bir
              qarashda solishtiriladi. */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <p>
              <span className="text-gray-400">Sizning javobingiz: </span>
              <span
                className={cn(
                  "font-semibold",
                  !showAnswers
                    ? "text-gray-900"
                    : status === "correct"
                      ? "text-emerald-600"
                      : "text-rose-600",
                )}
              >
                {givenAnswer || "(bo'sh)"}
              </span>
            </p>

            {showAnswers && status !== "correct" && correctAnswer && (
              <p>
                <span className="text-gray-400">To'g'ri javob: </span>
                <span className="font-semibold text-emerald-600">{correctAnswer}</span>
              </p>
            )}
          </div>

          {showAnswers && (
            <div className="rounded-xl bg-blue-50/70 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                <Sparkles size={13} />
                {/* ⚠️ SARLAVHA HOLATGA QARAB: to'g'ri javobda "nega xato
                    qildingiz" deb so'rash ma'nosiz, xatoda esa o'quvchiga
                    kerak bo'lgani — YECHIM YO'LI, ta'rif emas. */}
                {status === "correct" ? "Nega to'g'ri" : "Yechilish uslubi"}
              </div>
              {isPending ? (
                <p className="mt-1.5 flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 size={14} className="animate-spin" />
                  AI tushuntirmoqda…
                </p>
              ) : (
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  {explanation?.explanation ||
                    question.explanation ||
                    "Izoh mavjud emas."}
                </p>
              )}
            </div>
          )}

          {question.topicName && (
            <p className="text-xs text-gray-400">
              Mavzu: {question.topicName}
              {showAnswers && answer?.errorReason && ERROR_REASONS[answer.errorReason] && (
                <>
                  {" · "}
                  <span style={{ color: ERROR_REASONS[answer.errorReason].color }}>
                    {ERROR_REASONS[answer.errorReason].label}
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticResultPage;
