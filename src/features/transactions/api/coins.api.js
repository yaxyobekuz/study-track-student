import http from "@/shared/api/http";

export const coinsAPI = {
  getBalance: () => http.get("/api/coins/balance"),
  getTransactions: (params) => http.get("/api/coins/transactions", { params }),
  /**
   * TANGA CHEKLOVI — o'quvchining O'Z holati (ruxsat kalitisiz, id tokendan).
   * Cheklov yashirin emas: tangasi to'xtagan o'quvchi sababini ko'rishi kerak,
   * aks holda u buni tizim nosozligi deb o'ylardi.
   */
  getMyBlock: () => http.get("/api/coins/blocks/my"),
};
