// Icons
import { Sparkles, Loader2, Target } from "lucide-react";
import EmptyBlock from "./EmptyBlock";

/**
 * "AI TAVSIYASI" — bitta jumlalik maslahat va bitta tugma.
 *
 * ⚠️ MATN SERVERDA QOIDA BILAN YASALADI, MODEL CHAQIRILMAYDI. Panel har
 * ochilganda pullik so'rov yuborish mumkin emas; matn esa o'quvchining
 * HAQIQIY raqamlariga tayanadi ("Grammatika — 42%"), ya'ni "AI" yorlig'i
 * bo'sh va'da bo'lib qolmaydi. Urinishning chuqur AI tahlili natija
 * sahifasida alohida bor.
 */
const AiTipBanner = ({ recommendation, onPractice, busy = false }) => {
  if (!recommendation?.text) {
    return (
      <EmptyBlock
        title="AI tavsiyasi"
        hint="Tavsiya bir nechta test natijasi to'plangach chiqadi — qaysi mavzuni mustahkamlash kerakligini aytadi."
      />
    );
  }

  return (
    <div className="rounded-2xl bg-gray-900 p-4 xs:p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-400">
          <Sparkles size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">
            AI tavsiyasi
          </p>
          <p className="mt-1 text-sm leading-relaxed text-white/90">
            {recommendation.text}
          </p>

          {/* Tugma faqat mashq qiladigan narsa bo'lganda — "fan yo'q"
              holatida bosiladigan tugma ko'rsatish yolg'on va'da. */}
          {recommendation.subject && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onPractice?.(recommendation)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-opacity disabled:opacity-60"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Target size={15} />
              )}
              Mashq qilish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiTipBanner;
