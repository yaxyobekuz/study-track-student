// Icons
import { ShieldCheck, Target, TrendingUp, TrendingDown } from "lucide-react";

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

const STYLES = {
  strength: { icon: ShieldCheck, box: "bg-emerald-50 text-emerald-600" },
  blocker: { icon: Target, box: "bg-rose-50 text-rose-600" },
  change: { icon: TrendingUp, box: "bg-blue-50 text-blue-600" },
};

const FindingCards = ({ findings = [] }) => {
  if (!findings.length) return null;

  return (
    <div className="grid gap-3 xs:grid-cols-3">
      {findings.map((finding) => {
        const style = STYLES[finding.kind] || STYLES.change;
        // "O'zgarish" kartasi pasayishni ham ko'rsatadi — o'q yo'nalishi
        // ma'noni rangdan mustaqil beradi.
        const Icon =
          finding.kind === "change" && finding.positive === false
            ? TrendingDown
            : style.icon;

        return (
          <div
            key={finding.kind}
            className="flex flex-col rounded-2xl bg-white p-4 xs:p-5"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl",
                  finding.kind === "change" && finding.positive === false
                    ? "bg-amber-50 text-amber-600"
                    : style.box,
                )}
              >
                <Icon size={18} />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {finding.label}
              </span>
            </div>

            <p className="mt-3 font-semibold text-gray-900">{finding.title}</p>
            <p className="mt-1 text-sm text-gray-500">{finding.detail}</p>

            {finding.metric && (
              <p className="mt-auto pt-3 text-lg font-bold tabular-nums text-gray-900">
                {finding.metric}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FindingCards;
