import http from "@/shared/api/http";

export const tasksAPI = {
  // O'z topshiriqlari
  getMy: (params) => http.get("/api/tasks/my", { params }),

  // Bitta topshiriq tafsilotlari
  getById: (id) => http.get(`/api/tasks/${id}`),

  // Topshiriqni bajarildi deb belgilash (multipart/form-data)
  submitCompletion: (id, formData) =>
    http.put(`/api/tasks/${id}/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
