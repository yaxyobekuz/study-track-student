// Shared
import http from "@/shared/api/http";

/**
 * O'quvchining o'z davomati. O'quvchi tokendan aniqlanadi — `studentId`
 * so'rovda uzatilmaydi, shuning uchun boshqaning davomatini ko'rib bo'lmaydi.
 */
export const attendanceAPI = {
  /** `params`: `{ month: 1..12, year }`; berilmasa server joriy oyni oladi. */
  getMyMonth: (params) => http.get("/api/student-attendance/my", { params }),
};
