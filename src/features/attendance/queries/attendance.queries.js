// TanStack Query
import { queryOptions, keepPreviousData } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { attendanceAPI } from "../api/attendance.api";

export const attendanceKeys = createQueryKeys("attendance");

export const attendanceQueries = {
  /**
   * Bitta oyning davomati: `{ records, summary, month, year }`.
   * Oy almashtirilganda oldingi oy ko'rinib turadi — sahifa sakramaydi.
   * Key: ["attendance", "my", monthKey]
   *
   * @param {number} monthKey - YYYYMM
   */
  myMonth: (monthKey) =>
    queryOptions({
      queryKey: [...attendanceKeys.all, "my", monthKey],
      queryFn: () =>
        attendanceAPI
          .getMyMonth({
            month: monthKey % 100,
            year: Math.trunc(monthKey / 100),
          })
          .then((res) => res.data),
      placeholderData: keepPreviousData,
    }),
};
