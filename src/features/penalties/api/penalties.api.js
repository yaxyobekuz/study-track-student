import http from "@/shared/api/http";

export const penaltiesAPI = {
  // Sozlamalar
  getSettings: () => http.get("/api/penalties/settings"),

  // O'z jarimalari
  getMyPenalties: (params) => http.get("/api/penalties/my", { params }),
};
