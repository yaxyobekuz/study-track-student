import http from "@/shared/api/http";

export const penaltiesAPI = {
  // Sozlamalar
  getSettings: () => http.get("/api/penalties/settings"),

  // O'z jarimalari
  getMyPenalties: (params) => http.get("/api/penalties/my", { params }),

  // Kamaytirish paketlari
  getReductionPackages: () => http.get("/api/penalties/reduction-packages"),
  purchaseReductionPackage: (packageId) =>
    http.post("/api/penalties/reduction-packages/purchase", { packageId }),
};
