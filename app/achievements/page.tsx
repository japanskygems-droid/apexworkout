"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { getGamification } from "@/lib/storage";
import type { GamificationState, Achievement } from "@/types";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Flame,
  Crown,
  Target,
  Dumbbell,
  Zap,
  Shield,
  Star,
  Award,
  Heart,
  Medal,
  Check,
  Lock,
} from "lucide-react";

const ACHIEVEMENT_ICONS: Record<string, typeof Trophy> = {
  trophy: Trophy,
  flame: Flame,
  crown: Crown,
  target: Target,
  dumbbell: Dumbbell,
  bolt: Zap,
  shield: Shield,
  star: Star,
  award: Award,
  heart: Heart,
  medal: Medal,
  check: Check,
};

export default function AchievementsPage() {
  const router = useRouter();
  const [gamification, setGamification] = useState<GamificationState | null>(null);

  useEffect(() => {
    const saved = getGamification();
    if (!saved) {
      router.push("/");
      return;
    }
    setGamification(saved);
  }, [router]);

  if (!gamification) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const unlockedCount = gamification.achievements.filter((a) => a.unlockedAt).length;
  const totalCount = gamification.achievements.length;

  return (
    <div className="min-h-screen bg-background">
      <Header showNav />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Achievements</h1>
          <span className="text-muted-foreground">
            {unlockedCount}/{totalCount} unlocked
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-card border border-border rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Collection Progress</span>
            <span className="text-sm font-medium">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {gamification.achievements.map((achievement) => {
            const isUnlocked = !!achievement.unlockedAt;
            const Icon = ACHIEVEMENT_ICONS[achievement.icon] || Trophy;
            const progress = achievement.progress || 0;
            const target = achievement.target || 1;
            const progressPercent = Math.min((progress / target) * 100, 100);

            return (
              <div
                key={achievement.id}
                className={cn(
                  "relative p-5 rounded-xl border transition-all",
                  isUnlocked
                    ? "bg-card border-primary/30 card-hover"
                    : "bg-card/50 border-border opacity-70"
                )}
              >
                {/* Badge */}
                {isUnlocked && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
                      isUnlocked
                        ? "bg-primary/20"
                        : "bg-secondary"
                    )}
                  >
                    {isUnlocked ? (
                      <Icon
                        className={cn(
                          "h-7 w-7",
                          isUnlocked ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>

                    {/* Progress bar (for locked achievements) */}
                    {!isUnlocked && (
                      <div className="space-y-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-muted-foreground/50 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {progress}/{target}
                        </p>
                      </div>
                    )}

                    {/* Unlock date */}
                    {isUnlocked && achievement.unlockedAt && (
                      <p className="text-xs text-primary">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
