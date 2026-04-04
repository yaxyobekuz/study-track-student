// React
import { useState } from "react";

// Router
import { Link } from "react-router-dom";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// API
import { tasksAPI } from "@/features/tasks/api/tasks.api";

// Data
import {
  taskStatusLabels,
  taskStatusColors,
  taskStatusOptions,
} from "../data/tasks.data";

// Utils
import { formatUzDate } from "@/shared/utils/formatDate";

// Components
import Card from "@/shared/components/ui/Card";
import BackHeader from "@/shared/components/layout/BackHeader";

const MyTasksPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", "my", page, statusFilter],
    queryFn: () => {
      const params = { page, limit: 20 };
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;
      return tasksAPI.getMy(params).then((res) => res.data);
    },
  });

  const tasks = data?.data || [];
  const pagination = data?.pagination;

  const isOverdue = (dueDate, status) => {
    if (["completed", "stopped"].includes(status)) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/dashboard" title="Topshiriqlarim" />

      <div className="container pt-4 space-y-3">
        {/* Status filter */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 pb-1" style={{ minWidth: "max-content" }}>
            {taskStatusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setStatusFilter(opt.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        {isLoading ? (
          <Card className="text-center py-10">Yuklanmoqda...</Card>
        ) : tasks.length === 0 ? (
          <Card className="text-center py-10 text-gray-500">
            Topshiriqlar topilmadi
          </Card>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link key={task._id} to={`/tasks/${task._id}`}>
                <Card className="space-y-2 transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900 leading-snug">
                      {task.title}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap flex-shrink-0 ${taskStatusColors[task.status]}`}
                    >
                      {taskStatusLabels[task.status]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Jarima: {task.penaltyPoints} ball</span>
                    <span
                      className={
                        isOverdue(task.dueDate, task.status)
                          ? "text-red-500 font-medium"
                          : ""
                      }
                    >
                      {formatUzDate(task.dueDate)}
                      {isOverdue(task.dueDate, task.status) &&
                        " (muddati o'tgan)"}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 text-sm">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 rounded-md bg-white disabled:opacity-50"
            >
              Oldingi
            </button>
            <span className="text-gray-500">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 rounded-md bg-white disabled:opacity-50"
            >
              Keyingi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasksPage;
