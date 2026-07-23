// TanStack Query
import { queryOptions, keepPreviousData } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { tasksAPI } from "../api/tasks.api";

export const tasksKeys = createQueryKeys("tasks");

export const tasksQueries = {
  /**
   * The current student's own tasks. Optionally filtered by status.
   * Paginated `{ data, pagination }`; keeps the previous page while the next
   * loads.
   * Key: ["tasks", "my", page, statusFilter]
   */
  my: (page, statusFilter) =>
    queryOptions({
      queryKey: [...tasksKeys.all, "my", page, statusFilter],
      queryFn: () => {
        const params = { page, limit: 20 };
        if (statusFilter && statusFilter !== "all") params.status = statusFilter;
        return tasksAPI.getMy(params).then((res) => res.data);
      },
      placeholderData: keepPreviousData,
    }),

  /**
   * A single task with its full detail (history, attachments, completion).
   * Returns the unwrapped task; disabled until an id is present.
   * Key: ["tasks", "detail", taskId]
   */
  detail: (id) =>
    queryOptions({
      queryKey: tasksKeys.detail(id),
      queryFn: () => tasksAPI.getById(id).then((res) => res.data.data),
      enabled: Boolean(id),
    }),
};
