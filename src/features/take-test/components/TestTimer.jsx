// React
import { useEffect, useState, useRef } from "react";

// Icons
import { Clock, AlertTriangle } from "lucide-react";

// Data
import {
  TIMER_WARNING_THRESHOLD_SECONDS,
  TIMER_DANGER_THRESHOLD_SECONDS,
} from "../data/takeTest.data";

// Utils
import { cn } from "@/shared/utils/cn";

/**
 * Soniyani "MM:SS" formatiga aylantiradi.
 */
const formatTime = (totalSeconds) => {
  if (totalSeconds < 0) totalSeconds = 0;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/**
 * Test taymeri - qolgan vaqtni server `expiresAt` dan hisoblaydi.
 * Klient soatiga ishonmaydi: doim shu paytdagi `new Date()` va `expiresAt` farqini oladi.
 * Vaqt tugaganda `onExpire` chaqiriladi (faqat bir marta).
 *
 * @param {object} props
 * @param {string|Date} props.expiresAt - session tugash vaqti
 * @param {Function} props.onExpire - vaqt tugaganda chaqiriladi
 */
const TestTimer = ({ expiresAt, onExpire }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)),
  );

  // onExpire faqat bir marta chaqirilishi uchun
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    const update = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
      );
      setRemainingSeconds(remaining);
      if (remaining === 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire?.();
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const isDanger = remainingSeconds <= TIMER_DANGER_THRESHOLD_SECONDS;
  const isWarning =
    !isDanger && remainingSeconds <= TIMER_WARNING_THRESHOLD_SECONDS;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg font-semibold tabular-nums",
        isDanger
          ? "bg-red-100 text-red-700 animate-pulse"
          : isWarning
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-50 text-blue-700",
      )}
    >
      {isDanger ? <AlertTriangle size={18} /> : <Clock size={18} />}
      <span>{formatTime(remainingSeconds)}</span>
    </div>
  );
};

export default TestTimer;
