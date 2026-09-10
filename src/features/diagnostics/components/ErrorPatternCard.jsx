// Icons
import { AlertTriangle, Gauge } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";

// Data
import { ERROR_REASONS } from "../data/diagnostics.data";

/**
 * "XATO TAHLILI" — xatoni AYB emas, XULQ sifatida ko'rsatadi.
 *
 * ⚠️ MAXRAJ — XATO JAVOBLAR SONI, savollar soni emas. Tashlab ketilgan
 * savol xato hisoblanmaydi (unga umuman urinilmagan), shuning uchun
 * uch ulush yig'indisi har doim 100% bo'ladi.
 */

const ORDER = ["rushing", "knowledge", "misread"];

const ErrorPatternCard = ({ patterns }) => {
  // ⚠️ "Xato yo'q" — BO'SH JOY EMAS, ALOHIDA XABAR. Blokni yashirib
  // qo'yish o'quvchida "tahlil ishlamadi" degan taassurot qoldirardi.
  if (!patterns || !patterns.wrongCount) {
    return (
      <Card>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Gauge size={18} />
          </span>
          <h2 className="font-semibold text-gray-900">Xato tahlili</h2>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Bu urinishda xato yo'q — ajoyib!
        </p>
      </Card>
    );
  }

  const segments = ORDER.map((key) => ({
    key,
    value: patterns[key] ?? 0,
    ...ERROR_REASONS[key],
  }));
  // Teng bo'lsa `ORDER` tartibi hal qiladi — natija barqaror bo'lishi
  // uchun (aks holda bir xil ma'lumot har renderda boshqa jumla berardi).
  const dominant = [...segments].sort((a, b) => b.value - a.value)[0];

  return (
    <Card>
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <AlertTriangle size={18} />
        </span>
        <h2 className="font-semibold text-gray-900">Xato tahlili</h2>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-700">
        {patterns.wrongCount} ta xatoning{" "}
        <span className="font-semibold text-gray-900">{dominant.value}%</span> —{" "}
        {dominant.sentence}
      </p>

      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.key}
              style={{ width: `${s.value}%`, backgroundColor: s.color }}
              title={`${s.label}: ${s.value}%`}
            />
          ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label} {s.value}%
          </span>
        ))}
      </div>
    </Card>
  );
};

export default ErrorPatternCard;
