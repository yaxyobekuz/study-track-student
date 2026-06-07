import http from "@/shared/api/http";

// Mavsumlar — o'qituvchi va o'quvchi uchun faqat faollarini o'qish kerak.
export const testSeasonsAPI = {
  getActive: () => http.get("/api/test-seasons/active"),
  getStats: (id, params = {}) =>
    http.get(`/api/test-seasons/${id}/stats`, { params }),
  getClassStats: (id, classId) =>
    http.get(`/api/test-seasons/${id}/class/${classId}/stats`),
  getMyStats: (id) => http.get(`/api/test-seasons/${id}/my-stats`),
  setClassTiers: (id, classId, tiers) =>
    http.put(`/api/test-seasons/${id}/class/${classId}/tiers`, { tiers }),
  getOne: (id) => http.get(`/api/test-seasons/${id}`).catch(() => null),
};
