// TanStack Query
import { queryOptions, keepPreviousData } from "@tanstack/react-query";

// Shared
import { createQueryKeys } from "@/shared/lib/query";

// API
import { tasksAPI } from "../api/tasks.api";

export const tasksKeys = createQueryKeys("tasks");

export const tasksQueries = {
  /**
   * The current student's own tasks, filtered by TIME STATE (done / missed /
   * active / …) rather than raw status — the executor's list is about "what
   * must I do now", not about internal statuses.
   *
   * ⚠️ Filtered ON THE SERVER (`state` param): filtering a paginated list in
   * memory would make the 21st task look like it does not exist.
   *
   * The response also carries `submissionRules`, so the list can open the
   * submit sheet without a second request.
   *
   * @param {{ page: number, state?: string }} params
   */
  my: ({ page = 1, state = "all" } = {}) =>
    queryOptions({
      queryKey: [...tasksKeys.all, "my", page, state],
      queryFn: () => {
        const params = { page, limit: 20, sort: "due_asc" };
        if (state && state !== "all") params.state = state;
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
