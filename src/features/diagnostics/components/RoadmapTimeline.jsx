// Icons
import { Route, Flag, Check } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import Sparkline from "./Sparkline";

/**
 * "SHAXSIY O'QUV YO'LI" — bashorat egri chizig'i va haftalik qadamlar.
 *
 * ⚠️ REJA SERVERDA MUHRLANADI (`roadmap`), egri chiziq esa o'sha
 * rejaning bashoratlaridan yig'iladi (`predictionCurve`). Ikkalasi bitta
 * manbadan bo'lgani uchun "grafik bir narsa, ro'yxat boshqa narsa"
 * deydigan holat bo'lmaydi.
 *
 * ⚠️ AI KELMASA HAM REJA BOR: server heuristik zaxira rejani qaytaradi.
 */
const RoadmapTimeline = ({ roadmap, curve = [] }) => {
  const steps = roadmap?.steps ?? [];
  if (!steps.length) return null;

  const from = curve[0];
  const to = curve[curve.length - 1];

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Route size={18} className="text-blue-600" />
        <div>
          <h2 className="font-semibold text-gray-900">Shaxsiy o'quv yo'li</h2>
          <p className="text-sm text-gray-500">
            Har test natijasidan keyin yangilanadi
          </p>
        </div>
      </div>

      {curve.length > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Bashorat egri chizig'i
            </p>
            <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900">
              {from}%{" "}
              <span className="font-normal text-gray-400">→</span>{" "}
              <span className="text-emerald-600">{to}%</span>
            </p>
          </div>
          <Sparkline data={curve} width={132} height={40} color="#2563eb" />
        </div>
      )}

      <ol className="mt-4 space-y-0">
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={step.week} className="relative flex gap-3 pb-5 last:pb-0">
              <div className="flex flex-col items-center">
                <span
                  className={
                    last
                      ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                      : "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-white text-xs font-semibold text-blue-600"
                  }
                >
                  {last ? <Check size={15} /> : step.week}
                </span>
                {!last && <span className="w-0.5 flex-1 bg-gray-100" />}
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <span className="shrink-0 text-[11px] uppercase tracking-wide text-gray-400">
                    {step.week}-hafta
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{step.detail}</p>

                {step.checkpoint && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    <Flag size={12} />
                    {step.checkpoint}
                    {step.projected != null && ` · ~${step.projected}%`}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
};

export default RoadmapTimeline;
