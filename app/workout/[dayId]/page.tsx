"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getPlan,
  getGamification,
  saveGamification,
  addSession,
  saveCurrentSession,
  getCurrentSession,
} from "@/lib/storage";
import { processWorkoutCompletion } from "@/lib/gamification";
import type {
  WorkoutPlan,
  WorkoutDay,
  WorkoutSession,
  ExerciseLog,
  SetLog,
  GamificationState,
  PersonalRecord,
  Achievement,
} from "@/types";
import { cn, generateId } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  Minus,
  Plus,
} from "lucide-react";

interface CompletionModalProps {
  xpGained: number;
  newPRs: PersonalRecord[];
  newAchievements: Achievement[];
  leveledUp: boolean;
  newLevel?: number;
  onClose: () => void;
}

function CompletionModal({
  xpGained,
  newPRs,
  newAchievements,
  leveledUp,
  newLevel,
  onClose,
}: CompletionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Trophy className="h-10 w-10 text-primary" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Workout Complete!</h2>

          {/* XP Gained */}
          <div className="flex items-center justify-center gap-2 mb-6 animate-xp-pop">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-3xl font-bold gradient-text">+{xpGained} XP</span>
          </div>

          {/* Level Up */}
          {leveledUp && newLevel && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4">
              <p className="text-primary font-semibold">Level Up!</p>
              <p className="text-2xl font-bold">Level {newLevel}</p>
            </div>
          )}

          {/* New PRs */}
          {newPRs.length > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-4">
              <p className="text-orange-500 font-semibold mb-2">
                {newPRs.length} New PR{newPRs.length > 1 ? "s" : ""}!
              </p>
              <div className="space-y-1">
                {newPRs.map((pr, i) => (
                  <p key={i} className="text-sm">
                    {pr.exerciseName}: {pr.weight}kg x {pr.reps}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* New Achievements */}
          {newAchievements.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
              <p className="text-yellow-500 font-semibold mb-2">
                {newAchievements.length} Achievement{newAchievements.length > 1 ? "s" : ""} Unlocked!
              </p>
              <div className="space-y-1">
                {newAchievements.map((ach) => (
                  <p key={ach.id} className="text-sm">
                    {ach.name}
                  </p>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function RestTimer({
  duration,
  onComplete,
  onSkip,
}: {
  duration: number;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          onComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, onComplete]);

  const progress = ((duration - timeLeft) / duration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Rest Timer</span>
          <span className="text-2xl font-mono font-bold tabular-nums">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="h-2 bg-secondary rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {isPaused ? (
              <Play className="h-5 w-5" />
            ) : (
              <Pause className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setTimeLeft(duration)}
            className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkoutPage({
  params,
}: {
  params: Promise<{ dayId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [day, setDay] = useState<WorkoutDay | null>(null);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionData, setCompletionData] = useState<{
    xpGained: number;
    newPRs: PersonalRecord[];
    newAchievements: Achievement[];
    leveledUp: boolean;
    newLevel?: number;
  } | null>(null);

  useEffect(() => {
    const savedPlan = getPlan();
    const savedGamification = getGamification();

    if (!savedPlan) {
      router.push("/");
      return;
    }

    const workoutDay = savedPlan.days.find((d) => d.dayId === resolvedParams.dayId);
    if (!workoutDay) {
      router.push("/dashboard");
      return;
    }

    setPlan(savedPlan);
    setDay(workoutDay);
    setGamification(savedGamification);

    // Initialize exercise logs
    const initialLogs: ExerciseLog[] = workoutDay.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.name,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        weight: 0,
        reps: 0,
        completed: false,
        timestamp: "",
      })),
    }));

    // Check for existing session
    const existingSession = getCurrentSession();
    if (existingSession && existingSession.dayId === resolvedParams.dayId) {
      setExerciseLogs(existingSession.exerciseLogs);
    } else {
      setExerciseLogs(initialLogs);
    }
  }, [resolvedParams.dayId, router]);

  const currentExercise = day?.exercises[currentExerciseIndex];
  const currentLog = exerciseLogs[currentExerciseIndex];

  const updateSetLog = (
    exerciseIndex: number,
    setIndex: number,
    updates: Partial<SetLog>
  ) => {
    setExerciseLogs((logs) => {
      const newLogs = [...logs];
      newLogs[exerciseIndex] = {
        ...newLogs[exerciseIndex],
        sets: newLogs[exerciseIndex].sets.map((s, i) =>
          i === setIndex ? { ...s, ...updates } : s
        ),
      };
      return newLogs;
    });
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    const log = exerciseLogs[exerciseIndex];
    const set = log.sets[setIndex];

    // Don't complete if no weight/reps entered
    if (set.weight <= 0 || set.reps <= 0) return;

    updateSetLog(exerciseIndex, setIndex, {
      completed: true,
      timestamp: new Date().toISOString(),
    });

    // Show rest timer
    const exercise = day?.exercises[exerciseIndex];
    if (exercise) {
      setRestDuration(exercise.restSeconds);
      setShowRestTimer(true);
    }

    // Auto-save session
    const session: WorkoutSession = {
      id: generateId(),
      dayId: resolvedParams.dayId,
      startedAt: new Date().toISOString(),
      exerciseLogs: exerciseLogs.map((l, i) =>
        i === exerciseIndex
          ? {
              ...l,
              sets: l.sets.map((s, j) =>
                j === setIndex
                  ? { ...s, completed: true, timestamp: new Date().toISOString() }
                  : s
              ),
            }
          : l
      ),
      totalVolume: 0,
      xpEarned: 0,
      prsHit: [],
    };
    saveCurrentSession(session);
  };

  const finishWorkout = useCallback(() => {
    if (!plan || !day || !gamification) return;

    const session: WorkoutSession = {
      id: generateId(),
      dayId: day.dayId,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      exerciseLogs,
      totalVolume: exerciseLogs.reduce(
        (total, log) =>
          total +
          log.sets.reduce(
            (setTotal, s) => setTotal + (s.completed ? s.weight * s.reps : 0),
            0
          ),
        0
      ),
      xpEarned: 0,
      prsHit: [],
    };

    // Process gamification
    const result = processWorkoutCompletion(
      session,
      gamification,
      plan.days.length
    );

    // Update session with results
    session.xpEarned = result.xpGained;
    session.prsHit = result.newPRs;

    // Save everything
    addSession(session);
    saveGamification(result.newState);
    saveCurrentSession(null);

    // Show completion modal
    setCompletionData({
      xpGained: result.xpGained,
      newPRs: result.newPRs,
      newAchievements: result.newAchievements,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
    });
    setShowCompletion(true);
  }, [plan, day, gamification, exerciseLogs]);

  const handleCloseCompletion = () => {
    router.push("/dashboard");
  };

  if (!plan || !day || !currentExercise || !currentLog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const completedSets = exerciseLogs.reduce(
    (total, log) => total + log.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = day.exercises.reduce((total, ex) => total + ex.sets, 0);
  const progress = (completedSets / totalSets) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Exit</span>
            </Link>

            <div className="text-center">
              <h1 className="font-bold">{day.focus}</h1>
              <p className="text-xs text-muted-foreground">
                {completedSets}/{totalSets} sets
              </p>
            </div>

            <button
              onClick={finishWorkout}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Finish
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-secondary rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Exercise selector */}
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentExerciseIndex((i) => Math.max(0, i - 1))}
            disabled={currentExerciseIndex === 0}
            className="p-2 rounded-lg bg-secondary disabled:opacity-30 hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">
              Exercise {currentExerciseIndex + 1} of {day.exercises.length}
            </p>
            <h2 className="text-xl font-bold">{currentExercise.name}</h2>
            <p className="text-sm text-muted-foreground">
              {currentExercise.sets} x {currentExercise.reps} • {currentExercise.rir} RIR
            </p>
          </div>

          <button
            onClick={() =>
              setCurrentExerciseIndex((i) =>
                Math.min(day.exercises.length - 1, i + 1)
              )
            }
            disabled={currentExerciseIndex === day.exercises.length - 1}
            className="p-2 rounded-lg bg-secondary disabled:opacity-30 hover:bg-secondary/80 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Biomechanical cue */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-primary">
            <span className="font-medium">Pro tip:</span>{" "}
            {currentExercise.biomechanicalCue}
          </p>
        </div>

        {/* Set tracker */}
        <div className="space-y-3">
          {currentLog.sets.map((set, setIndex) => (
            <div
              key={setIndex}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-all",
                set.completed
                  ? "bg-primary/10 border-primary/30"
                  : "bg-card border-border"
              )}
            >
              {/* Set number */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                  set.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {set.completed ? <Check className="h-5 w-5" /> : set.setNumber}
              </div>

              {/* Weight input */}
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Weight (kg)</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateSetLog(currentExerciseIndex, setIndex, {
                        weight: Math.max(0, set.weight - 2.5),
                      })
                    }
                    disabled={set.completed}
                    className="p-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={set.weight || ""}
                    onChange={(e) =>
                      updateSetLog(currentExerciseIndex, setIndex, {
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                    disabled={set.completed}
                    placeholder="0"
                    className="w-16 text-center py-1 px-2 rounded bg-secondary border-none outline-none font-mono font-bold disabled:opacity-50"
                  />
                  <button
                    onClick={() =>
                      updateSetLog(currentExerciseIndex, setIndex, {
                        weight: set.weight + 2.5,
                      })
                    }
                    disabled={set.completed}
                    className="p-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Reps input */}
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Reps</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateSetLog(currentExerciseIndex, setIndex, {
                        reps: Math.max(0, set.reps - 1),
                      })
                    }
                    disabled={set.completed}
                    className="p-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={set.reps || ""}
                    onChange={(e) =>
                      updateSetLog(currentExerciseIndex, setIndex, {
                        reps: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={set.completed}
                    placeholder="0"
                    className="w-12 text-center py-1 px-2 rounded bg-secondary border-none outline-none font-mono font-bold disabled:opacity-50"
                  />
                  <button
                    onClick={() =>
                      updateSetLog(currentExerciseIndex, setIndex, {
                        reps: set.reps + 1,
                      })
                    }
                    disabled={set.completed}
                    className="p-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Complete button */}
              <button
                onClick={() => completeSet(currentExerciseIndex, setIndex)}
                disabled={set.completed || set.weight <= 0 || set.reps <= 0}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all",
                  set.completed
                    ? "bg-primary/20 text-primary cursor-default"
                    : set.weight > 0 && set.reps > 0
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                )}
              >
                {set.completed ? "Done" : "Log"}
              </button>
            </div>
          ))}
        </div>

        {/* Exercise navigation dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {day.exercises.map((_, index) => {
            const log = exerciseLogs[index];
            const isComplete = log?.sets.every((s) => s.completed);
            const hasProgress = log?.sets.some((s) => s.completed);

            return (
              <button
                key={index}
                onClick={() => setCurrentExerciseIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index === currentExerciseIndex
                    ? "w-6 bg-primary"
                    : isComplete
                    ? "bg-primary/60"
                    : hasProgress
                    ? "bg-primary/30"
                    : "bg-secondary"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Rest Timer */}
      {showRestTimer && (
        <RestTimer
          duration={restDuration}
          onComplete={() => setShowRestTimer(false)}
          onSkip={() => setShowRestTimer(false)}
        />
      )}

      {/* Completion Modal */}
      {showCompletion && completionData && (
        <CompletionModal
          xpGained={completionData.xpGained}
          newPRs={completionData.newPRs}
          newAchievements={completionData.newAchievements}
          leveledUp={completionData.leveledUp}
          newLevel={completionData.newLevel}
          onClose={handleCloseCompletion}
        />
      )}
    </div>
  );
}
