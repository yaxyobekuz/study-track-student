// React
import { useState, useMemo } from "react";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Components
import Card from "@/shared/components/ui/Card";

// Data
import {
  statisticsViewModes,
  UZ_MONTHS,
} from "@/features/statistics/data/statistics.data";

const groupByMonth = (allStats) => {
  const map = new Map();
  allStats.forEach((stat) => {
    const d = new Date(stat.weekStart);
    const key = `${stat.year}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map.has(key)) {
      map.set(key, {
        label: `${UZ_MONTHS[d.getMonth()]} ${stat.year}`,
        totalSum: 0,
        totalGrades: 0,
      });
    }
    const entry = map.get(key);
    entry.totalSum += stat.simpleStats?.totalSum ?? 0;
    entry.totalGrades += stat.simpleStats?.totalGrades ?? 0;
  });
  return Array.from(map.values());
};

const groupByYear = (allStats) => {
  const map = new Map();
  allStats.forEach((stat) => {
    const key = String(stat.year);
    if (!map.has(key)) {
      map.set(key, { label: key, totalSum: 0, totalGrades: 0 });
    }
    const entry = map.get(key);
    entry.totalSum += stat.simpleStats?.totalSum ?? 0;
    entry.totalGrades += stat.simpleStats?.totalGrades ?? 0;
  });
  return Array.from(map.values());
};

const buildSubjectData = (allStats) => {
  const map = new Map();
  allStats.forEach((stat) => {
    (stat.simpleStats?.subjects ?? []).forEach((s) => {
      if (!s.subject) return;
      const id = s.subject._id ?? s.subject;
      const name = s.subject.name ?? String(id);
      if (!map.has(id)) map.set(id, { name, sum: 0, count: 0 });
      const entry = map.get(id);
      entry.sum += s.sum ?? 0;
      entry.count += s.count ?? 0;
    });
  });
  return Array.from(map.values()).map((e) => ({
    name: e.name,
    avg: e.count > 0 ? +(e.sum / e.count).toFixed(2) : 0,
  }));
};

const PIE_COLORS = [
  "#3b82f6", // ko'k
  "#f59e0b", // sariq
  "#10b981", // yashil
  "#ef4444", // qizil
  "#8b5cf6", // binafsha
  "#f97316", // to'q sariq
  "#06b6d4", // moviy
  "#ec4899", // pushti
  "#84cc16", // o'tko'k
  "#6366f1", // blue
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block size-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-bold text-gray-800">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{entry.name}</p>
      <div className="flex items-center gap-2">
        <span
          className="inline-block size-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.payload.fill }}
        />
        <span className="text-gray-500">O'rtacha:</span>
        <span className="font-bold text-gray-800">{entry.value}</span>
      </div>
    </div>
  );
};

const StatsCharts = ({ allStats = [] }) => {
  const [viewMode, setViewMode] = useState("monthly");

  const periodData = useMemo(() => {
    return viewMode === "monthly"
      ? groupByMonth(allStats)
      : groupByYear(allStats);
  }, [allStats, viewMode]);

  const trendData = useMemo(() => {
    return periodData.map((p) => ({
      label: p.label,
      avg: p.totalGrades > 0 ? +(p.totalSum / p.totalGrades).toFixed(2) : 0,
    }));
  }, [periodData]);

  const subjectData = useMemo(() => buildSubjectData(allStats), [allStats]);

  return (
    <div className="space-y-4">
      {/* Ko'rish rejimi toggle */}
      <div className="flex gap-2">
        {statisticsViewModes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => setViewMode(mode.value)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              viewMode === mode.value
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Chart 1: Davr bo'yicha umumiy ballar */}
      <Card className="space-y-4" title="Umumiy ballar">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={periodData}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="totalSum"
              name="Ball"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 2: O'rtacha baho tendensiyasi */}
      <Card className="space-y-4" title="O'rtacha baho tendensiyasi">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={trendData}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="avg"
              name="O'rtacha"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Chart 3: Fanlar bo'yicha o'rtacha baho (Pie chart) */}
      {subjectData.length > 0 && (
        <Card className="space-y-4" title="Fanlar bo'yicha o'rtacha">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                cx="50%"
                cy="45%"
                dataKey="avg"
                nameKey="name"
                innerRadius={40}
                outerRadius={90}
                data={subjectData}
                labelLine={false}
                label={({ avg }) => avg}
              >
                {subjectData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default StatsCharts;
