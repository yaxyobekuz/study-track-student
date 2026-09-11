// Icons
import { Target } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import EmptyBlock from "./EmptyBlock";
import SectionHeader from "./SectionHeader";

// Data
import { scoreColor } from "../data/diagnostics.data";

/**
 * "FANLAR BO'YICHA NATIJA" — bitta urinish ichidagi fanlar kesimi.
 *
 * ⚠️ KESIM SAVOLNING O'Z FANI BO'YICHA (server `getResult` da). Aralash
 * test ham fanlarga bo'linadi va "Aralash" degan ma'nosiz qator
 * chiqmaydi.
 *
 * ⚠️ BITTA FANLI TESTDA HAM BLOK CHIQADI. Ilgari u "taqqoslash yo'q"
 * deb yashirilardi; lekin blok taqqoslash emas, har fandan ANIQLIK va
 * SAVOLLAR SONI — bitta fanda ham o'quvchiga "20 savoldan 16 tasi"
 * degan ma'lumot beradi (umumiy ball buni aytmaydi).
 *
 * Kengroq ekranda fanlar yonma-yon (manba loyihadagidek), telefonda
 * ustma-ust.
 */
const SubjectBars = ({ subjects = [] }) => {
  if (subjects.length === 0) {
    return (
      <EmptyBlock
        title="Fanlar bo'yicha natija"
        hint="Fan kesimi test yakunlangach hisoblanadi."
      />
    );
  }

  return (
    <Card>
      <SectionHeader
        icon={Target}
        title="Fanlar bo'yicha natija"
        subtitle="Har fan bo'yicha aniqlik"
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {subjects.map((row) => {
          const value = Math.min(100, Math.max(0, row.score ?? 0));
          return (
            <div key={row.subjectId || row.subject}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate font-medium text-gray-900">
                  {row.subject}
                </span>
                <span
                  className="shrink-0 font-semibold tabular-nums"
                  style={{ color: scoreColor(row.score) }}
                >
                  {row.score}%
                </span>
              </div>

              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
                  style={{ width: `${value}%`, backgroundColor: scoreColor(row.score) }}
                />
              </div>

              {/* ⚠️ Maxraj foiz yonida turadi — "79%" 24 savoldanmi yoki
                  4 savoldanmi, bu ishonchlilikni butunlay o'zgartiradi. */}
              <p className="mt-1 text-xs text-gray-400">
                {row.questions} savol · {row.correct} to'g'ri
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SubjectBars;
