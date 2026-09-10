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
  Check,
  X,
  MinusCircle,
  Circle,
  ChevronDown,
  Sparkles,
  Loader2,
  Lightbulb,
  Timer,
  Target,
  Download,
} from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";
import ScoreRing from "../components/ScoreRing";
import FindingCards from "../components/FindingCards";
import SubjectBars from "../components/SubjectBars";
import ErrorPatternCard from "../components/ErrorPatternCard";
import GapCards from "../components/GapCards";
import RoadmapTimeline from "../components/RoadmapTimeline";

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
import { formatDateUz, formatDurationShortUz } from "@/shared/utils/date.utils";
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

  return (
    <div className="min-h-screen pb-40 animate__animated animate__fadeIn">
      <div className="container space-y-4 pt-4">
        <button
          type="button"
          onClick={() => navigate("/tests/diagnostics")}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500"
        >
          <ArrowLeft size={16} />
          Diagnostikaga qaytish
        </button>

        {/* ── BALL ────────────────────────── */}
        <Card>
          <div className="flex flex-col items-center gap-3 py-2">
            <ScoreRing
              value={attempt.score ?? 0}
              size={150}
              color={scoreColor(attempt.score)}
            >
              <span className="text-3xl font-bold tabular-nums text-gray-900">
                {attempt.score != null ? Math.round(attempt.score) : "—"}
              </span>
              <span className="text-xs text-gray-400">foiz</span>
            </ScoreRing>

            {attempt.grade && (
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-semibold",
                  GRADE_BADGE[attempt.grade],
                )}
              >
                {GRADE_LABELS[attempt.grade]}
              </span>
            )}

            <p className="text-center text-lg font-bold leading-snug text-gray-900">
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
              <p className="max-w-md text-center text-sm text-gray-500">
                {strongest?.topic && `Eng kuchli: ${strongest.topic}.`}
                {weakest?.topic && ` Yaxshilash kerak: ${weakest.topic}.`}
              </p>
            )}

            <p className="text-center text-xs text-gray-400">
              {attempt.testTitle || "Mustaqil mashq"}
              {attempt.submittedAt && ` · ${formatDateUz(attempt.submittedAt)}`}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Metric
              icon={Check}
              label="To'g'ri"
              value={`${attempt.correctCount ?? 0}/${
                attempt.gradedQuestions ?? attempt.totalQuestions ?? 0
              }`}
            />
            <Metric
              icon={Target}
              label="Aniqlik"
              value={attempt.accuracy != null ? `${Math.round(attempt.accuracy)}%` : "—"}
            />
            <Metric
              icon={Timer}
              label="Vaqt"
              value={formatDurationShortUz(
                Math.round((attempt.timeSpentSec ?? 0) / 60),
                "—",
              )}
            />
          </div>

          {attempt.confidence?.margin > 0 && (
            <p className="mt-3 text-center text-xs text-gray-400">
              Ishonch oralig'i: {attempt.confidence.low}% — {attempt.confidence.high}%
              ({attempt.totalQuestions} savol asosida)
            </p>
          )}

          <Button
            variant="outline"
            className="mt-4 w-full"
            disabled={exporting}
            onClick={exportResult}
          >
            {exporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Hisobotni yuklab olish
          </Button>
        </Card>

        {/* ── 3 TA ASOSIY TOPILMA ─────────── */}
        <FindingCards findings={findings} />

        {/* ── FANLAR KESIMI ───────────────── */}
        <SubjectBars subjects={subjects} />

        {/* ── AI TAHLILI ──────────────────── */}
        <Card>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Tahlil</h2>
          </div>

          {!feedback ? (
            <p className="py-6 text-center text-sm text-gray-500">
              Bu urinish uchun tahlil tayyorlanmagan.
            </p>
          ) : feedback.status !== "done" ? (
            <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              {feedback.status === "failed"
                ? "Tahlil tayyorlanmadi"
                : "Tahlil tayyorlanmoqda…"}
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm leading-relaxed text-gray-700">
                {feedback.output.summary}
              </p>

              {feedback.output.weaknesses?.length > 0 && (
                <div className="space-y-2">
                  {feedback.output.weaknesses.map((item, i) => (
                    <div key={i} className="rounded-xl bg-rose-50 p-3">
                      <p className="text-sm font-medium text-rose-700">{item.title}</p>
                      <p className="mt-0.5 text-sm text-gray-600">{item.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {feedback.output.strengths?.length > 0 && (
                <div className="space-y-2">
                  {feedback.output.strengths.map((item, i) => (
                    <div key={i} className="rounded-xl bg-emerald-50 p-3">
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
        </Card>

        {/* ── MAVZULAR ────────────────────── */}
        {breakdown.length > 0 && (
          <Card>
            <h2 className="font-semibold text-gray-900">Mavzular bo'yicha</h2>
            <div className="mt-3 space-y-3">
              {breakdown.map((topic) => (
                <div key={topic.topicId ?? topic.topic}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate text-gray-700">{topic.topic}</span>
                    <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                      {topic.score}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
                      style={{
                        width: `${topic.score}%`,
                        backgroundColor: TONES[toneOf(topic.score)].color,
                      }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {TONES[toneOf(topic.score)].label} · {topic.correct}/
                    {topic.questions} to'g'ri
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── XATO TAHLILI ────────────────── */}
        <ErrorPatternCard patterns={errors} />

        {/* ── YOPISH KERAK BO'LGAN MAVZULAR ─ */}
        <GapCards gaps={gaps} />

        {/* ── SHAXSIY O'QUV YO'LI ─────────── */}
        <RoadmapTimeline roadmap={roadmap} curve={curve} />

        {/* ── BUGUNGI REJA ────────────────── */}
        {planInsight?.status === "done" && planInsight.output?.items?.length > 0 && (
          <Card>
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" />
              <h2 className="font-semibold text-gray-900">
                {planInsight.output.title}
              </h2>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              ~{planInsight.output.totalMinutes} daqiqa
            </p>

            <div className="mt-3 space-y-2">
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

        {/* ── SAVOLLAR ────────────────────── */}
        <Card className="!p-0">
          <div className="p-4 xs:p-5">
            <h2 className="font-semibold text-gray-900">Savollar tahlili</h2>
            {showAnswers && (
              <p className="mt-0.5 text-sm text-gray-500">
                Savolni bosing — AI tushuntiradi
              </p>
            )}
          </div>

          <div className="divide-y divide-gray-100 border-t border-gray-100">
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

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/tests/diagnostics")}
        >
          Diagnostikaga qaytish
        </Button>
      </div>

      <BottomNavbar />
    </div>
  );
};

/**
 * ⚠️ Ikonka PARAMETRDA emas, TANADA nomlanadi. Bu paneldagi eslint
 * sozlamasi JSX ichidagi foydalanishni ko'rmaydi (`react` plagini yo'q)
 * va `no-unused-vars` faqat O'ZGARUVCHILAR uchun `^[A-Z_]` naqshini
 * hisobga oladi — funksiya argumenti uchun emas.
 */
const Metric = ({ icon, label, value }) => {
  const Icon = icon;

  return (
    <div className="rounded-xl bg-gray-50 p-2.5 text-center">
      <Icon size={14} className="mx-auto text-gray-400" />
      <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900">{value}</p>
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

  const StatusIcon =
    status === "correct"
      ? Check
      : status === "skipped"
        ? MinusCircle
        : status === "wrong"
          ? X
          : Circle;

  const statusColor =
    status === "correct"
      ? "bg-emerald-50 text-emerald-600"
      : status === "skipped"
        ? "bg-gray-100 text-gray-400"
        : status === "wrong"
          ? "bg-rose-50 text-rose-600"
          : "bg-blue-50 text-blue-600";

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
    <div>
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-start gap-3 p-4 text-left xs:px-5"
      >
        <span
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
            statusColor,
          )}
        >
          <StatusIcon size={14} strokeWidth={2.5} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 block text-sm text-gray-900">
            {index + 1}. {question.text}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            {question.topicName && <span>{question.topicName}</span>}
            {showAnswers && answer?.errorReason && (
              <span style={{ color: ERROR_REASONS[answer.errorReason]?.color }}>
                {ERROR_REASONS[answer.errorReason]?.label}
              </span>
            )}
          </span>
        </span>

        <ChevronDown
          size={16}
          className={cn(
            "mt-0.5 shrink-0 text-gray-300 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="space-y-3 bg-gray-50 px-4 pb-4 xs:px-5">
          {question.options?.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {question.options.map((option) => {
                const isSelected = selected.has(option.id);
                const isCorrect = option.isCorrect;

                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                      showAnswers && isCorrect
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                        : isSelected
                          ? "border-blue-300 bg-blue-50 text-blue-900"
                          : "border-gray-200 bg-white text-gray-600",
                    )}
                  >
                    <span className="min-w-0 flex-1 break-words">{option.text}</span>
                    {isSelected && (
                      <span className="shrink-0 rounded-full bg-white/70 px-1.5 py-0.5 text-[11px] font-medium">
                        Siz
                      </span>
                    )}
                    {showAnswers && isCorrect && (
                      <Check size={14} className="shrink-0" strokeWidth={2.5} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ⚠️ JAVOB MATN BILAN HAM YOZILADI, faqat rang bilan emas:
              variantlar ro'yxatidagi ramka rang ko'rmaydigan o'quvchi
              uchun hech narsa anglatmaydi. */}
          <p className="text-sm text-gray-700">
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
            <p className="text-sm text-gray-700">
              <span className="text-gray-400">To'g'ri javob: </span>
              <span className="font-semibold text-emerald-600">{correctAnswer}</span>
            </p>
          )}

          {showAnswers && (
            <div className="rounded-xl bg-white p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600">
                <Sparkles size={13} />
                {/* ⚠️ SARLAVHA HOLATGA QARAB: to'g'ri javobda "nega xato
                    qildingiz" deb so'rash ma'nosiz, xatoda esa o'quvchiga
                    kerak bo'lgani — YECHIM YO'LI, ta'rif emas. */}
                {status === "correct" ? "Nega to'g'ri" : "Yechilish uslubi"}
              </div>
              {isPending ? (
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 size={13} className="animate-spin" />
                  Tayyorlanmoqda…
                </p>
              ) : (
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {explanation?.explanation ||
                    question.explanation ||
                    "Izoh mavjud emas."}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticResultPage;
