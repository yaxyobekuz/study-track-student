// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { statisticsAPI } from "@/features/statistics/api/statistics.api";

export const statisticsKeys = createQueryKeys("statistics");

export const statisticsQueries = {
  /**
   * The current student's weekly stats (current week). Used for the "my score"
   * highlight card on the scoreboard. Unwraps to `data.data` or `null`.
   */
  studentWeekly: (studentId) =>
    queryOptions({
      queryKey: [...statisticsKeys.all, "student-weekly", studentId],
      queryFn: () =>
        statisticsAPI.getStudentWeekly(studentId).then((res) => res.data?.data || null),
    }),

  /**
   * All weekly stats for a student (history), used to render the stats charts.
   * Unwraps to `data.data` or `[]`.
   */
  allWeekly: (studentId) =>
    queryOptions({
      queryKey: [...statisticsKeys.all, "all-weekly", studentId],
      queryFn: () =>
        statisticsAPI.getAllWeeklyStats(studentId).then((res) => res.data?.data ?? []),
    }),

  /**
   * Paginated school-wide weekly rankings. Returns the raw `{ data, pagination }`
   * envelope; keeps the previous page while the next loads.
   */
  schoolRankings: (page) =>
    queryOptions({
      queryKey: [...statisticsKeys.all, "school-rankings", page],
      queryFn: () =>
        statisticsAPI.getSchoolRankings({ page, limit: 50 }).then((res) => res.data),
      keepPreviousData: true,
    }),

  /**
   * Paginated coin leaderboard. Returns the raw `{ data, pagination }` envelope;
   * keeps the previous page while the next loads.
   */
  coinLeaderboard: (page) =>
    queryOptions({
      queryKey: [...statisticsKeys.all, "coin-leaderboard", page],
      queryFn: () =>
        statisticsAPI.getCoinLeaderboard({ page, limit: 50 }).then((res) => res.data),
      keepPreviousData: true,
    }),
};
