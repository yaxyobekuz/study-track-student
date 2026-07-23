// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { statisticsAPI } from "@/features/dashboard/api/statistics.api";

export const dashboardKeys = createQueryKeys("statistics");

export const dashboardQueries = {
  /**
   * The current student's weekly stats (current week) powering the dashboard's
   * "Haftalik statistika" card. Unwraps to `data.data` or `null`.
   */
  studentWeekly: (studentId) =>
    queryOptions({
      queryKey: [...dashboardKeys.all, "student-weekly", studentId],
      queryFn: () =>
        statisticsAPI.getStudentWeekly(studentId).then((res) => res.data?.data || null),
    }),
};
