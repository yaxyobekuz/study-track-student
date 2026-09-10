// Icons
import { Loader2, Target } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";

/**
 * "KUCHLI TOMONLAR" / "ZAIF TOMONLAR" ro'yxati.
 *
 * ⚠️ IKKALA RO'YXAT BITTA CHEGARADAN chiqadi (server `goodScore`), ya'ni
 * bitta mavzu ikkalasida ham turolmaydi va oraliqda "yo'qolmaydi" ham.
 */
const TopicList = ({
  title,
  subtitle,
  topics = [],
  tone = "good",
  emptyText,
  onPractice,
  busySubject = null,
}) => {
  const color = tone === "good" ? "#10B981" : "#EF4444";

  return (
    <Card>
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}

      {topics.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">{emptyText}</p>
      ) : (
        <div className="mt-3 space-y-2.5">
          {topics.map((topic) => (
            <div key={`${topic.subject}-${topic.topicId || topic.topic}`} className="flex items-center gap-2.5">
              <span
                className="h-8 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {topic.topic}
                </p>
                <p className="truncate text-[11px] text-gray-400">{topic.subject}</p>
              </div>

              <span
                className="shrink-0 text-sm font-bold tabular-nums"
                style={{ color }}
              >
                {Math.round(topic.score)}%
              </span>

              {onPractice && (
                <button
                  type="button"
                  disabled={busySubject === topic.subjectId}
                  onClick={() => onPractice(topic)}
                  className="shrink-0 rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-60"
                >
                  {busySubject === topic.subjectId ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1">
                      <Target size={12} />
                      Mashq
                    </span>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TopicList;
