// React
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  CheckCircle2,
  Loader2,
  AlertCircle,
  Brain,
} from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import DiagnosticTimer from "../components/DiagnosticTimer";
import DiagnosticQuestionCard from "../components/DiagnosticQuestionCard";

// Queries
import { diagnosticsQueries } from "../queries/diagnostics.queries";
import {
  useSaveDiagnosticAnswer,
  useSubmitDiagnostic,
} from "../queries/diagnostics.mutations";

// Data
import { SUBMIT_CONFIRM } from "../data/diagnostics.data";

// Utils
import { cn } from "@/shared/utils/cn";

/**
 * DIAGNOSTIKA TESTINI TOPSHIRISH — yuklash va holat qobig'i.
 *
 * ⚠️ HAQIQIY YURITGICH ALOHIDA KOMPONENT (`Runner`) va u `key={attempt.id}`
 * bilan chiziladi. Sabab: yurituvchining butun holati (savollar, javoblar,
 * vaqt sanoqchisi) urinishdan KELIB CHIQADI. Uni bitta komponentda
 * `useEffect` bilan to'ldirsak, React qoidasi buzilardi (effekt ichida
 * `setState` — kaskad render) yoki render paytida ref o'zgartirilardi.
 * `key` esa urinish almashganda komponentni butunlay qayta yaratadi va
 * holat boshlang'ich qiymatlar bilan bir marta o'rnatiladi.
 */
const TakeDiagnosticPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const { data: attempt, isLoading, error } = useQuery(
    diagnosticsQueries.active(attemptId),
  );

  if (isLoading) {
    return (
      <div className="container pt-4">
        <Card>
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span>Test yuklanmoqda…</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="container pt-4">
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle size={40} className="text-red-400" />
            <p className="font-medium text-gray-900">
              {error?.response?.data?.message || "Test topilmadi"}
            </p>
            <Button variant="outline" onClick={() => navigate("/tests/diagnostics")}>
              Orqaga
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (attempt.status !== "in_progress") {
    return (
      <div className="container pt-4">
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 size={40} className="text-emerald-500" />
            <p className="font-medium text-gray-900">Bu urinish yakunlangan</p>
            <Button onClick={() => navigate(`/diagnostics/result/${attemptId}`)}>
              Natijani ko'rish
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <Runner key={attempt.id} attempt={attempt} attemptId={attemptId} />;
};

/** Saqlangan javoblarni forma holatiga tiklaydi (sahifa qayta yuklansa ham ish yo'qolmaydi). */
const restoreAnswers = (attempt) => {
  const restored = {};
  for (const question of attempt.questions || []) {
    if (!question.answer) continue;
    restored[question.id] = {
      selectedOptionIds: question.answer.selectedOptionIds || [],
      textAnswer: question.answer.textAnswer || "",
    };
  }
  return restored;
};

/** Javob berilmagan birinchi savol — o'quvchi to'xtagan joydan davom etadi. */
const firstUnanswered = (attempt) => {
  const at = (attempt.questions || []).findIndex((q) => !q.answer);
  return at === -1 ? 0 : at;
};

/**
 * TEST YURITGICHI.
 *
 * ⚠️ IKKI REJIM, BITTA EKRAN:
 *   - ODDIY: savollar boshidayoq muhrlangan, o'quvchi orasida yura oladi;
 *   - ADAPTIV: savol BITTALAB keladi, javob serverga ketgach keyingisi
 *     javobning O'ZIDA qaytadi va ORQAGA QAYTIB BO'LMAYDI (javob keyingi
 *     savolning qiyinligini belgilagan — uni o'zgartirish tanlovni
 *     ma'nosiz qilardi).
 *
 * ⚠️ HAR SAVOLGA KETGAN VAQT VA JAVOBNI O'ZGARTIRISH SONI YIG'ILADI.
 * Bularsiz server "nega xato qilindi" degan savolga javob bera olmaydi
 * (shoshildimi, bilmaydimi, savolni noto'g'ri tushundimi) — bu esa
 * modulning eng qimmatli natijasi. Aynan shuning uchun savollar
 * birma-bir ko'rsatiladi.
 */
const Runner = ({ attempt, attemptId }) => {
  const navigate = useNavigate();
  const saveAnswer = useSaveDiagnosticAnswer();
  const submitAttempt = useSubmitDiagnostic();

  const isAdaptive = attempt.adaptive;

  const [questions, setQuestions] = useState(() => attempt.questions || []);
  const [answers, setAnswers] = useState(() => restoreAnswers(attempt));
  const [index, setIndex] = useState(() => firstUnanswered(attempt));
  const [adaptiveDone, setAdaptiveDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ⚠️ Ikki marta topshirilmasligi uchun: taymer tugashi va tugma bosilishi
  // bir vaqtda kelishi mumkin.
  const submittedRef = useRef(false);

  // Joriy savol ekranda qachon ochilgani. `Date.now()` render paytida
  // chaqirilmaydi — sanoqchi mount effektida boshlanadi.
  const shownAtRef = useRef(0);
  // Har savol uchun yig'ilgan vaqt va o'zgartirishlar soni.
  const telemetryRef = useRef({});

  useEffect(() => {
    shownAtRef.current = Date.now();
  }, []);

  const current = questions[index] || null;

  const answeredCount = useMemo(
    () =>
      Object.values(answers).filter(
        (a) => a.selectedOptionIds?.length || (a.textAnswer || "").trim(),
      ).length,
    [answers],
  );

  /**
   * Telemetriyani yangilaydi.
   *
   * ⚠️ MAVJUD OBYEKT O'ZGARTIRILMAYDI, YANGISI QO'YILADI. React'ning
   * o'zgarmaslik qoidasi ref ichidagi ichki obyektni joyida o'zgartirishga
   * yo'l qo'ymaydi — kompilyator uni kuzata olmaydi va natija
   * bashoratsiz bo'lardi.
   */
  const bumpTelemetry = useCallback((questionId, patch) => {
    if (!questionId) return;
    const prev = telemetryRef.current[questionId] || {
      timeSpentSec: 0,
      changeCount: 0,
    };
    telemetryRef.current = {
      ...telemetryRef.current,
      [questionId]: { ...prev, ...patch(prev) },
    };
  }, []);

  /** Joriy savolda o'tkazilgan vaqtni yig'adi va sanoqchini qayta boshlaydi. */
  const flushTime = useCallback(
    (questionId) => {
      if (!questionId || !shownAtRef.current) return;
      const spent = Math.round((Date.now() - shownAtRef.current) / 1000);
      bumpTelemetry(questionId, (prev) => ({
        timeSpentSec: prev.timeSpentSec + Math.max(0, Math.min(3600, spent)),
      }));
      shownAtRef.current = Date.now();
    },
    [bumpTelemetry],
  );

  /** Javobni serverga yuboradi (adaptivda keyingi savolni ham oladi). */
  const persist = useCallback(
    (question, payload, { advance = false } = {}) => {
      flushTime(question.id);
      const telemetry = telemetryRef.current[question.id] || {};

      return new Promise((resolve) => {
        saveAnswer.mutate(
          {
            attemptId,
            questionId: question.id,
            data: {
              ...payload,
              timeSpentSec: telemetry.timeSpentSec ?? 0,
              changeCount: telemetry.changeCount ?? 0,
            },
          },
          {
            onSuccess: (result) => {
              if (advance && isAdaptive) {
                if (result?.nextQuestion) {
                  setQuestions((prev) => [...prev, result.nextQuestion]);
                  setIndex((prev) => prev + 1);
                  shownAtRef.current = Date.now();
                } else if (result?.done) {
                  setAdaptiveDone(true);
                }
              }
              resolve(result);
            },
            onError: (err) => {
              const message = err.response?.data?.message || "Javob saqlanmadi";
              toast.error(message);
              // Vaqt tugagan bo'lsa natijaga o'tamiz — bu yerda turishning
              // ma'nosi yo'q.
              if (/vaqt|yakunlangan/i.test(message)) {
                navigate(`/diagnostics/result/${attemptId}`, { replace: true });
              }
              resolve(null);
            },
          },
        );
      });
    },
    [attemptId, flushTime, isAdaptive, navigate, saveAnswer],
  );

  const handleSelect = useCallback(
    (optionId) => {
      if (!current) return;
      const prev = answers[current.id]?.selectedOptionIds || [];
      const isMultiple = current.type === "multiple";

      const next = isMultiple
        ? prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
        : [optionId];

      // ⚠️ O'ZGARTIRISH SONI — faqat HAQIQIY fikr o'zgarganda. Birinchi
      // tanlov o'zgartirish emas; usiz har javob "ikkilanish" deb
      // belgilanib, xato sababi doim "noto'g'ri tushunish" chiqardi.
      if (prev.length > 0) {
        bumpTelemetry(current.id, (t) => ({ changeCount: t.changeCount + 1 }));
      }

      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [current.id]: { ...prevAnswers[current.id], selectedOptionIds: next },
      }));

      // Bitta javobli savolda tanlov = keyingi qadam (adaptivda).
      if (!isMultiple) {
        persist(current, { selectedOptionIds: next }, { advance: true });
      }
    },
    [answers, bumpTelemetry, current, persist],
  );

  const handleText = useCallback(
    (value) => {
      if (!current) return;
      setAnswers((prev) => ({
        ...prev,
        [current.id]: { ...prev[current.id], textAnswer: value },
      }));
    },
    [current],
  );

  /** Oldinga o'tish — javobni saqlab. */
  const goNext = useCallback(async () => {
    if (!current) return;
    const answer = answers[current.id] || {};
    await persist(
      current,
      {
        selectedOptionIds: answer.selectedOptionIds || [],
        textAnswer: answer.textAnswer || null,
      },
      { advance: isAdaptive },
    );
    if (!isAdaptive) {
      setIndex((prev) => Math.min(prev + 1, questions.length - 1));
      shownAtRef.current = Date.now();
    }
  }, [answers, current, isAdaptive, persist, questions.length]);

  const goPrev = useCallback(() => {
    if (isAdaptive || index === 0) return;
    flushTime(current?.id);
    setIndex((prev) => Math.max(0, prev - 1));
  }, [current, flushTime, index, isAdaptive]);

  const finish = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    // Oxirgi savolda o'tkazilgan vaqt ham hisobga olinsin.
    if (current) flushTime(current.id);

    const payload = {
      timeSpentSec: Math.round(
        (Date.now() - new Date(attempt.startedAt).getTime()) / 1000,
      ),
      // ⚠️ ODDIY REJIMDA BARCHA JAVOBLAR BIRGA YUBORILADI: avtosaqlash
      // ishlagan bo'lsa ham, oxirgi savolning javobi hali ketmagan
      // bo'lishi mumkin. Adaptivda javoblar allaqachon saqlangan.
      answers: isAdaptive
        ? []
        : questions.map((q) => ({
            attemptQuestionId: q.id,
            selectedOptionIds: answers[q.id]?.selectedOptionIds || [],
            textAnswer: answers[q.id]?.textAnswer || null,
            timeSpentSec: telemetryRef.current[q.id]?.timeSpentSec ?? 0,
            changeCount: telemetryRef.current[q.id]?.changeCount ?? 0,
          })),
    };

    submitAttempt.mutate(
      { attemptId, data: payload },
      {
        onSuccess: () => {
          toast.success("Test yakunlandi");
          navigate(`/diagnostics/result/${attemptId}`, { replace: true });
        },
        onError: (err) => {
          const message = err.response?.data?.message || "Topshirishda xatolik";
          toast.error(message);
          // Vaqt tugab urinish yopilgan bo'lsa — natija baribir bor.
          if (/vaqt/i.test(message)) {
            navigate(`/diagnostics/result/${attemptId}`, { replace: true });
            return;
          }
          submittedRef.current = false;
          setSubmitting(false);
        },
      },
    );
  }, [
    answers,
    attempt.startedAt,
    attemptId,
    current,
    flushTime,
    isAdaptive,
    navigate,
    questions,
    submitAttempt,
  ]);

  const handleExpire = useCallback(() => {
    toast.warning("Test vaqti tugadi — avtomatik yakunlanmoqda…");
    finish();
  }, [finish]);

  const isLast = !isAdaptive && index === questions.length - 1;
  const canFinish = isAdaptive ? adaptiveDone : isLast;
  const currentAnswer = answers[current?.id] || {};
  const hasAnswer =
    currentAnswer.selectedOptionIds?.length > 0 ||
    (currentAnswer.textAnswer || "").trim().length > 0;

  const progress = isAdaptive
    ? Math.min(100, Math.round((questions.length / (attempt.maxQuestions || 20)) * 100))
    : Math.round(((index + 1) / Math.max(1, questions.length)) * 100);

  return (
    <div className="min-h-screen pb-40">
      {/* Yuqori qator: progress + taymer */}
      <div className="sticky inset-x-0 top-0 z-10 bg-white pb-2 pt-2 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <div className="container space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">
                {attempt.testTitle || "Diagnostika"}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                {isAdaptive ? (
                  <>
                    <Brain size={12} />
                    Adaptiv · {questions.length} ta savol berildi
                  </>
                ) : (
                  <>
                    Javob berilgan: {answeredCount} / {questions.length}
                  </>
                )}
                {saveAnswer.isPending && (
                  <span className="inline-flex items-center gap-1 text-blue-600">
                    <Loader2 size={11} className="animate-spin" />
                    saqlanmoqda
                  </span>
                )}
              </p>
            </div>

            {attempt.expiresAt && (
              <DiagnosticTimer expiresAt={attempt.expiresAt} onExpire={handleExpire} />
            )}
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Savol */}
      <div className="container pt-4">
        {adaptiveDone ? (
          <Card>
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 size={40} className="text-emerald-500" />
              <p className="font-medium text-gray-900">Darajangiz aniqlandi</p>
              <p className="max-w-sm text-sm text-gray-500">
                {questions.length} ta savol yetarli bo'ldi — natija endi
                yetarlicha aniq. Testni yakunlashingiz mumkin.
              </p>
            </div>
          </Card>
        ) : current ? (
          <Card>
            <DiagnosticQuestionCard
              question={current}
              index={index}
              total={isAdaptive ? null : questions.length}
              selected={currentAnswer.selectedOptionIds || []}
              textAnswer={currentAnswer.textAnswer || ""}
              onSelect={handleSelect}
              onText={handleText}
              disabled={submitting}
            />
          </Card>
        ) : null}

        {isAdaptive && !adaptiveDone && (
          <p className="mt-3 text-center text-xs text-gray-400">
            Savollar javobingizga qarab moslashadi — orqaga qaytib bo'lmaydi.
          </p>
        )}
      </div>

      {/* Pastki boshqaruv */}
      <div className="fixed inset-x-0 bottom-0 z-10 bg-white py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="container flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={isAdaptive || index === 0 || submitting}
            className={cn(isAdaptive && "invisible")}
          >
            <ArrowLeft size={18} />
            Orqaga
          </Button>

          {canFinish ? (
            <Button
              onClick={() => {
                if (window.confirm(SUBMIT_CONFIRM)) finish();
              }}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              Yakunlash{submitting && "…"}
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={submitting || saveAnswer.isPending || (isAdaptive && !hasAnswer)}
            >
              Keyingisi
              <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeDiagnosticPage;
