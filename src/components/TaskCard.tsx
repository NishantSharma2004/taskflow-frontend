import { useState } from "react";
import { Task } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Clock, Trash2, Bell, Pencil } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { EditTaskDialog } from "@/components/EditTaskDialog";

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  High:   "destructive",
  Medium: "default",
  Low:    "secondary",
};

const categoryColors: Record<string, string> = {
  Study:    "bg-primary/10 text-primary",
  Work:     "bg-warning/10 text-warning",
  Personal: "bg-success/10 text-success",
  Health:   "bg-destructive/10 text-destructive",
};

const reminderLabel = (mins?: number) => {
  if (!mins || mins === 0) return null;
  if (mins === 60) return "1h before";
  return `${mins}m before`;
};

export function TaskCard({ task }: { task: Task }) {
  const { editTask, removeTask } = useTasks();
  const [editOpen, setEditOpen] = useState(false);

  const id          = task.id || task._id || "";
  const isCompleted = task.status === "completed";
  const reminder    = reminderLabel(task.reminderMinutes);

  return (
    <>
      <div className={`group rounded-lg border bg-card p-4 transition-all hover:shadow-md animate-fade-in ${isCompleted ? "opacity-60" : ""}`}>
        <div className="flex items-start justify-between gap-3">

          {/* ── Left: content ── */}
          <div className="flex-1 min-w-0">
            <p className={`font-medium truncate ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {task.name}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[task.category] || ""}`}>
                {task.category}
              </span>
              <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>

              {task.startTime && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.startTime} – {task.endTime}
                </span>
              )}

              {reminder && !isCompleted && (
                <span className="text-xs flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                  <Bell className="h-3 w-3" />
                  {reminder}
                </span>
              )}
            </div>
          </div>

          {/* ── Right: action buttons (visible on hover) ── */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

            {/* Edit button — always shown */}
            <Button
              size="icon" variant="ghost" className="h-8 w-8"
              onClick={() => setEditOpen(true)}
              title="Edit task"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Mark complete — only for pending tasks */}
            {!isCompleted && (
              <Button
                size="icon" variant="ghost" className="h-8 w-8"
                onClick={() => editTask.mutate({ id, updates: { status: "completed" } })}
                title="Mark as complete"
              >
                <Check className="h-4 w-4 text-success" />
              </Button>
            )}

            {/* Delete */}
            <Button
              size="icon" variant="ghost" className="h-8 w-8"
              onClick={() => removeTask.mutate(id)}
              title="Delete task"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

        </div>
      </div>

      {/* Edit dialog — rendered outside the card so it isn't clipped */}
      <EditTaskDialog
        task={task}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
