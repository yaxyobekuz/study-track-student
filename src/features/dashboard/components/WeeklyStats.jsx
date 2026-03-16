// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Icons
import { Users, Award, BarChart2 } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import List from "@/shared/components/ui/List";
import Counter from "@/shared/components/ui/Counter";
import LoaderCard from "@/shared/components/ui/LoaderCard";

// API
import { authAPI } from "@/features/auth/api/auth.api";
import { statisticsAPI } from "@/features/dashboard/api/statistics.api";

const WeeklyStats = () => {
  const { data: me } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const studentId = me?._id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["statistics", "student-weekly", studentId],
    queryFn: () =>
      statisticsAPI
        .getStudentWeekly(studentId)
        .then((res) => res.data?.data || null),
  });

  // Loading
  if (isLoading) return <LoaderCard className="h-96" />;

  // Error
  if (isError || !data) return null;

  const { simpleStats, rankings } = data;

  // Content
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Haftalik statistika</h2>

      <List
        items={[
          {
            icon: Award,
            gradientTo: "to-lime-700",
            title: "Umumiy Ball",
            gradientFrom: "from-lime-300",
            trailing: (
              <Counter
                value={simpleStats?.totalSum ?? 0}
                className="font-semibold text-lime-600 xs:text-lg sm:font-bold sm:text-xl md:text-2xl"
              />
            ),
          },
          {
            icon: BarChart2,
            gradientTo: "to-emerald-700",
            title: "Jami Baholar",
            gradientFrom: "from-emerald-300",
            trailing: (
              <Counter
                value={simpleStats?.totalGrades ?? 0}
                className="font-semibold text-emerald-600 xs:text-lg sm:font-bold sm:text-xl md:text-2xl"
              />
            ),
          },
        ]}
      />

      {/* School & Clasess stats */}
      <List
        items={[
          {
            icon: Award,
            gradientTo: "to-cyan-700",
            title: "Maktabdagi reyting",
            gradientFrom: "from-cyan-300",
            trailing: (
              <p className="font-semibold text-cyan-600 xs:text-lg sm:font-bold sm:text-xl md:text-2xl">
                <Counter value={rankings.schoolRank} /> /{" "}
                <Counter value={rankings.schoolTotalStudents} />
              </p>
            ),
          },
          ...(rankings?.classRanks.length
            ? rankings?.classRanks.map((classRank) => ({
                icon: Users,
                gradientTo: "to-sky-700",
                title: classRank.class?.name,
                gradientFrom: "from-sky-300",
                trailing: (
                  <p className="font-semibold text-sky-600 xs:text-lg sm:font-bold sm:text-xl md:text-2xl">
                    <Counter value={classRank.rank} /> /{" "}
                    <Counter value={classRank.totalStudents} />
                  </p>
                ),
              }))
            : []),
        ]}
      />

      <Card title="Baholar" className="space-y-4 xs:space-y-5">
        {!simpleStats?.subjects?.length ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Fanlar bo'yicha baholar topilmadi
          </p>
        ) : (
          <>
            {simpleStats.subjects.map((subject, index) => (
              <div
                key={subject.subject?._id || index}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {subject.subject?.name}
                  </h3>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {subject.sum}
                    </p>

                    <p className="text-xs text-gray-500">
                      {subject.count} ta baho
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 flex-wrap">
                  {subject.grades?.map((grade, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-semibold ${
                        grade === 5
                          ? "bg-green-100 text-green-800"
                          : grade === 4
                            ? "bg-blue-100 text-blue-800"
                            : grade === 3
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {grade}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </Card>
    </div>
  );
};

export default WeeklyStats;
