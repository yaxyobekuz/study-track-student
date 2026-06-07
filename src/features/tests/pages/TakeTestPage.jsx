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

  const submitSession = useCallback(() => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    submitMutation.mutate();
  }, [submitMutation]);

  const finalizeAndGo = useCallback(() => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    studentTestSessionsAPI
      .submit(session._id)
      .then((res) => {
        const resultId = res.data?.data?.result?._id;
        if (resultId) navigate(`/my-results/${resultId}`, { replace: true });
        else navigate("/my-results", { replace: true });
      })
      .catch(() => navigate("/my-results", { replace: true }));
  }, [session, navigate]);

  const handleAnswerChange = useCallback(
    (questionId, payload) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId.toString()]: {
          ...prev[questionId.toString()],
          ...payload,
        },
      }));
      saveAnswerMutation.mutate({ questionId, payload });
    },
    [saveAnswerMutation],
  );

  const handleTimerExpire = useCallback(() => {
    toast.warning("Test vaqti tugadi. Avtomatik topshirilmoqda...");
    submitSession();
  }, [submitSession]);

  if (loadingStart) {
    return (
      <div className="container pt-4">
        <Card>
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span>Test yuklanmoqda...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container pt-4">
        <Card>
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <AlertCircle size={40} className="text-red-400" />
            <p className="text-gray-900 font-medium">{error}</p>
            <Button
              variant="outline"
              onClick={() => navigate("/available-tests")}
            >
              Orqaga
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!session) return null;

  const isClosed = session.status !== "in_progress";
  const answeredCount = Object.keys(answers).filter(
    (qid) =>
      answers[qid]?.selectedOptionId || (answers[qid]?.textAnswer || "").trim(),
  ).length;

  return (
    <div className="space-y-4">
      {/* Sarlavha va taymer */}
      <div className="sticky top-0 inset-x-0 z-10 bg-white pt-1 pb-2 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 container">
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
      </div>

      {/* Savollar */}
      <div className="container space-y-4 pb-24">
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
      <div className="sticky bottom-0 z-10 bg-white py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 container">
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
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2 />
            )}
            Testni yakunlash{submitting && "..."}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TakeTestPage;
