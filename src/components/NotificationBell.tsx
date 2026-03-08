import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";

interface Notification {
  id: number;
  task_id: number;
  task_name: string;
  message: string;
  is_read: number;
  created_at: string;
}

// Auto-detect backend URL — works on both PC (localhost) and phone (192.168.x.x)
const api = axios.create({ baseURL: `http://${window.location.hostname}:5000` });
api.interceptors.request.use((c) => {
  const t = localStorage.getItem("tf_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr + " UTC").getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread,        setUnread]         = useState(0);
  const [open,          setOpen]           = useState(false);
  const [shaking,       setShaking]        = useState(false);
  const prevUnread = useRef(0);
  const dropRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      const list: Notification[] = data.data.notifications;
      const count: number        = data.data.unreadCount;

      setNotifications(list);
      setUnread(count);

      if (count > prevUnread.current) {
        setShaking(true);
        setTimeout(() => setShaking(false), 800);

        if ("Notification" in window && Notification.permission === "granted") {
          const newCount = count - prevUnread.current;
          list
            .filter((n) => !n.is_read)
            .slice(0, newCount)
            .forEach((n) => {
              new Notification("⏰ TaskFlow Reminder", {
                body: n.message,
                icon: "/icons/icon-192.png",
                tag:  String(n.id),
              });
            });
        }
      }
      prevUnread.current = count;
    } catch {
      // silent fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async () => {
    setOpen((v) => !v);
    if (!open && unread > 0) {
      try {
        await api.put("/notifications/read-all");
        setUnread(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
        prevUnread.current = 0;
      } catch {}
    }
  };

  const handleClear = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete("/notifications/clear");
      setNotifications((prev) => prev.filter((n) => !n.is_read));
    } catch {}
  };

  return (
    <div className="relative" ref={dropRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
        title="Notifications"
      >
        <Bell className={`h-5 w-5 text-muted-foreground ${shaking ? "animate-bounce" : ""}`} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-semibold text-sm text-foreground">Notifications</span>
            {notifications.some((n) => n.is_read) && (
              <button
                onClick={handleClear}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground text-sm">
                🎉 You're all caught up!
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-border last:border-0 ${
                    !n.is_read ? "bg-orange-50 dark:bg-orange-950/20" : ""
                  }`}
                >
                  <p className="text-sm text-foreground leading-snug">{n.message}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
