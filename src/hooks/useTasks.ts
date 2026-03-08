import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask, Task } from "@/lib/api";
import { toast } from "sonner";

// Demo data used when backend is unavailable
const DEMO_TASKS: Task[] = [
  { id: "1", name: "Complete React project", category: "Work", priority: "High", startTime: "09:00", endTime: "12:00", date: new Date().toISOString().split("T")[0], status: "pending" },
  { id: "2", name: "Study TypeScript generics", category: "Study", priority: "Medium", startTime: "13:00", endTime: "15:00", date: new Date().toISOString().split("T")[0], status: "completed" },
  { id: "3", name: "Morning workout", category: "Health", priority: "High", startTime: "06:00", endTime: "07:00", date: new Date().toISOString().split("T")[0], status: "completed" },
  { id: "4", name: "Read design patterns book", category: "Study", priority: "Low", startTime: "19:00", endTime: "20:30", date: new Date().toISOString().split("T")[0], status: "pending" },
  { id: "5", name: "Grocery shopping", category: "Personal", priority: "Medium", startTime: "17:00", endTime: "18:00", date: new Date().toISOString().split("T")[0], status: "pending" },
  { id: "6", name: "Team standup meeting", category: "Work", priority: "High", startTime: "10:00", endTime: "10:30", date: new Date(Date.now() + 86400000).toISOString().split("T")[0], status: "pending" },
  { id: "7", name: "Yoga session", category: "Health", priority: "Low", startTime: "07:00", endTime: "08:00", date: new Date(Date.now() + 86400000).toISOString().split("T")[0], status: "pending" },
];

let localTasks = [...DEMO_TASKS];
let nextId = 8;

export function useTasks() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      try {
        return await fetchTasks();
      } catch {
        return localTasks;
      }
    },
  });

  const addTask = useMutation({
    mutationFn: async (task: Omit<Task, "id" | "_id">) => {
      try {
        return await createTask(task);
      } catch {
        const newTask = { ...task, id: String(nextId++), status: "pending" as const };
        localTasks.push(newTask);
        return newTask;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully!");
    },
  });

  const editTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      try {
        return await updateTask(id, updates);
      } catch {
        localTasks = localTasks.map((t) => (t.id === id || t._id === id ? { ...t, ...updates } : t));
        return localTasks.find((t) => t.id === id)!;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const removeTask = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteTask(id);
      } catch {
        localTasks = localTasks.filter((t) => t.id !== id && t._id !== id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
  });

  return { tasks: query.data ?? [], isLoading: query.isLoading, addTask, editTask, removeTask };
}
