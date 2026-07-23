// React
import { useMemo, useState } from "react";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Icons
import { Trophy, Award, ListChecks, BarChart3, Coins } from "lucide-react";

// Queries
import { testsQueries } from "@/features/tests/queries/tests.queries";

// Components
import Card from "@/shared/components/ui/Card";
import Tabs from "@/shared/components/ui/Tabs";
import SelectField from "@/shared/components/ui/select/SelectField";

// Data
import {
  SEASON_STATS_TABS,
  seasonStatsTabs,
} from "@/features/tests/data/seasonStatsTabs.data";

// Utils
import { cn } from "@/shared/utils/cn";
import { formatScore } from "@/shared/utils/formatScore";

/**
 * O'quvchining mavsum statistikasi 3 ta tabda:
 *  - Siz: o'quvchining shu mavsumdagi shaxsiy natijalari va mukofotlari
 *  - Sinf: tanlangan sinf bo'yicha reyting
 *  - Maktab: butun maktab bo'yicha reyting
 */
const StudentStatsView = ({ season }) => {
  const [tab, setTab] = useState(SEASON_STATS_TABS.YOU);

  const { data: stats, isLoading } = useQuery(
    testsQueries.seasonMyStats(season.id),
  );

  if (isLoading) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-10">Yuklanmoqda...</p>
      </Card>
    );
  }

  const myId = stats?.student?.id;
  const myClasses = stats?.student?.classes || [];

  return (
    <div className="space-y-4">
      <Tabs
        items={seasonStatsTabs}
        value={tab}
        onValueChange={setTab}
        listClassName="w-full"
        triggerClassName="flex-1"
      />

      {tab === SEASON_STATS_TABS.YOU && (
        <YouTab season={season} stats={stats} />
      )}
      {tab === SEASON_STATS_TABS.CLASS && (
        <ClassStandingsTab
          seasonId={season.id}
          myId={myId}
          classes={myClasses}
        />
      )}
      {tab === SEASON_STATS_TABS.SCHOOL && (
        <SchoolStandingsTab seasonId={season.id} myId={myId} />
      )}
    </div>
  );
};

/**
 * "Siz" tab: o'quvchining shaxsiy ko'rsatkichlari va o'rin mukofotlari.
 */
const YouTab = ({ season, stats }) => {
  const averageScore = stats?.averageScore || 0;

  const schoolTiers = [...(season.schoolTiers || [])].sort(
    (a, b) => a.position - b.position,
  );
  // Sinf darajalari umumiy - har sinfga (shu jumladan o'quvchining sinfiga) qo'llanadi
  const classTiers = [...(season.classTiers || [])].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div className="space-y-5">
      {/* Asosiy ko'rsatkichlar - 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <Stat
          icon={ListChecks}
          label="O'rtacha ball"
          value={formatScore(averageScore)}
          highlight
        />
        <Stat
          icon={Trophy}
          label="Umumiy o'rin"
          value={stats?.rank ? `#${stats.rank}` : "-"}
        />
        <Stat
          icon={Award}
          label="Sinfdagi o'rin"
          value={stats?.classRank ? `#${stats.classRank}` : "-"}
        />
        <Stat
          icon={ListChecks}
          label="Topshirgan / Biriktirilgan"
          value={`${stats?.resultCount || 0} / ${stats?.assignedCount || 0}`}
        />
      </div>

      {/* Mukofotlar */}
      <RewardsCard
        title="Maktab bo'yicha mukofotlar"
        tiers={schoolTiers}
        myPosition={stats?.rank}
      />
      <RewardsCard
        title="Sinf bo'yicha mukofotlar"
        tiers={classTiers}
        myPosition={stats?.classRank}
      />
    </div>
  );
};

/**
 * "Sinf" tab: o'quvchi o'ziga biriktirilgan sinflardan birini tanlab,
 * shu sinf bo'yicha reytingni ko'radi.
 */
const ClassStandingsTab = ({ seasonId, myId, classes }) => {
  const classOptions = useMemo(
    () => classes.map((c) => ({ value: c.id, label: c.name })),
    [classes],
  );

  const [selectedClassId, setSelectedClassId] = useState(
    classes[0]?.id || "",
  );

  const { data: rows = [], isLoading } = useQuery(
    testsQueries.seasonClassStandings(seasonId, selectedClassId),
  );

  if (classes.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center py-10 text-center">
          <BarChart3 size={36} className="text-gray-300" />
          <p className="mt-2 text-gray-600">
            Sizga biriktirilgan sinflar yo'q.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 max-w-xs">
        <SelectField
          label="Sinf"
          value={selectedClassId}
          onChange={setSelectedClassId}
          options={classOptions}
          searchable={classOptions.length > 6}
          placeholder="Sinfni tanlang"
          searchPlaceholder="Sinfni qidirish..."
          emptyText="Sinf topilmadi"
          triggerClassName="w-full"
        />
      </div>

      <StandingsTable rows={rows} myId={myId} isLoading={isLoading} isClass />
    </Card>
  );
};

/**
 * "Maktab" tab: butun maktab bo'yicha reyting.
 */
const SchoolStandingsTab = ({ seasonId, myId }) => {
  const { data: rows = [], isLoading } = useQuery(
    testsQueries.seasonSchoolStandings(seasonId),
  );

  return (
    <Card>
      <StandingsTable rows={rows} myId={myId} isLoading={isLoading} />
    </Card>
  );
};

/**
 * Reyting jadvali. O'quvchi o'z qatorini ajratilgan holda ko'radi.
 */
const StandingsTable = ({ rows, myId, isLoading, isClass = false }) => {
  if (isLoading) {
    return <p className="text-center text-gray-500 py-8">Yuklanmoqda...</p>;
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <BarChart3 size={36} className="text-gray-300" />
        <p className="mt-2 text-gray-600">Hozircha natijalar yo'q</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-600">
            <th className="py-2 px-3 font-medium w-12">#</th>
            <th className="py-2 px-3 font-medium">O'quvchi</th>
            <th className="py-2 px-3 font-medium">O'rtacha ball</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isMe = myId && r.student.id === myId;
            return (
              <tr
                key={r.student.id}
                className={cn(
                  "border-b",
                  isMe ? "bg-blue-50 font-medium" : "hover:bg-gray-50",
                )}
              >
                <td className="py-2.5 px-3 text-gray-500">
                  {isClass ? r.classRank : r.rank}
                </td>
                <td className="py-2.5 px-3 text-gray-900">
                  {r.student.firstName} {r.student.lastName}
                  {isMe && (
                    <span className="ml-1 text-xs text-blue-600">(siz)</span>
                  )}
                </td>
                <td className="py-2.5 px-3 font-semibold text-blue-700">
                  {formatScore(r.averageScore)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/**
 * O'rin-asosidagi mukofotlar ro'yxati. O'quvchining joriy o'rni ajratiladi.
 */
const RewardsCard = ({ title, tiers, myPosition }) => {
  if (!tiers || tiers.length === 0) return null;
  return (
    <Card title={title}>
      <div className="space-y-2 mt-3">
        {tiers.map((tier, idx) => {
          const isMine = myPosition && myPosition === tier.position;
          return (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                isMine ? "bg-green-50 ring-1 ring-green-200" : "bg-gray-50",
              )}
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-medium",
                    isMine ? "text-green-900" : "text-gray-700",
                  )}
                >
                  {tier.position}-o'rin
                  {isMine && (
                    <span className="ml-1 text-xs text-green-600">(siz)</span>
                  )}
                </p>
                {tier.note && (
                  <p className="text-xs text-gray-600 truncate">{tier.note}</p>
                )}
              </div>
              <span className="flex items-center gap-1 font-semibold text-amber-600 shrink-0">
                <Coins size={15} />+{tier.coinReward}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Stat = ({ icon, label, value, highlight = false }) => {
  const Icon = icon;
  return (
    <div
      className={cn(
        "p-3 rounded-xl flex items-center gap-3",
        highlight ? "bg-blue-50" : "bg-gray-50",
      )}
    >
      <Icon
        size={20}
        className={highlight ? "text-blue-600" : "text-gray-500"}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600 truncate">{label}</p>
        <p
          className={cn(
            "font-bold",
            highlight ? "text-blue-900" : "text-gray-900",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default StudentStatsView;
