import http from "@/shared/api/http";

// Testlar (V3) - mavsumdan mustaqil, sof savol konteyneri.
export const testsAPI = {
  getAll: (params = {}) => http.get("/api/tests", { params }),
  getOne: (id) => http.get(`/api/tests/${id}`),
  create: (data) => http.post("/api/tests", data),
  update: (id, data) => http.put(`/api/tests/${id}`, data),
  delete: (id) => http.delete(`/api/tests/${id}`),
};

// Test ichidagi savollar.
export const testQuestionsAPI = {
  getAll: (testId) => http.get(`/api/tests/${testId}/questions`),
  create: (testId, formData) =>
    http.post(`/api/tests/${testId}/questions`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    http.put(`/api/questions/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => http.delete(`/api/questions/${id}`),
  reorder: (testId, orderedIds) =>
    http.patch(`/api/tests/${testId}/questions/reorder`, { orderedIds }),
};

// AI yordamida savol generatsiyasi (prompt yoki fayl orqali).
export const testAiAPI = {
  generate: (testId, formData) =>
    http.post(`/api/tests/${testId}/questions/ai-generate`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Test biriktiruvlari (V3 yangi).
export const testBindingsAPI = {
  getForTest: (testId) => http.get(`/api/tests/${testId}/bindings`),
  create: (testId, data) => http.post(`/api/tests/${testId}/bindings`, data),
  update: (id, data) => http.put(`/api/bindings/${id}`, data),
  publish: (id) => http.patch(`/api/bindings/${id}/publish`),
  close: (id) => http.patch(`/api/bindings/${id}/close`),
  delete: (id) => http.delete(`/api/bindings/${id}`),
  reopen: (id, studentId) =>
    http.post(`/api/bindings/${id}/reopen`, { studentId }),
  getAvailable: () => http.get("/api/bindings/available"),
};
