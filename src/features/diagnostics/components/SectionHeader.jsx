// Utils
import { cn } from "@/shared/utils/cn";

/**
 * NATIJA BLOKI SARLAVHASI — ikonka qutisi + nom + izoh.
 *
 * ⚠️ BITTA KOMPONENT, chunki natija sahifasidagi har blok (fanlar,
 * mavzular, AI izohi, xato tahlili, o'quv yo'li, savollar) AYNI
 * sarlavha shaklida turadi. Har blok o'zinikini yozsa, ikonka o'lchami
 * va oraliqlar blokdan blokka ozgina farq qilib, sahifa "yig'ma"
 * ko'rinib qolardi.
 */
const SectionHeader = ({ icon, title, subtitle = null, tone = "blue" }) => {
  const Icon = icon;
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          tones[tone] || tones.blue,
        )}
      >
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SectionHeader;
