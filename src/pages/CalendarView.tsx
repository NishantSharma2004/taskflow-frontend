import { useTasks } from "@/hooks/useTasks";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddTaskDialog } from "@/components/AddTaskDialog";

export default function CalendarView() {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach((t) => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return map;
  }, [tasks]);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Calendar</h1>
        <AddTaskDialog />
      </div>
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
          <h2 className="font-display font-semibold">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <Button variant="ghost" size="icon" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
          {days.map((day, i) => {
            if (day === null) return <div key={`e${i}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayTasks = tasksByDate[dateStr] || [];
            const isToday = dateStr === today;
            return (
              <div
                key={i}
                className={`min-h-[80px] rounded-md border p-1 text-xs ${isToday ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50"}`}
              >
                <span className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-xs font-medium ${isToday ? "bg-primary text-primary-foreground" : ""}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div key={t.id || t._id} className="truncate rounded bg-muted px-1 py-0.5">
                      {t.name}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <Badge variant="secondary" className="text-[10px] h-4">+{dayTasks.length - 2}</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
