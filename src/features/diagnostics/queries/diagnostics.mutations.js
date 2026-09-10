// TanStack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { diagnosticsAPI } from "../api/diagnostics.api";

// Keys
import { diagnosticsKeys } from "./diagnostics.queries";

/** Urinishni boshlash (yoki tugallanmaganini davom ettirish). */
export const useStartDiagnostic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => diagnosticsAPI.start(data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: diagnosticsKeys.all }),
  });
};

/**
 * "Zaif mavzularni mashq qilish".
 *
 * ⚠️ MAVZULARNI MIJOZ TANLAMAYDI — faqat fan yuboriladi, zaif mavzular
 * ro'yxatini SERVER hisoblaydi. Aks holda o'quvchi so'rov tanasiga
 * o'ziga qulay mavzuni yozib, "mashq" nomi ostida oson savollarni
 * olaverardi.
 */
export const usePracticeWeakTopics = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ subjectId, questionCount = 15 }) =>
      diagnosticsAPI
        .start({ mode: "practice", focusWeak: true, subjectId, questionCount })
        .then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: diagnosticsKeys.all }),
  });
};

/**
 * Bitta javobni saqlash.
 *
 * ⚠️ KESHNI YANGILAMAYDI. Javob har tanlashda ketadi va bu yerda
 * `invalidateQueries` chaqirilsa, butun urinish qayta yuklanib, ekrandagi
 * savol "sakrab" ketardi. Adaptiv rejimda keyingi savol javobning O'ZIDA
 * qaytadi — qayta so'rashning hojati yo'q.
 */
export const useSaveDiagnosticAnswer = () =>
  useMutation({
    mutationFn: ({ attemptId, questionId, data }) =>
      diagnosticsAPI.saveAnswer(attemptId, questionId, data).then((r) => r.data.data),
  });

export const useSubmitDiagnostic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ attemptId, data }) =>
      diagnosticsAPI.submit(attemptId, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: diagnosticsKeys.all }),
  });
};

/** "Nega xato?" — natija sahifasida savol ochilganda so'raladi. */
export const useExplainDiagnosticAnswer = () =>
  useMutation({
    mutationFn: ({ attemptId, questionId }) =>
      diagnosticsAPI.explain(attemptId, questionId).then((r) => r.data.data),
  });
