import http from "@/shared/api/http";

export const certificatesAPI = {
  /**
   * O'quvchining O'Z sertifikat rejalari.
   *
   * ⚠️ Kalitsiz yo'l: `studentId` TOKENDAN olinadi, so'rovdan EMAS.
   * Javobda forma to'ldirilgan vaqt (`submittedAt`) YO'Q — u faqat
   * ma'muriyatga ko'rinadi.
   */
  getMy: () => http.get("/api/certificates/my"),
};
