// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Router
import { useParams } from "react-router-dom";

// Icons
import { Check, X, Clock } from "lucide-react";

// API
import { testResultsAPI } from "@/features/grading/api/testResults.api";

// Data
import {
  RESULT_STATUS_LABELS,
  RESULT_STATUS_COLORS,
} from "@/features/grading/data/resultStatuses.data";

// Components
import Card from "@/shared/components/ui/Card";
import BackHeader from "@/shared/components/layout/BackHeader";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { formatScore } from "@/shared/utils/formatScore";

/**
 * O'quvchining bitta natijasi - javoblar va baholash yonma-yon.
 *
 * Variantli savollar uchun: tanlangan variant va to'g'ri ekanligi
 * (perQuestion.awardedPoints === maxPoints orqali) ko'rsatiladi.
 * Ochiq savollar uchun: javob matni va o'qituvchi qo'ygan ball/izoh.
 */
const ResultDetailPage = () => {
  const { id } = useParams();

  const { data: result, isLoading } = useQuery({
    queryKey: ["my-result", id],
    queryFn: () => testResultsAPI.getOne(id).then((res) => res.data.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pb-28 bg-gray-100">
        <BackHeader href="/my-results" title="Natija" />
        <div className="container pt-4">
          <Card>
            <p className="text-center text-gray-500 py-10">Yuklanmoqda...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen pb-28 bg-gray-100">
        <BackHeader href="/my-results" title="Natija" />
        <div className="container pt-4">
          <Card>
            <p className="text-center text-gray-500 py-10">Natija topilmadi</p>
          </Card>
        </div>
      </div>
    );
  }

  const session = result.session || {};
  const test = result.test || {};
  const questions = session.questions || [];
  const answers = session.answers || [];
  const perQuestionMap = new Map(
    (result.perQuestion || []).map((pq) => [pq.question.toString(), pq]),
  );
  const answerMap = new Map(answers.map((a) => [a.question.toString(), a]));

  const extraSum =
    result.extraPoints?.reduce((s, e) => s + (e.amount || 0), 0) || 0;

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/my-results" title={test.title || "Test natijasi"} />

      <div className="container pt-4 space-y-4">
      {/* Holat */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "px-2 py-0.5 rounded-md text-xs font-medium",
            RESULT_STATUS_COLORS[result.status] || "bg-gray-100",
          )}
        >
          {RESULT_STATUS_LABELS[result.status]}
        </span>
        {session.submittedAt && (
          <span className="text-xs text-gray-500">
            Topshirilgan: {formatDateUZ(session.submittedAt)}
          </span>
        )}
      </div>

      {/* Ball xulosa */}
      <Card>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatBox
            label="Yakuniy ball"
            value={`${formatScore(result.finalScore)} / ${
              result.maxScore != null ? formatScore(result.maxScore) : "-"
            }`}
            highlight
          />
          <StatBox
            label="Avtomatik baholangan javoblar"
            value={formatScore(result.autoGradedScore)}
          />
          <StatBox
            label="Qo'lda baholangan javoblar"
            value={formatScore(result.manualGradedScore)}
          />
          <StatBox label="Qo'shimcha baholangan" value={formatScore(extraSum)} />
        </div>
        {result.status === "pending" && (
          <div className="mt-4 flex items-center gap-2 text-sm text-amber-700">
            <Clock size={16} />
            Ochiq savollar o'qituvchi tomonidan baholanmoqda. Yakuniy ball
            o'zgarishi mumkin.
          </div>
        )}
        {result.status !== "pending" && result.gradingMin != null && (
          <div className="mt-4">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                result.passed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              {result.passed ? "O'tdi" : "O'tmadi"} (o'tish bali:{" "}
              {formatScore(result.gradingMin)})
            </span>
          </div>
        )}
      </Card>

      {/* Qo'shimcha ballar */}
      {result.extraPoints?.length > 0 && (
        <Card title="Qo'shimcha ballar">
          <div className="space-y-2 mt-3">
            {result.extraPoints.map((ep, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50"
              >
                <div>
                  <p className="text-sm text-gray-900">{ep.reason}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDateUZ(ep.addedAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-semibold shrink-0",
                    ep.amount >= 0 ? "text-green-700" : "text-red-700",
                  )}
                >
                  {ep.amount >= 0 ? "+" : ""}
                  {ep.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Savollar va javoblar */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Savollar va javoblaringiz
        </h2>
        {questions.map((q, idx) => {
          const pq = perQuestionMap.get(q.question.toString());
          const answer = answerMap.get(q.question.toString());
          return (
            <QAReviewCard
              key={idx}
              index={idx + 1}
              question={q}
              answer={answer}
              perQuestion={pq}
            />
          );
        })}
      </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, highlight = false }) => (
  <div
    className={cn(
      "p-3 rounded-xl text-center",
      highlight ? "bg-blue-50 text-blue-900" : "bg-gray-50 text-gray-900",
    )}
  >
    <p className="text-xs text-gray-600">{label}</p>
    <p className="font-bold mt-1">{value}</p>
  </div>
);

/**
 * Bitta savol + o'quvchi javobi + baholash natijasi (faqat o'qish uchun).
 *
 * Variantli savol uchun: o'quvchi tanlovi to'g'rimi/noto'g'rimi
 * `perQuestion.awardedPoints === maxPoints` orqali aniqlanadi.
 * Server `correctOptionId` ni qaytarmaydi, shuning uchun "to'g'ri javob qaysi"
 * ko'rsatilmaydi - bu maxsus qaror: o'quvchi to'g'ri javobni keyingi qaytadan
 * topshirishida ko'rmaslik uchun.
 */
const QAReviewCard = ({ index, question, answer, perQuestion }) => {
  const isStandard = question.type === "standard";
  const awarded = perQuestion?.awardedPoints ?? 0;
  const maxPoints = perQuestion?.maxPoints ?? question.points;
  const isFullyCorrect = isStandard && awarded === maxPoints;
  const isPending = perQuestion?.status === "pending";

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-500">
              {index}.
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              {isStandard ? "Variantli" : "Ochiq"}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-xs font-medium",
                isPending
                  ? "bg-yellow-100 text-yellow-700"
                  : isFullyCorrect
                    ? "bg-green-100 text-green-700"
                    : awarded > 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700",
              )}
            >
              {isPending
                ? "Baholanmoqda"
                : `${formatScore(awarded)} / ${formatScore(maxPoints)} ball`}
            </span>
          </div>

          <div className="flex items-start gap-3">
            {question.image?.url && (
              <img
                src={question.image.url}
                alt="Savol rasmi"
                className="size-24 rounded-lg object-cover border shrink-0"
              />
            )}
            <p className="text-gray-900 break-words">
              {question.text || (
                <span className="text-gray-400">(rasmli savol)</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Variantli - tanlangan variant ko'rsatiladi */}
      {isStandard && (
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isSelected =
              answer?.selectedOptionId?.toString() ===
              opt.optionId?.toString();
            return (
              <div
                key={opt.optionId}
                className={cn(
                  "flex items-start gap-2 p-2.5 rounded-lg border",
                  isSelected
                    ? isFullyCorrect
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                    : "border-gray-200 bg-white",
                )}
              >
                <div
                  className={cn(
                    "size-6 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-medium",
                    isSelected
                      ? isFullyCorrect
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-red-500 bg-red-500 text-white"
                      : "border-gray-300 text-gray-500",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <div className="flex-1 flex items-start gap-2">
                  {opt.image?.url && (
                    <img
                      src={opt.image.url}
                      alt="Variant rasmi"
                      className="size-16 rounded object-cover border shrink-0"
                    />
                  )}
                  {opt.text && (
                    <p className="text-sm text-gray-900 break-words">
                      {opt.text}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <span className="shrink-0">
                    {isFullyCorrect ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <X size={18} className="text-red-600" />
                    )}
                  </span>
                )}
              </div>
            );
          })}
          {!answer?.selectedOptionId && (
            <p className="text-xs text-gray-500">Variant tanlanmagan</p>
          )}
        </div>
      )}

      {/* Ochiq - javob matni va o'qituvchi izohi */}
      {!isStandard && (
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">Sizning javobingiz:</p>
            <p className="text-gray-900 whitespace-pre-wrap break-words">
              {answer?.textAnswer || (
                <span className="text-gray-400">(javob yo'q)</span>
              )}
            </p>
          </div>
          {perQuestion?.feedback && (
            <div className="p-3 rounded-lg bg-blue-50">
              <p className="text-xs text-blue-700 mb-1">O'qituvchi izohi:</p>
              <p className="text-gray-900 whitespace-pre-wrap break-words">
                {perQuestion.feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ResultDetailPage;
