import http from "@/shared/api/http";

/**
 * DIAGNOSTIKA — O'QUVCHI TOMONI.
 *
 * ⚠️ ALOHIDA KIRISH YO'Q. Diagnostika tizimning bir bo'limi: token
 * `http.js` interceptor'i orqali qo'shiladi va u panelga kirishda olingan
 * o'sha token.
 *
 * ⚠️ YO'LLAR `/api` PREFIKSI BILAN. Bu panelda `VITE_API_URL` server
 * ILDIZINI ko'rsatadi (admin panelda esa `/api` gacha) — shuning uchun
 * prefiks har bir chaqiruvda yoziladi, xuddi qolgan API fayllaridagidek.
 * Adashilsa so'rov `/api/api/...` ga ketadi va 404 qaytadi.
 *
 * ⚠️ BU YERDA FAQAT O'QUVCHI YO'LLARI. Ular serverda RUXSAT talab
 * qilmaydi (faqat `protect`) va HAR DOIM `req.user.id` bilan ishlaydi —
 * boshqa o'quvchining ma'lumotini so'rash imkoni yo'q. Savollar banki,
 * boshqa o'quvchilarning natijalari va tahlil bu paneldan UMUMAN
 * ochilmaydi.
 */
export const diagnosticsAPI = {
  /** O'quvchiga ochiq diagnostika testlari. */
  availableTests: () => http.get("/api/diagnostic-tests/me"),

  /**
   * Boshqaruv paneli — fanlar kesimi, kuchli/zaif mavzular va tavsiya.
   *
   * ⚠️ BITTA CHAQIRUV. Ekrandagi barcha bloklar AYNI to'plamdan
   * hisoblanadi; bo'lib yuborilsa, bloklar bir-biriga zid raqam
   * ko'rsatib qolardi.
   */
  dashboard: () => http.get("/api/diagnostic-attempts/me/dashboard"),

  /** O'z urinishlari tarixi. */
  myAttempts: (limit) => http.get("/api/diagnostic-attempts/me", { params: { limit } }),

  /**
   * Urinishni boshlash yoki tugallanmaganini davom ettirish.
   * Server tugallanmagan urinish bo'lsa O'SHANI qaytaradi — ikkinchi
   * urinish ochilmaydi va limit behuda sarflanmaydi.
   */
  start: (data) => http.post("/api/diagnostic-attempts/start", data),

  /** Davom etayotgan urinish (savollar — javob kalitisiz). */
  active: (attemptId) => http.get(`/api/diagnostic-attempts/${attemptId}/active`),

  /**
   * Bitta javobni saqlash.
   * Adaptiv rejimda javob KEYINGI SAVOLNI ham qaytaradi.
   */
  saveAnswer: (attemptId, questionId, data) =>
    http.put(`/api/diagnostic-attempts/${attemptId}/answers/${questionId}`, data),

  /** Urinishni yakunlash. */
  submit: (attemptId, data) =>
    http.post(`/api/diagnostic-attempts/${attemptId}/submit`, data),

  /** Natija (server `showAnswers` sozlamasiga qarab kalitni beradi yoki bermaydi). */
  result: (attemptId) => http.get(`/api/diagnostic-attempts/${attemptId}/result`),

  /**
   * Natijani Excel'ga yuklab olish.
   *
   * ⚠️ `responseType: "blob"` MAJBURIY — usiz axios javobni matn deb
   * o'qib, ikkilik faylni buzib qo'yardi.
   */
  exportResult: (attemptId) =>
    http.get(`/api/diagnostic-attempts/${attemptId}/result/export`, {
      responseType: "blob",
    }),

  /** AI tahlili — fonda tayyorlanadi, tayyor bo'lguncha so'rab turiladi. */
  insights: (attemptId) => http.get(`/api/diagnostic-attempts/${attemptId}/insights`),

  /** "Nega xato?" — bitta savol uchun izoh (natija keshlanadi). */
  explain: (attemptId, questionId) =>
    http.post(`/api/diagnostic-attempts/${attemptId}/questions/${questionId}/explain`),
};
