// React
import { useState } from "react";

// Router
import { Link, useNavigate } from "react-router-dom";

// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Toast
import { toast } from "sonner";

// Icons
import {
  Brain,
  Play,
  Loader2,
  ChevronRight,
  CalendarClock,
  Sparkles,
  History,
  LayoutDashboard,
} from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import AiTipBanner from "../components/AiTipBanner";
import SubjectResultCard from "../components/SubjectResultCard";
import TopicList from "../components/TopicList";

// Queries
import { diagnosticsQueries } from "../queries/diagnostics.queries";
import {
  useStartDiagnostic,
  usePracticeWeakTopics,
} from "../queries/diagnostics.mutations";

// Data
import {
  MODE_LABELS,
  MODE_ICONS,
  MODE_HINTS,
  ATTEMPT_STATUS,
  GRADE_LABELS,
  GRADE_BADGE,
  scoreColor,
} from "../data/diagnostics.data";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatDateUz } from "@/shared/utils/date.utils";

/**
 * DIAGNOSTIKA — "Testlar" markazidagi tab.
 *
 * Uch qism: o'qituvchi biriktirgan diagnostikalar, mustaqil boshlash
 * va o'z urinishlari tarixi.
 */
const DiagnosticsListPage = () => {
  const navigate = useNavigate();

  const { data: tests, isLoading } = useQuery(diagnosticsQueries.availableTests());
  const { data: attempts } = useQuery(diagnosticsQueries.myAttempts(5));
  const { data: dashboard } = useQuery(diagnosticsQueries.dashboard());
  const startDiagnostic = useStartDiagnostic();
  const practice = usePracticeWeakTopics();

  const [startingId, setStartingId] = useState(null);
  const [practicingSubject, setPracticingSubject] = useState(null);

  /**
   * "Zaif mavzularni mashq qilish".
   *
   * ⚠️ FAQAT FAN YUBORILADI. Qaysi mavzular zaif ekanini server
   * hisoblaydi — mijoz mavzu ro'yxatini yuborsa, uni so'rov tanasida
   * o'zgartirib, "mashq" nomi ostida oson savollarni olish mumkin
   * bo'lardi.
   */
  const practiceSubject = (subjectId) => {
    if (!subjectId) return;
    setPracticingSubject(subjectId);
    practice.mutate(
      { subjectId },
      {
        onSuccess: (attempt) => navigate(`/diagnostics/take/${attempt.id}`),
        onError: (err) => {
          toast.error(err.response?.data?.message || "Mashq boshlanmadi");
          setPracticingSubject(null);
        },
      },
    );
  };

  const start = (payload, key) => {
    setStartingId(key);
    startDiagnostic.mutate(payload, {
      onSuccess: (attempt) => navigate(`/diagnostics/take/${attempt.id}`),
      onError: (err) => {
        toast.error(err.response?.data?.message || "Test boshlanmadi");
        setStartingId(null);
      },
    });
  };

  if (isLoading) return <LoaderCard />;

  const openTests = tests || [];
  const history = attempts || [];
  const subjects = dashboard?.subjects ?? [];
  const strongTopics = dashboard?.strongTopics ?? [];
  const weakTopics = dashboard?.weakTopics ?? [];

  return (
    <div className="space-y-4">
      {/* ── BOSH SAHIFAGA O'TISH ──────────── */}
      {/* ⚠️ HAVOLA HAR DOIM KO'RINADI. Ilgari u faqat testi bor
          o'quvchiga chiqardi — ya'ni tizimda diagnostika borligini
          birinchi testni topshirmaguncha bilib bo'lmasdi. Bosh sahifaning
          o'zi endi bo'sh holatni tushuntiradi. */}
      <Link
        to="/diagnostics"
        className="flex items-center gap-3 rounded-2xl bg-white p-4 transition-colors active:bg-gray-50 xs:p-5"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <LayoutDashboard size={20} strokeWidth={1.5} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-gray-900">
            Umumiy natijalarim
          </span>
          <span className="block text-xs text-gray-400">
            O'rtacha, dinamika va fanlar kesimi
          </span>
        </span>

        <ChevronRight className="size-4 shrink-0 text-gray-300" strokeWidth={1.5} />
      </Link>

      {/* ── AI TAVSIYASI ──────────────────── */}
      <AiTipBanner
        recommendation={dashboard?.recommendation}
        busy={practicingSubject === dashboard?.recommendation?.subjectId}
        onPractice={(rec) => practiceSubject(rec.subjectId)}
      />

      {/* ── BIRIKTIRILGAN TESTLAR ─────────── */}
      {openTests.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Sizga biriktirilgan</h2>

          {openTests.map((test) => {
            const Icon = MODE_ICONS[test.mode] || Brain;
            const busy = startingId === test.id;

            return (
              <Card key={test.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={20} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{test.title}</p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {test.subject?.name || "Aralash fanlar"} ·{" "}
                      {MODE_LABELS[test.mode]}
                      {test.mode !== "adaptive" && ` · ${test.questionCount} savol`}
                      {test.mode === "timed" && ` · ${test.durationMin} daqiqa`}
                    </p>
                  </div>
                </div>

                {/* Hali ochilmagan test — sanasi bilan */}
                {!test.canStart && test.opensAt && (
                  <p className="flex items-center gap-1.5 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                    <CalendarClock size={14} className="shrink-0" />
                    {formatDateUz(test.opensAt)} dan boshlab ochiladi
                  </p>
                )}

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-400">
                    {test.attemptsLeft > 0
                      ? `${test.attemptsLeft} urinish qoldi`
                      : "Urinishlar tugadi"}
                  </span>

                  <Button
                    size="sm"
                    disabled={!test.canStart || busy}
                    onClick={() => start({ testId: test.id }, test.id)}
                  >
                    {busy ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Play size={16} />
                    )}
                    Boshlash
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── MUSTAQIL MASHQ ────────────────── */}
      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Sparkles size={20} />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">O'zingizni sinab ko'ring</p>
            <p className="mt-0.5 text-sm text-gray-500">
              {MODE_HINTS.adaptive}. Test darajangiz aniq bo'lgach o'zi to'xtaydi.
            </p>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={startingId === "self"}
          onClick={() => start({ mode: "adaptive" }, "self")}
        >
          {startingId === "self" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Brain size={16} />
          )}
          Adaptiv testni boshlash
        </Button>
      </Card>

      {/* ── FANLAR BO'YICHA NATIJALAR ─────── */}
      {subjects.length > 0 && (
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-gray-900">Fanlar bo'yicha natijalar</h2>
            <p className="text-sm text-gray-500">
              Har bir fandan o'zlashtirish darajangiz
            </p>
          </div>

          {subjects.map((subject) => (
            <SubjectResultCard
              key={subject.subjectId || subject.subject}
              subject={subject}
              busy={practicingSubject === subject.subjectId}
              onPractice={(s) => practiceSubject(s.subjectId)}
            />
          ))}
        </div>
      )}

      {/* ── KUCHLI VA ZAIF TOMONLAR ───────── */}
      {(strongTopics.length > 0 || weakTopics.length > 0) && (
        <div className="grid gap-4 xs:grid-cols-2">
          <TopicList
            title="Kuchli tomonlar"
            subtitle="Eng yaxshi natijali mavzular"
            topics={strongTopics}
            tone="good"
            emptyText="Hali kuchli mavzu aniqlanmadi"
          />
          <TopicList
            title="Zaif tomonlar"
            subtitle="Yaxshilash kerak bo'lgan mavzular"
            topics={weakTopics}
            tone="bad"
            emptyText="Zaif mavzu topilmadi — barakalla! 🎉"
            busySubject={practicingSubject}
            onPractice={(topic) => practiceSubject(topic.subjectId)}
          />
        </div>
      )}

      {/* ── SO'NGGI NATIJALAR ─────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-900">So'nggi natijalar</h2>

          {history.length > 0 && (
            <button
              type="button"
              onClick={() => navigate("/diagnostics/history")}
              className="flex shrink-0 items-center gap-1 text-sm font-medium text-blue-600"
            >
              <History size={15} />
              Test tarixi
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <Card>
            <p className="py-6 text-center text-sm text-gray-500">
              Hali diagnostika topshirmagansiz. Yuqoridagi tugma orqali
              boshlashingiz mumkin.
            </p>
          </Card>
        ) : (
          history.map((attempt) => {
            const status = ATTEMPT_STATUS[attempt.status] || ATTEMPT_STATUS.submitted;
            const live = attempt.status === "in_progress";

            return (
              <button
                key={attempt.id}
                type="button"
                onClick={() =>
                  navigate(
                    live
                      ? `/diagnostics/take/${attempt.id}`
                      : `/diagnostics/result/${attempt.id}`,
                  )
                }
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left transition-colors hover:bg-gray-50 xs:p-5"
              >
                {/* Ball */}
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums"
                  style={{
                    backgroundColor: `${scoreColor(attempt.score)}1A`,
                    color: scoreColor(attempt.score),
                  }}
                >
                  {attempt.score != null ? `${Math.round(attempt.score)}%` : "—"}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-gray-900">
                    {attempt.testTitle || attempt.subjectName || "Diagnostika"}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 font-medium",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                    {attempt.grade && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 font-medium",
                          GRADE_BADGE[attempt.grade],
                        )}
                      >
                        {GRADE_LABELS[attempt.grade]}
                      </span>
                    )}
                    {attempt.submittedAt && (
                      <span>{formatDateUz(attempt.submittedAt)}</span>
                    )}
                  </span>
                </span>

                <ChevronRight size={18} className="shrink-0 text-gray-300" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DiagnosticsListPage;
