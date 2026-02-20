import http from "@/shared/api/http";

export const statisticsAPI = {
  getStudentWeekly: (studentId) =>
    http.get(`/api/statistics/weekly/current/${studentId}`),
};
