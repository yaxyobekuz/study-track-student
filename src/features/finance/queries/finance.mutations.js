// TanStack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { financeAPI } from "../api/finance.api";

// Keys
import { financeKeys } from "./finance.queries";

/**
 * Submit an online payment request (with a receipt image) for a student's debt.
 *
 * Own keys (literal, name-scoped): ["molia","finance",studentName] — refreshes
 * that student's finance snapshot so the new pending request shows up. Built
 * from `financeKeys.all` (["molia"]) to stay byte-identical to the inline key.
 * Toast/close stay in the component (passed as onSuccess/onError callbacks).
 */
export const useCreatePaymentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, studentId, amount, card, receipt }) =>
      financeAPI.createPaymentRequest({
        name,
        studentId,
        amount,
        card,
        receipt,
      }),
    onSuccess: (_data, { name }) => {
      queryClient.invalidateQueries({
        queryKey: [...financeKeys.all, "finance", name],
      });
    },
  });
};
