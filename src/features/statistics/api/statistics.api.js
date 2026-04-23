import http from "@/shared/api/http";

export const statisticsAPI = {
  getStudentWeekly: (studentId) =>
    http.get(`/api/statistics/weekly/current/${studentId}`),

  getAllWeeklyStats: (studentId) =>
    http.get(`/api/statistics/weekly/student/${studentId}/all`),

  getSchoolRankings: (params) =>
    http.get("/api/statistics/weekly/school/rankings", { params }),

  getCoinLeaderboard: (params) =>
    http.get("/api/coins/leaderboard", { params }),
};
