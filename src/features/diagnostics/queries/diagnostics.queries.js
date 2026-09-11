// TanStack Query
import { queryOptions } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { diagnosticsAPI } from "../api/diagnostics.api";

export const diagnosticsKeys = createQueryKeys("diagnostics");

export const diagnosticsQueries = {
  /** O'quvchiga ochiq diagnostika testlari. */
  availableTests: () =>
    queryOptions({
      queryKey: [...diagnosticsKeys.all, "available"],
      queryFn: () => diagnosticsAPI.availableTests().then((r) => r.data.data),
    }),

  /**
   * Boshqaruv paneli.
   *
   * ⚠️ `staleTime` QO'YILGAN: bu ekran har kirganda qayta hisoblanadigan
   * og'ir so'rov (oxirgi 50 urinishning barcha javoblari). Test
   * topshirilgandan keyin kesh `useSubmitDiagnostic` orqali baribir
   * bekor qilinadi, ya'ni eskirgan raqam ko'rinib qolmaydi.
   */
  dashboard: () =>
    queryOptions({
      queryKey: [...diagnosticsKeys.all, "dashboard"],
      // ⚠️ RO'YXAT MAYDONLARI MASSIVGA KELTIRILADI. Bu javob uchta ekranni
      // (bosh sahifa, profil, diagnostika tabi) boqadi va ularning
      // hammasi `filter`/`map` chaqiradi — bitta noto'g'ri turdagi maydon
      // uchala ekranni birdan yiqitardi.
      queryFn: () =>
        diagnosticsAPI.dashboard().then((r) => {
          const data = r.data?.data ?? {};
          const list = (value) => (Array.isArray(value) ? value : []);
          return {
            ...data,
            summary: data.summary ?? {},
            trend: list(data.trend),
            subjects: list(data.subjects),
            strongTopics: list(data.strongTopics),
            weakTopics: list(data.weakTopics),
          };
        }),
      staleTime: 60 * 1000,
    }),

  /**
   * O'z urinishlari tarixi.
   *
   * ⚠️ HAR DOIM MASSIV QAYTARADI. Iste'molchilar (`filter`, `map`,
   * `reduce`) massivga tayanadi; javob kutilgan shaklda kelmasa
   * (masalan server va panel versiyalari mos kelmay qolsa), ilgari
   * `attempts.filter is not a function` bilan butun sahifa oq bo'lib
   * qolardi. Shaklni BITTA joyda — shu yerda — tekshiramiz.
   */
  myAttempts: (limit) =>
    queryOptions({
      queryKey: [...diagnosticsKeys.all, "my-attempts", limit ?? null],
      queryFn: () =>
        diagnosticsAPI.myAttempts(limit).then((r) => {
          const rows = r.data?.data;
          if (Array.isArray(rows)) return rows;
          console.warn("[diagnostics] my-attempts massiv emas:", rows);
          return [];
        }),
    }),

  /**
   * Davom etayotgan urinish.
   *
   * ⚠️ KESHLANMAYDI (`staleTime: 0`, `gcTime: 0`). Test topshirilayotgan
   * paytda eski nusxani ko'rsatish — o'quvchiga allaqachon javob berilgan
   * savolni qayta ko'rsatish degani; adaptiv rejimda esa umuman boshqa
   * savol chiqib qolardi.
   */
  active: (attemptId) =>
    queryOptions({
      queryKey: [...diagnosticsKeys.all, "active", attemptId],
      queryFn: () => diagnosticsAPI.active(attemptId).then((r) => r.data.data),
      enabled: Boolean(attemptId),
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: false,
    }),

  /** Natija. */
  result: (attemptId) =>
    queryOptions({
      queryKey: [...diagnosticsKeys.all, "result", attemptId],
      queryFn: () => diagnosticsAPI.result(attemptId).then((r) => r.data.data),
      enabled: Boolean(attemptId),
    }),

  /**
   * AI tahlili — fonda tayyorlanadi.
   *
   * ⚠️ POLLING TAYYOR BO'LGACH TO'XTAYDI va BO'SH RO'YXATDA UMUMAN
   * BOSHLANMAYDI: tahlil so'ralmagan urinishda qator bo'lmaydi va
   * cheksiz so'rov yuborish bekorga trafik sarflardi.
   */
  insights: (attemptId) =>
    queryOptions({
      queryKey: [...diagnosticsKeys.all, "insights", attemptId],
      queryFn: () => diagnosticsAPI.insights(attemptId).then((r) => r.data.data),
      enabled: Boolean(attemptId),
      refetchInterval: (query) => {
        const rows = query.state.data;
        if (!Array.isArray(rows) || rows.length === 0) return false;
        const pending = rows.some((row) =>
          ["queued", "processing"].includes(row.status),
        );
        return pending ? 3000 : false;
      },
    }),
};
