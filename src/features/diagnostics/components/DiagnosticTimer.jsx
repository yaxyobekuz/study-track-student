// React
import { useEffect, useRef, useState } from "react";

// Icons
import { Clock, AlertTriangle } from "lucide-react";

// Data
import { TIMER_WARNING_SECONDS, TIMER_DANGER_SECONDS } from "../data/diagnostics.data";

// Utils
import { cn } from "@/shared/utils/cn";

const format = (total) => {
  const s = Math.max(0, total);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * DIAGNOSTIKA TAYMERI.
 *
 * ⚠️ QOLGAN VAQT HAR SAFAR SERVER BERGAN `expiresAt` DAN QAYTA
 * HISOBLANADI, ichki sanoqchidan emas: telefon uxlab qolsa yoki brauzer
 * tabni to'xtatsa, `setInterval` sekinlashadi va sanoqchi haqiqiy vaqtdan
 * orqada qolardi — o'quvchi ekranda "5 daqiqa bor" deb turib, aslida
 * vaqti tugagan bo'lardi.
 *
 * ⚠️ `onExpire` FAQAT BIR MARTA chaqiriladi (`firedRef`).
 */
const DiagnosticTimer = ({ expiresAt, onExpire }) => {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)),
  );
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    const tick = () => {
      const left = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
      );
      setRemaining(left);
      if (left === 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, onExpire]);

  const danger = remaining <= TIMER_DANGER_SECONDS;
  const warning = !danger && remaining <= TIMER_WARNING_SECONDS;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold tabular-nums",
        danger
          ? "animate-pulse bg-red-100 text-red-700"
          : warning
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-50 text-blue-700",
      )}
    >
      {danger ? <AlertTriangle size={16} /> : <Clock size={16} />}
      <span>{format(remaining)}</span>
    </div>
  );
};

export default DiagnosticTimer;
