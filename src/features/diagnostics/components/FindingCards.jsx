// Icons
import { ShieldCheck, Target, TrendingUp, TrendingDown } from "lucide-react";
import EmptyBlock from "./EmptyBlock";

// Utils
import { cn } from "@/shared/utils/cn";

/**
 * "SIZNING 3 TA ASOSIY TOPILMANGIZ".
 *
 * ⚠️ MATN SERVERDAN KELADI (`result.findings`) va HAR DOIM UCHTA bo'ladi.
 * Bu yerda hisob-kitob YO'Q: AI matni tayyor bo'lsa server o'sha matnni,
 * bo'lmasa qoidadan chiqqan matnni qo'yadi. Mijozda ikkinchi nusxa
 * yozilsa, admin paneli boshqa xulosa ko'rsatib qolardi.
 */

/**
 * Har topilma turining RANGI uch joyda takrorlanadi: ikonka qutisi,
 * o'ngdagi belgi va pastdagi son. Bittasida farq qilsa, karta "qaysi
 * ma'noda?" degan savol tug'dirardi — shuning uchun bitta jadvalda.
 */
const STYLES = {
  strength: {
    icon: ShieldCheck,
    box: "bg-emerald-50 text-emerald-600",
    accent: "text-emerald-600",
  },
  blocker: {
    icon: Target,
    box: "bg-rose-50 text-rose-600",
    accent: "text-rose-600",
  },
  change: {
    icon: TrendingUp,
    box: "bg-blue-50 text-blue-600",
    accent: "text-blue-600",
  },
};

// Pasayish — o'zgarish kartasining o'z rangi (sariq), o'sishdan farqli.
const DECLINE = { box: "bg-amber-50 text-amber-600", accent: "text-amber-600" };

const FindingCards = ({ findings = [] }) => {
  if (!findings.length) {
    return (
      <EmptyBlock
        title="Asosiy topilmalar"
        hint="Topilmalar test yakunlangach hisoblanadi — kuchli tomoningiz, asosiy to'siq va o'tgan testga nisbatan o'zgarish."
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Sarlavha kartadan TASHQARIDA — manba loyihadagidek: uch karta
          bitta fikrning uch tomoni, ular bitta nom ostida turadi. */}
      <h2 className="font-semibold text-gray-900">
        Sizning {findings.length} ta asosiy topilmangiz
      </h2>

      <div className="grid gap-3 xs:grid-cols-3">
        {findings.map((finding) => {
          const style = STYLES[finding.kind] || STYLES.change;
          // "O'zgarish" kartasi pasayishni ham ko'rsatadi — o'q yo'nalishi
          // ma'noni rangdan mustaqil beradi.
          const declined =
            finding.kind === "change" && finding.positive === false;
          const Icon = declined ? TrendingDown : style.icon;
          const tone = declined ? DECLINE : style;

          return (
            <div
              key={finding.kind}
              className="flex flex-col rounded-2xl bg-white p-4"
            >
              {/* Ikonka chapda, belgi o'ngda — manba loyihadagidek. Belgi
                  bir qatorda qoladi (`nowrap`): uch ustunli joylashuvda
                  u "KUCHLI / TOMON" bo'lib ikkiga bo'linib ketardi. */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl",
                    tone.box,
                  )}
                >
                  <Icon size={18} />
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap pt-1 text-[10px] font-bold uppercase tracking-wide",
                    tone.accent,
                  )}
                >
                  {finding.label}
                </span>
              </div>

              <p className="mt-3 font-semibold leading-snug text-gray-900">
                {finding.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">{finding.detail}</p>

              {finding.metric && (
                <p
                  className={cn(
                    "mt-auto pt-3 text-lg font-bold tabular-nums",
                    tone.accent,
                  )}
                >
                  {finding.metric}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FindingCards;
