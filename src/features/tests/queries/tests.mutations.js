// TanStack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { studentTestSessionsAPI } from "@/features/tests/api/testSessions.api";

// Keys
import { testsKeys } from "./tests.queries";

/**
 * Save (upsert) a single answer inside an active test session.
 *
 * No cache invalidation — answers are held in local component state while the
 * test is in progress; the write is fire-and-forget persistence. The caller
 * owns the error UX (it inspects the message to decide whether to auto-finalize).
 */
export const useSaveAnswer = () => {
  return useMutation({
    mutationFn: ({ sessionId, questionId, payload }) =>
      studentTestSessionsAPI.saveAnswer(sessionId, {
        questionId,
        ...payload,
      }),
  });
};

/**
 * Submit a test session for grading. Invalidates the student's available-tests
 * cache (`["tests", "available"]`) and their results list (`["my-results"]`) so
 * both reflect the just-submitted attempt. Navigation/toast stay in the caller.
 */
export const useSubmitSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId) => studentTestSessionsAPI.submit(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...testsKeys.all, "available"] });
      qc.invalidateQueries({ queryKey: ["my-results"] });
    },
  });
};
