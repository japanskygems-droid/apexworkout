"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WeeklyCalendarProps {
  completedDays: string[];
  plannedSessions: number;
}

export function WeeklyCalendar({
  completedDays,
  plannedSessions,
}: WeeklyCalendarProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

  // Get which days this week have been completed
  const completedThisWeek = completedDays.filter((dateStr) => {
    const date = new Date(dateStr);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - currentDayIndex);
    weekStart.setHours(0, 0, 0, 0);
    return date >= weekStart;
  });

  const completedDayIndices = completedThisWeek.map((dateStr) => {
    const date = new Date(dateStr);
    return (date.getDay() + 6) % 7;
  });

  const completedCount = completedDayIndices.length;
  const progress = plannedSessions > 0 ? (completedCount / plannedSessions) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">This Week</h3>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{plannedSessions} sessions
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Day circles */}
      <div className="flex justify-between">
        {days.map((day, index) => {
          const isCompleted = completedDayIndices.includes(index);
          const isToday = index === currentDayIndex;
          const isPast = index < currentDayIndex;

          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isToday
                    ? "bg-primary/20 border-2 border-primary text-primary"
                    : isPast
                    ? "bg-secondary text-muted-foreground"
                    : "bg-secondary/50 text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : day.charAt(0)}
              </div>
              <span
                className={cn(
                  "text-xs",
                  isToday ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
