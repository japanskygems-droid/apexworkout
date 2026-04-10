"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { WorkoutCard } from "@/components/workout/workout-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { WeeklyCalendar } from "@/components/dashboard/weekly-calendar";
import { NutritionCard } from "@/components/dashboard/nutrition-card";
import { PrehabCard } from "@/components/dashboard/prehab-card";
import { LevelProgress } from "@/components/dashboard/level-progress";
import {
  getUser,
  getPlan,
  getGamification,
  exportPlanToMarkdown,
} from "@/lib/storage";
import type { UserProfile, WorkoutPlan, GamificationState } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import {
  Flame,
  Trophy,
  Dumbbell,
  TrendingUp,
  Copy,
  Check,
  Settings,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const savedUser = getUser();
    const savedPlan = getPlan();
    const savedGamification = getGamification();

    if (!savedUser || !savedPlan) {
      router.push("/");
      return;
    }

    setUser(savedUser);
    setPlan(savedPlan);
    setGamification(savedGamification);

    // Determine which day to show based on completed workouts this week
    const completedDays = savedGamification?.weeklyProgress.completedDays.length || 0;
    setCurrentDayIndex(Math.min(completedDays, savedPlan.days.length - 1));
  }, [router]);

  const handleCopyPlan = async () => {
    if (!plan) return;
    const markdown = exportPlanToMarkdown(plan);
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user || !plan || !gamification) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const currentDay = plan.days[currentDayIndex];
  const todayString = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="min-h-screen bg-background">
      <Header showNav />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Top Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatsCard
            label="Streak"
            value={gamification.currentStreak}
            icon={Flame}
            accentColor="text-orange-500"
            suffix="days"
          />
          <StatsCard
            label="Level"
            value={gamification.level}
            icon={Trophy}
            accentColor="text-primary"
            suffix={gamification.levelTitle}
          />
          <StatsCard
            label="Total XP"
            value={formatNumber(gamification.xp)}
            icon={TrendingUp}
            accentColor="text-emerald-500"
          />
          <StatsCard
            label="Workouts"
            value={gamification.totalWorkouts}
            icon={Dumbbell}
            accentColor="text-blue-500"
          />
        </div>

        {/* Level Progress */}
        <LevelProgress gamification={gamification} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Today's Workout */}
          <div className="lg:col-span-2 space-y-6">
            {/* Day Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {plan.days.map((day, index) => (
                <button
                  key={day.dayId}
                  onClick={() => setCurrentDayIndex(index)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    currentDayIndex === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  Day {day.dayNumber}
                </button>
              ))}
            </div>

            {/* Today's Workout Card */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {todayString} - Day {currentDay.dayNumber}
                    </p>
                    <h2 className="text-2xl font-bold">{currentDay.focus}</h2>
                    <p className="text-muted-foreground mt-1">
                      {currentDay.exercises.length} exercises • {currentDay.totalSets} sets • ~{currentDay.estimatedDuration} min
                    </p>
                  </div>
                  <Link
                    href={`/workout/${currentDay.dayId}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start Workout
                  </Link>
                </div>
              </div>

              {/* Exercise List */}
              <div className="divide-y divide-border">
                {currentDay.exercises.map((exercise, index) => (
                  <WorkoutCard
                    key={exercise.exerciseId}
                    exercise={exercise}
                    index={index + 1}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* Progression Rules */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Progression: {plan.progressionRules.system}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {plan.progressionRules.rule}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">RIR Targets:</span> {plan.progressionRules.rirTarget}
              </p>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Weekly Calendar */}
            <WeeklyCalendar
              completedDays={gamification.weeklyProgress.completedDays}
              plannedSessions={plan.days.length}
            />

            {/* Nutrition Card */}
            <NutritionCard nutrition={plan.nutrition} />

            {/* Pre-hab Card */}
            <PrehabCard prehab={plan.prehab} />

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopyPlan}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Plan for AI Review
                  </>
                )}
              </button>
              <Link
                href="/onboarding"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-border text-muted-foreground font-medium hover:bg-secondary transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Generate New Program
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
