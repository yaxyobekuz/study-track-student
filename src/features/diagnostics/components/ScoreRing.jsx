// React
import { useEffect, useState } from "react";

// Utils
import { cn } from "@/shared/utils/cn";

/**
 * BALL HALQASI.
 *
 * ⚠️ Animatsiya sof CSS `stroke-dashoffset` o'tishi bilan — panelda
 * animatsiya kutubxonasi yo'q va uni faqat shu halqa uchun qo'shish
 * bundle'ni bekorga kattalashtirardi (mobil internet uchun muhim).
 * `prefers-reduced-motion` hurmat qilinadi.
 */
const ScoreRing = ({
  value = 0,
  size = 150,
  stroke = 12,
  color = "#2563eb",
  trackColor = "#E5E9F2",
  className = "",
  children,
}) => {
  const safe = Math.min(100, Math.max(0, Number(value) || 0));
  const radius = (size - stroke) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const [drawn, setDrawn] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(safe));
    return () => cancelAnimationFrame(frame);
  }, [safe]);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Natija: ${Math.round(safe)} foiz`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - drawn / 100)}
          className="transition-[stroke-dashoffset] ease-out [transition-duration:1100ms] motion-reduce:transition-none"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ScoreRing;
