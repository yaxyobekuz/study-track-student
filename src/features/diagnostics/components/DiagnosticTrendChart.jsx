// Data
import { scoreColor } from "../data/diagnostics.data";

// Utils
import { formatDateUz } from "@/shared/utils/date.utils";

/**
 * "RIVOJLANISH DINAMIKASI" — natijalar chizig'i.
 *
 * ⚠️ KUTUBXONASIZ, `viewBox` bilan moslashuvchan. Panelda grafik
 * kutubxonasi yo'q va uni bitta chiziq uchun qo'shish mobil internetda
 * yuklanishni sekinlashtirardi.
 *
 * ⚠️ CHIZIQ UZILMAYDI. Nuqtalar vaqt bo'yicha emas, TARTIB bo'yicha
 * teng joylashtiriladi: sanalar orasidagi masofa juda notekis
 * (bir kunda ikki test, keyin bir oy jimlik) va vaqt o'qida chiziq
 * ekranning bir chekkasiga siqilib qolardi.
 *
 * ⚠️ 0 va 100 chegaralari QOTIB TURADI. O'q faqat mavjud qiymatlarga
 * moslashsa, 78% va 80% orasidagi farq butun ekranni egallab, kichik
 * o'zgarish katta sakrash bo'lib ko'rinardi.
 */
const WIDTH = 320;
const HEIGHT = 132;
const PAD_X = 10;
const PAD_TOP = 12;
const PAD_BOTTOM = 22;

const DiagnosticTrendChart = ({ points = [] }) => {
  if (points.length < 2) return null;

  const plotW = WIDTH - PAD_X * 2;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const x = (i) =>
    points.length === 1 ? WIDTH / 2 : PAD_X + (i / (points.length - 1)) * plotW;
  const y = (score) => PAD_TOP + (1 - Math.min(100, Math.max(0, score)) / 100) * plotH;

  const line = points
    .map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`)
    .join(" ");

  const area =
    `${line} L${x(points.length - 1).toFixed(1)},${PAD_TOP + plotH}` +
    ` L${x(0).toFixed(1)},${PAD_TOP + plotH} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Natijalar dinamikasi: ${points.length} ta test`}
      >
        {/* Yo'naltiruvchi chiziqlar — 0 / 50 / 100 */}
        {[0, 50, 100].map((value) => (
          <g key={value}>
            <line
              x1={PAD_X}
              x2={WIDTH - PAD_X}
              y1={y(value)}
              y2={y(value)}
              stroke="#EEF2F7"
              strokeWidth="1"
            />
            <text x={0} y={y(value) + 3} fontSize="8" fill="#CBD5E1">
              {value}
            </text>
          </g>
        ))}

        <path d={area} fill="#2563eb" opacity="0.08" />
        <path
          d={line}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Nuqta rangi DARAJANI bildiradi — chiziqning o'zi bir xil ko'k,
            aks holda ko'p rangli chiziq o'qilmay qolardi. */}
        {points.map((p, i) => (
          <circle
            key={p.attemptId || i}
            cx={x(i)}
            cy={y(p.score)}
            r="3.5"
            fill="#fff"
            stroke={scoreColor(p.score)}
            strokeWidth="2.5"
          />
        ))}

        <text x={PAD_X} y={HEIGHT - 6} fontSize="8.5" fill="#94A3B8">
          {formatDateUz(points[0].date)}
        </text>
        <text
          x={WIDTH - PAD_X}
          y={HEIGHT - 6}
          fontSize="8.5"
          fill="#94A3B8"
          textAnchor="end"
        >
          {formatDateUz(points[points.length - 1].date)}
        </text>
      </svg>
    </div>
  );
};

export default DiagnosticTrendChart;
