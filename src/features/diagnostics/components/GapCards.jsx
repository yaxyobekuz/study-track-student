// Icons
import { Clock, TrendingUp } from "lucide-react";

// Data
import { TONES } from "../data/diagnostics.data";

/**
 * "YOPISH KERAK BO'LGAN MAVZULAR" — eng zaifidan boshlab, ko'pi bilan
 * to'rtta.
 *
 * ⚠️ RO'YXATNI SERVER TUZADI (`result.gaps`): chegara ham (80%), mehnat
 * bahosi ham, kutilayotgan foyda ham o'sha yerda. Mijozda takrorlansa,
 * admin paneli boshqa mavzularni "yopish kerak" deb ko'rsatib qolardi.
 *
 * ⚠️ "Kutilayotgan foyda" — MAVZUNI YOPISH UMUMIY BALLGA QANCHA
 * QO'SHISHI, mavzuning joriy foizi EMAS. Tayyor loyihada bu katakka
 * mavzuning o'z foizi yozilib, yoniga yashil o'q qo'yilgan edi.
 */
const GapCards = ({ gaps = [] }) => {
  if (!gaps.length) return null;

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-gray-900">Yopish kerak bo'lgan mavzular</h2>

      {gaps.map((gap) => {
        const tone = TONES[gap.tone] || TONES.gap;

        return (
          <div
            key={gap.topicId || gap.topic}
            className="flex items-start gap-3 rounded-2xl bg-white p-4 xs:p-5"
          >
            <span
              className="mt-0.5 h-8 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: tone.color }}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-gray-900">{gap.topic}</p>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${tone.color}1A`, color: tone.color }}
                >
                  {tone.label}
                </span>
              </div>

              <p className="mt-0.5 text-sm text-gray-500">
                {gap.questions} savol · {Math.round(gap.score)}% aniqlik
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                {gap.projectedGain > 0 && (
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <TrendingUp size={13} />+{gap.projectedGain}% umumiy ballga
                  </span>
                )}
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock size={13} />
                  {gap.effortLabel}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GapCards;
