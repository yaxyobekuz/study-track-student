import http from "@/shared/api/http";

/**
 * OLIMPIADA VA MUSOBAQA YUTUQLARI — O'QUVCHI TOMONI.
 *
 * ⚠️ FAQAT `/me`. Umumiy ro'yxat (`/education/achievements`)
 * `achievements.view` ruxsati ortida va o'quvchiga 403 qaytaradi —
 * bu yerdan boshqa o'quvchining yutuqlarini so'rash imkoni yo'q.
 * `studentId` serverda MAJBURAN `req.user.id` ga almashtiriladi.
 *
 * ⚠️ Yo'l `/api` prefiksi bilan: bu panelda `VITE_API_URL` server
 * ILDIZINI ko'rsatadi.
 */
export const achievementsAPI = {
  mine: (limit) =>
    http.get("/api/education/achievements/me", { params: { limit } }),
};
