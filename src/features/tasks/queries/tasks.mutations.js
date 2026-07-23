// TanStack Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { tasksAPI } from "../api/tasks.api";

// Keys
import { tasksKeys } from "./tasks.queries";

/**
 * Submit a task as completed for review (multipart/form-data). Invalidates the
 * task's own detail (["tasks", "detail", taskId]) and the student's own tasks
 * list (["tasks", "my"]) so both reflect the new status.
 */
export const useSubmitTaskCompletion = (taskId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => tasksAPI.submitCompletion(taskId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: [...tasksKeys.all, "my"] });
    },
  });
};
