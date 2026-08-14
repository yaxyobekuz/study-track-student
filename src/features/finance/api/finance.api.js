// Shared
import http from "@/shared/api/http";

/**
 * O'quvchining o'z moliyaviy ma'lumoti — loyihaning O'Z serveridan.
 *
 * Ilgari bu yerda alohida `moliaHttp` instansi bor edi: u boshqa bazaga
 * (MBSI Molia) autentifikatsiyasiz ulanib, o'quvchini ISM bo'yicha qidirardi.
 * Endi ma'lumot shu tizimning o'zidan keladi va o'quvchi tokendan aniqlanadi —
 * `studentId` so'rovda umuman uzatilmaydi, shuning uchun boshqaning qarzini
 * ko'rish imkoni yo'q.
 */
export const financeAPI = {
  getMyFinance: (params) => http.get("/api/invoices/my", { params }),
};
