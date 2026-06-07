import http from "@/shared/api/http";

// O'quvchi test sessiyasi (V3 — binding asosida).
export const studentTestSessionsAPI = {
  start: (bindingId) => http.post("/api/test-sessions", { bindingId }),
  getMy: (params = {}) => http.get("/api/test-sessions/my", { params }),
  getOne: (id) => http.get(`/api/test-sessions/${id}`),
  saveAnswer: (id, data) =>
    http.put(`/api/test-sessions/${id}/answers`, data),
  submit: (id) => http.post(`/api/test-sessions/${id}/submit`),
};
