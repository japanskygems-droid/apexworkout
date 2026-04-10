"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { getGamification, getSessions, getPlan } from "@/lib/storage";
import type { GamificationState, WorkoutSession, WorkoutPlan } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import {
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Calendar,
  Dumbbell,
  Award,
  Clock,
} from "lucide-react";

export default function ProgressPage() {
  const router = useRouter();
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    const savedGamification = getGamification();
    const savedSessions = getSessions();
    const savedPlan = getPlan();

    if (!savedPlan) {
      router.push("/");
      return;
    }

    setGamification(savedGamification);
    setSessions(savedSessions);
    setPlan(savedPlan);
  }, [router]);

  if (!gamification || !plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Calculate stats
  const totalVolume = sessions.reduce((sum, s) => sum + s.totalVolume, 0);
  const totalXP = sessions.reduce((sum, s) => sum + s.xpEarned, 0);
  const avgSessionDuration = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, s) => {
        if (s.completedAt && s.startedAt) {
          return sum + (new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / 60000;
        }
        return sum;
      }, 0) / sessions.length)
    : 0;

  // Get last 7 days of workouts for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const workoutsPerDay = last7Days.map((date) => {
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    return sessions.filter((s) => {
      const sessionDate = new Date(s.startedAt);
      return sessionDate >= date && sessionDate <= dayEnd;
    }).length;
  });

  const maxWorkouts = Math.max(...workoutsPerDay, 1);

  return (
    <div className="min-h-screen bg-background">
      <Header showNav />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Your Progress</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Dumbbell className="h-4 w-4" />
              <span className="text-sm">Total Workouts</span>
            </div>
            <p className="text-3xl font-bold tabular-nums">
              {gamification.totalWorkouts}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="h-4 w-4" />
              <span className="text-sm">Total Sets</span>
            </div>
            <p className="text-3xl font-bold tabular-nums">
              {formatNumber(gamification.totalSets)}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Total Volume</span>
            </div>
            <p className="text-3xl font-bold tabular-nums">
              {formatNumber(totalVolume)}
              <span className="text-sm text-muted-foreground ml-1">kg</span>
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Award className="h-4 w-4" />
              <span className="text-sm">Personal Records</span>
            </div>
            <p className="text-3xl font-bold tabular-nums">
              {gamification.personalRecords.length}
            </p>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Last 7 Days
          </h2>

          <div className="flex items-end justify-between gap-2 h-32">
            {last7Days.map((date, index) => {
              const count = workoutsPerDay[index];
              const height = count > 0 ? (count / maxWorkouts) * 100 : 8;
              const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
              const isToday = index === 6;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all",
                      count > 0 ? "bg-primary" : "bg-secondary"
                    )}
                    style={{ height: `${height}%` }}
                  />
                  <span
                    className={cn(
                      "text-xs",
                      isToday ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streaks */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold tabular-nums">
                  {gamification.currentStreak}
                  <span className="text-lg text-muted-foreground ml-1">days</span>
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Keep it going! Consistency is key.
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="text-3xl font-bold tabular-nums">
                  {gamification.longestStreak}
                  <span className="text-lg text-muted-foreground ml-1">days</span>
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Your personal best consistency record.
            </div>
          </div>
        </div>

        {/* Personal Records */}
        {gamification.personalRecords.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-orange-500" />
              Personal Records
            </h2>

            <div className="space-y-3">
              {gamification.personalRecords.slice(0, 10).map((pr, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="font-medium">{pr.exerciseName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(pr.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold tabular-nums">
                      {pr.weight}kg x {pr.reps}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Recent Sessions
            </h2>

            <div className="space-y-3">
              {sessions.slice(-5).reverse().map((session, index) => {
                const day = plan.days.find((d) => d.dayId === session.dayId);
                const duration = session.completedAt && session.startedAt
                  ? Math.round(
                      (new Date(session.completedAt).getTime() -
                        new Date(session.startedAt).getTime()) /
                        60000
                    )
                  : null;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium">{day?.focus || "Workout"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.startedAt).toLocaleDateString()}
                        {duration && ` • ${duration} min`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.prsHit.length > 0 && (
                        <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-500 text-xs font-medium">
                          {session.prsHit.length} PR{session.prsHit.length > 1 ? "s" : ""}
                        </span>
                      )}
                      <span className="text-sm text-primary font-medium">
                        +{session.xpEarned} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
