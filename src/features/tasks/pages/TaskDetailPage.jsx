// Toast
import { toast } from "sonner";

// React
import { useState } from "react";

// Router
import { useParams } from "react-router-dom";

// Tanstack Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API
import { tasksAPI } from "@/features/tasks/api/tasks.api";

// Data
import { taskStatusLabels, taskStatusColors, SUBMITTABLE_STATUSES } from "../data/tasks.data";

// Utils
import { formatUzDate } from "@/shared/utils/formatDate";

// Components
import Card from "@/shared/components/ui/Card";
import BackHeader from "@/shared/components/layout/BackHeader";

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const queryClient = useQueryClient();

  const [note, setNote] = useState("");
  const [files, setFiles] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const { data: task, isLoading } = useQuery({
    queryKey: ["tasks", "detail", taskId],
    queryFn: () => tasksAPI.getById(taskId).then((res) => res.data.data),
  });

  const submitMutation = useMutation({
    mutationFn: (formData) => tasksAPI.submitCompletion(taskId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "detail", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "my"] });
      setShowSubmitForm(false);
      setNote("");
      setFiles(null);
      toast.success("Topshiriq ko'rib chiqishga yuborildi");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Xatolik yuz berdi"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (note) formData.append("note", note);
    if (files) {
      for (const file of files) formData.append("files", file);
    }
    submitMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <BackHeader href="/tasks" title="Topshiriq" />
        <div className="container pt-8 text-center text-gray-400">
          Yuklanmoqda...
        </div>
      </div>
    );
  }

  if (!task) return null;

  const isOverdue =
    new Date(task.dueDate) < new Date() &&
    !["completed", "stopped"].includes(task.status);

  const canSubmit = SUBMITTABLE_STATUSES.includes(task.status);

  return (
    <div className="min-h-screen pb-28 bg-gray-100 animate__animated animate__fadeIn">
      <BackHeader href="/tasks" title="Topshiriq tafsilotlari" />

      <div className="container pt-4 space-y-3">
        {/* Status banner */}
        <div className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${taskStatusColors[task.status]}`}>
          {taskStatusLabels[task.status]}
        </div>

        {/* Main info */}
        <Card className="space-y-3">
          <h2 className="font-semibold text-gray-900 text-base">{task.title}</h2>
          {task.description && (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>
          )}
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Ijro muddati</span>
              <span className={isOverdue ? "text-red-600 font-semibold" : "text-gray-800"}>
                {formatUzDate(task.dueDate)}
                {isOverdue && <span className="ml-1 text-xs">(o'tgan)</span>}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Jarima bali</span>
              <span className="font-semibold text-red-600">{task.penaltyPoints} ball</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Yaratilgan</span>
              <span className="text-gray-600">{formatUzDate(task.createdAt)}</span>
            </div>
          </div>
        </Card>

        {/* Owner attachments */}
        {task.attachments?.length > 0 && (
          <Card>
            <p className="text-sm font-medium text-gray-700 mb-2">Topshiriq fayllari</p>
            <div className="space-y-2">
              {task.attachments.map((att, idx) => (
                <AttachmentItem key={idx} attachment={att} />
              ))}
            </div>
          </Card>
        )}

        {/* Completion info (already submitted) */}
        {(task.completionNote || task.completionAttachments?.length > 0) && (
          <Card>
            <p className="text-sm font-medium text-gray-700 mb-2">Mening yuborganlarim</p>
            {task.completionNote && (
              <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2">{task.completionNote}</p>
            )}
            {task.completionAttachments?.length > 0 && (
              <div className="space-y-2">
                {task.completionAttachments.map((att, idx) => (
                  <AttachmentItem key={idx} attachment={att} />
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Status history */}
        {task.statusHistory?.length > 0 && (
          <Card>
            <p className="text-sm font-medium text-gray-700 mb-3">Tarix</p>
            <div className="space-y-3">
              {task.statusHistory.map((entry, idx) => {
                const isSystem = !entry.changedBy;
                const authorName = isSystem
                  ? "Tizim"
                  : entry.changedBy?.lastName
                    ? `${entry.changedBy.firstName} ${entry.changedBy.lastName}`
                    : entry.changedBy?.firstName || "—";

                return (
                  <div key={idx} className="flex gap-2.5">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      {isSystem ? "T" : authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="text-xs font-medium text-gray-700">{authorName}</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${taskStatusColors[entry.status]}`}>
                          {taskStatusLabels[entry.status]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        {entry.reason}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatUzDate(entry.changedAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Deadline history */}
        {task.deadlineHistory?.length > 0 && (
          <Card>
            <p className="text-sm font-medium text-gray-700 mb-2">Muddat tarixi</p>
            <div className="space-y-2">
              {task.deadlineHistory.map((entry, idx) => (
                <div key={idx} className="text-xs bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-gray-400 line-through">{formatUzDate(entry.oldDueDate)}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium text-gray-700">{formatUzDate(entry.newDueDate)}</span>
                    {entry.withPenalty && (
                      <span className="ml-auto text-red-500">+{entry.penaltyPoints} ball</span>
                    )}
                  </div>
                  <p className="text-gray-500">{entry.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Submit completion */}
        {canSubmit && !showSubmitForm && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-sm"
          >
            Bajarildi deb belgilash
          </button>
        )}

        {canSubmit && showSubmitForm && (
          <Card>
            <p className="text-sm font-medium text-gray-700 mb-3">Topshiriqni yakunlash</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Izoh (ixtiyoriy)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Bajarilgan ish haqida qisqacha..."
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Fayllar (ixtiyoriy)</label>
                <input
                  multiple
                  type="file"
                  accept="image/*,video/mp4,video/webm,application/pdf"
                  onChange={(e) => setFiles(e.target.files)}
                  className="w-full text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm disabled:opacity-60"
                >
                  {submitMutation.isPending ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Status banners */}
        {task.status === "pending_review" && (
          <div className="text-center text-sm text-purple-600 bg-purple-50 rounded-xl py-3 px-4">
            Topshiriq tasdiqlanishini kutmoqda...
          </div>
        )}
        {task.status === "completed" && (
          <div className="text-center text-sm text-green-600 bg-green-50 rounded-xl py-3 px-4">
            Topshiriq muvaffaqiyatli yakunlandi!
          </div>
        )}
        {task.status === "stopped" && (
          <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-xl py-3 px-4">
            Topshiriq to'xtatildi.
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Biriktirma elementi
 * @param {Object} props
 * @param {Object} props.attachment - { url, type, originalName }
 */
const AttachmentItem = ({ attachment }) => {
  const { url, type, originalName } = attachment;

  if (type === "image") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={url}
          alt={originalName}
          className="w-full rounded-xl object-cover max-h-60"
        />
      </a>
    );
  }

  if (type === "video") {
    return (
      <video
        src={url}
        controls
        className="w-full rounded-xl max-h-60"
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-3 rounded-xl border text-sm text-blue-600"
    >
      {originalName || "Fayl yuklab olish"}
    </a>
  );
};

export default TaskDetailPage;
