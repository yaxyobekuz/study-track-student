// Components
import Card from "@/shared/components/ui/Card";

// Data
import { scoreColor } from "../data/diagnostics.data";

/**
 * "FANLAR BO'YICHA NATIJA" — bitta urinish ichidagi fanlar kesimi.
 *
 * ⚠️ KESIM SAVOLNING O'Z FANI BO'YICHA (server `getResult` da). Aralash
 * test ham fanlarga bo'linadi va "Aralash" degan ma'nosiz qator
 * chiqmaydi.
 *
 * ⚠️ FAN BITTA BO'LSA BLOK KO'RSATILMAYDI: bitta ustunli "taqqoslash"
 * hech narsani taqqoslamaydi, umumiy ball esa yuqorida allaqachon bor.
 */
const SubjectBars = ({ subjects = [] }) => {
  if (subjects.length < 2) return null;

  return (
    <Card title="Fanlar bo'yicha natija">
      <div className="mt-3 space-y-3">
        {subjects.map((row) => (
          <div key={row.subjectId || row.subject}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 truncate font-medium text-gray-900">
                {row.subject}
              </span>
              <span className="shrink-0 tabular-nums text-gray-500">
                {row.correct}/{row.questions} ·{" "}
                <span className="font-semibold text-gray-900">{row.score}%</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
                style={{
                  width: `${Math.min(100, Math.max(0, row.score))}%`,
                  backgroundColor: scoreColor(row.score),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SubjectBars;
