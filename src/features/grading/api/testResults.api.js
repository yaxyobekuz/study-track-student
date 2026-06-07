import http from "@/shared/api/http";

// Test natijalari — o'qituvchi (test muallifi) va o'quvchi (o'ziniki) uchun.
export const testResultsAPI = {
  getMy: (params = {}) => http.get("/api/test-results/my", { params }),
  getOne: (id) => http.get(`/api/test-results/${id}`),
  getByTest: (testId, params = {}) =>
    http.get(`/api/test-results/by-test/${testId}`, { params }),
  gradeOpenAnswer: (id, data) =>
    http.patch(`/api/test-results/${id}/grade`, data),
  addExtraPoints: (id, data) =>
    http.patch(`/api/test-results/${id}/extra-points`, data),
};

// Test sessiyalari — o'qituvchi (test muallifi) va o'quvchi (o'ziniki) uchun.
export const testSessionsAPI = {
  getByTest: (testId) => http.get(`/api/test-sessions/by-test/${testId}`),
  reopen: (data) => http.post("/api/test-sessions/reopen", data),
};
