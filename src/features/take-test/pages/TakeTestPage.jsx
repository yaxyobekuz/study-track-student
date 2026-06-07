// React
import { useCallback, useEffect, useRef, useState } from "react";

// Toast
import { toast } from "sonner";

// Tanstack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Router
import { useNavigate, useParams } from "react-router-dom";

// Icons
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

// API
import { studentTestSessionsAPI } from "../api/testSessions.api";

// Data
import { SUBMIT_CONFIRM_MESSAGE } from "../data/takeTest.data";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";

import TestTimer from "../components/TestTimer";
import QuestionRenderer from "../components/QuestionRenderer";

// Utils
import { cn } from "@/shared/utils/cn";

/**
 * O'quvchi test ishlash sahifasi.
 *
 * Asosiy oqim:
 *  - Mount: startSession(testId) - yangi yoki davom etayotgan sessiyani oladi
 *  - Har javob: PUT /test-sessions/:id/answers (avtomatik saqlash)
 *  - Vaqt tugaganda: auto-submit
 *  - Qo'lda submit: tasdiqlash so'raydi → POST /:id/submit → /my-results/:id
 *
 * Taymer yaxlitligi: TestTimer server `expiresAt` ni manba qiladi.
 * Klient soatiga ishonmaydi. Har saveAnswer/submit serverdan rad olishi mumkin
 * (vaqt tugagan bo'lsa - toast bilan yo'naltirish).
 */
const TakeTestPage = () => {
  // V3: bindingId orqali sessiya boshlash
  const { bindingId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStart, setLoadingStart] = useState(true);
  // Mahalliy javoblar - { questionId: { selectedOptionId?, textAnswer? } }
  const [answers, setAnswers] = useState({});
  // Submit jarayoni boshlanganligi (auto-submit double-fire ni oldini olish uchun)
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  // Sessiyani boshlash/davom etish
  useEffect(() => {
    let cancelled = false;
    setLoadingStart(true);

    studentTestSessionsAPI
      .start(bindingId)
      .then((res) => {
        if (cancelled) return;
        const sess = res.data.data;
        setSession(sess);
        // Mavjud javoblarni mahalliy state ga ko'chirish
        const map = {};
        for (const a of sess.answers || []) {
          map[a.question.toString()] = {
            selectedOptionId: a.selectedOptionId || null,
            textAnswer: a.textAnswer || "",
          };
        }
        setAnswers(map);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.message || "Sessiya boshlanmadi");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingStart(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bindingId]);

  // Javob saqlash mutation
  const saveAnswerMutation = useMutation({
    mutationFn: ({ questionId, payload }) =>
      studentTestSessionsAPI.saveAnswer(session._id, {
        questionId,
        ...payload,
      }),
    onError: (err) => {
      const msg = err.response?.data?.message || "Javob saqlanmadi";
      // Vaqt tugagan bo'lsa, natijalarga o'tish
      if (
        msg.toLowerCase().includes("vaqt") ||
        msg.toLowerCase().includes("yakunlangan")
      ) {
        toast.warning(msg);
        finalizeAndGo();
      } else {
        toast.error(msg);
      }
    },
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: () => studentTestSessionsAPI.submit(session._id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["tests", "available"] });
      queryClient.invalidateQueries({ queryKey: ["my-results"] });
      const resultId = res.data?.data?.result?._id;
      toast.success("Test topshirildi");
      if (resultId) {
        navigate(`/my-results/${resultId}`, { replace: true });
      } else {
        navigate("/my-results", { replace: true });
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Topshirishda xatolik");
      submittingRef.current = false;
      setSubmitting(false);
    },
  });

  /**
   * Sessiyani topshiradi (auto yoki qo'lda).
   */
  const submitSession = useCallback(() => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    submitMutation.mutate();
  }, [submitMutation]);

  /**
   * Server sessiyani yopgan bo'lsa, natijalarga yo'naltirish.
   */
  const finalizeAndGo = useCallback(() => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    // submit chaqirish - server allaqachon expired qilgan bo'lsa,
    // qaytarayotgan xato ham bo'lishi mumkin, lekin natijalar ro'yxatiga yuborish kifoya
    studentTestSessionsAPI
      .submit(session._id)
      .then((res) => {
        const resultId = res.data?.data?.result?._id;
        if (resultId) navigate(`/my-results/${resultId}`, { replace: true });
        else navigate("/my-results", { replace: true });
      })
      .catch(() => navigate("/my-results", { replace: true }));
  }, [session, navigate]);

  /**
   * Foydalanuvchi javobini saqlash + serverga yuborish.
   */
  const handleAnswerChange = useCallback(
    (questionId, payload) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId.toString()]: {
          ...prev[questionId.toString()],
          ...payload,
        },
      }));
      // Serverga darhol saqlash
      saveAnswerMutation.mutate({ questionId, payload });
    },
    [saveAnswerMutation],
  );

  // Vaqt tugaganda - auto-submit
  const handleTimerExpire = useCallback(() => {
    toast.warning("Test vaqti tugadi. Avtomatik topshirilmoqda...");
    submitSession();
  }, [submitSession]);

  // ───── Render ─────
  if (loadingStart) {
    return (
      <Card>
        <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          <span>Test yuklanmoqda...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <AlertCircle size={40} className="text-red-400" />
          <p className="text-gray-900 font-medium">{error}</p>
          <Button variant="outline" onClick={() => navigate("/available-tests")}>
            Orqaga
          </Button>
        </div>
      </Card>
    );
  }

  if (!session) return null;

  const isClosed = session.status !== "in_progress";
  const answeredCount = Object.keys(answers).filter(
    (qid) =>
      answers[qid]?.selectedOptionId || (answers[qid]?.textAnswer || "").trim(),
  ).length;

  return (
    <div className="space-y-5">
      {/* Sarlavha va taymer */}
      <div className="flex items-start justify-between gap-3 flex-wrap sticky top-0 z-10 bg-gray-50 pt-1 pb-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {session.test?.title || "Test"}
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Javob berilgan: {answeredCount} / {session.questions.length}
            {saveAnswerMutation.isPending && (
              <span className="ml-2 text-xs text-blue-600 inline-flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" />
                saqlanmoqda...
              </span>
            )}
          </p>
        </div>

        {session.expiresAt && !isClosed && (
          <TestTimer
            expiresAt={session.expiresAt}
            onExpire={handleTimerExpire}
          />
        )}
      </div>

      {/* Savollar */}
      <div className="space-y-4">
        {session.questions.map((q, index) => (
          <Card key={index} className="space-y-3">
            <QuestionRenderer
              question={q}
              index={index}
              currentAnswer={answers[q.question.toString()]}
              onAnswerChange={handleAnswerChange}
              disabled={isClosed || submitting}
            />
          </Card>
        ))}
      </div>

      {/* Topshirish */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 sticky bottom-0 z-10 bg-gray-50 py-3",
          "border-t border-gray-200",
        )}
      >
        <p className="text-sm text-gray-600">
          {answeredCount === session.questions.length
            ? "Barcha savollarga javob berildi"
            : `${session.questions.length - answeredCount} ta savol qoldi`}
        </p>
        <Button
          onClick={() => {
            if (window.confirm(SUBMIT_CONFIRM_MESSAGE)) submitSession();
          }}
          disabled={submitting || isClosed}
          className="gap-2"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          {submitting ? "Topshirilmoqda..." : "Testni topshirish"}
        </Button>
      </div>
    </div>
  );
};

export default TakeTestPage;
