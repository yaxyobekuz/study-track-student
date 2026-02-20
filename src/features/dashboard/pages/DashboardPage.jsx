// TanStack Query
import { useQuery } from "@tanstack/react-query";

// Icons
import { Users, Award, School, BarChart2 } from "lucide-react";

// Components
import Card from "@/shared/components/ui/Card";
import StoriesPanel from "../components/StoriesPanel";
import LoaderCard from "@/shared/components/ui/LoaderCard";
import BottomNavbar from "@/shared/components/ui/BottomNavbar";

// API
import { authAPI } from "@/features/auth/api/auth.api";
import { statisticsAPI } from "@/features/dashboard/api/statistics.api";

const DashboardPage = () => {
  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <div className="container pt-5 space-y-5">
        {/* Top */}
        <h1 className="text-blue-500 font-bold text-xl">MBSI School</h1>

        {/* Stories Panel */}
        <StoriesPanel />

        {/* Student Weekly Stats */}
        <StudentWeeklyStats />
      </div>

      {/* Navbar */}
      <BottomNavbar />
    </div>
  );
};

const StudentWeeklyStats = () => {
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
    enabled: Boolean(studentId),
  });

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-5">
        <LoaderCard className="h-96" />
        <LoaderCard className="h-96" />
      </div>
    );
  }

  // Error
  if (isError || !data) return null;

  const { simpleStats, rankings } = data;

  // Content
  return (
    <div className="space-y-5">
      <Card title="Reyting" className="space-y-4 xs:space-y-5">
        <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-green-600" />
            <h4 className="text-sm font-medium text-gray-700 sm:text-base">
              Umumiy Ball
            </h4>
          </div>

          <p className="font-semibold text-green-600 xs:text-lg sm:font-bold sm:text-xl md:text-2xl lg:text-3xl">
            {simpleStats?.totalSum ?? 0}
          </p>
        </div>

        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <BarChart2 className="size-5 text-blue-600" />
            <h4 className="text-sm font-medium text-gray-700 sm:text-base">
              Jami Baholar
            </h4>
          </div>

          <p className="font-semibold text-blue-600 xs:text-lg sm:font-bold sm:text-xl md:text-2xl lg:text-3xl">
            {simpleStats?.totalGrades ?? 0}
          </p>
        </div>

        {rankings?.schoolRank && (
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-2">
              <School className="size-5 text-purple-600" />
              <h4 className="text-sm font-medium text-gray-700 sm:text-base">
                Maktabdagi reyting
              </h4>
            </div>

            <p className="font-semibold text-purple-600 xs:text-lg sm:font-bold sm:text-xl md:text-2xl lg:text-3xl">
              {rankings.schoolRank} / {rankings.schoolTotalStudents}
            </p>
          </div>
        )}

        {rankings?.classRanks?.map((classRank) => (
          <div
            key={classRank.class?._id || classRank.class?.name}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="flex items-center gap-2">
              <Users className="size-5 text-purple-600" />
              <h4 className="text-sm font-medium text-gray-700 sm:text-base">
                {classRank.class?.name}
              </h4>
            </div>

            <p className="font-semibold text-purple-600 xs:text-lg sm:font-bold sm:text-xl md:text-2xl lg:text-3xl">
              {classRank.rank} / {classRank.totalStudents}
            </p>
          </div>
        ))}
      </Card>

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

export default DashboardPage;
