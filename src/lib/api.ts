import axios from "axios";

// Auto-detect backend URL:
// - On PC browser: window.location.hostname = "localhost" → http://localhost:5000
// - On phone browser: window.location.hostname = "172.22.59.158" → http://172.22.59.158:5000
const API_URL = `http://${window.location.hostname}:5000`;

export interface Task {
  id?: string;
  _id?: string;
  name: string;
  category: "Study" | "Work" | "Personal" | "Health";
  priority: "High" | "Medium" | "Low";
  startTime: string;
  endTime: string;
  date: string;
  status?: "pending" | "completed";
  reminderMinutes?: number;
}

const api = axios.create({ baseURL: API_URL });

// ── Attach JWT token to every request automatically ───────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── API functions ─────────────────────────────────────────────────────────────
export const fetchTasks = async (): Promise<Task[]> => {
  const res = await api.get("/tasks");
  return res.data.data ?? res.data;
};

export const createTask = async (task: Omit<Task, "id" | "_id">): Promise<Task> => {
  const res = await api.post("/tasks", task);
  return res.data.data ?? res.data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const res = await api.put(`/tasks/${id}`, updates);
  return res.data.data ?? res.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
