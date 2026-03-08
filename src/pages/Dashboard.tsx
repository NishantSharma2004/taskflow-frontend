import { useTasks } from "@/hooks/useTasks";
import { StatCard } from "@/components/StatCard";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { ListTodo, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { tasks, isLoading } = useTasks();
  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((t) => t.date === today);
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status !== "completed").length;
  const productivity = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <AddTaskDialog />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={tasks.length} icon={ListTodo} variant="primary" />
        <StatCard title="Completed" value={completed} icon={CheckCircle2} variant="success" />
        <StatCard title="Pending" value={pending} icon={Clock} variant="warning" />
        <StatCard title="Productivity" value={`${productivity}%`} icon={TrendingUp} />
      </div>

      <div>
        <h2 className="text-lg font-display font-semibold mb-3">Today's Tasks</h2>
        {todayTasks.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No tasks scheduled for today</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {todayTasks.map((task) => (
              <TaskCard key={task.id || task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
