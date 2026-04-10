"use client";

import type { GamificationState } from "@/types";
import { calculateLevel, LEVELS } from "@/lib/gamification";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelProgressProps {
  gamification: GamificationState;
}

export function LevelProgress({ gamification }: LevelProgressProps) {
  const levelInfo = calculateLevel(gamification.xp);
  const currentLevelData = LEVELS.find((l) => l.level === levelInfo.level);
  const nextLevelData = LEVELS.find((l) => l.level === levelInfo.level + 1);

  const xpToNextLevel = nextLevelData
    ? nextLevelData.xp - gamification.xp
    : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {levelInfo.level}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{levelInfo.title}</h3>
            <p className="text-sm text-muted-foreground">
              {gamification.xp.toLocaleString()} XP total
            </p>
          </div>
        </div>

        {nextLevelData && (
          <div className="text-right">
            <p className="text-sm font-medium">{xpToNextLevel.toLocaleString()} XP</p>
            <p className="text-xs text-muted-foreground">to {nextLevelData.title}</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>

        {/* Level markers */}
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            Lv.{levelInfo.level}
          </span>
          {nextLevelData && (
            <span className="text-xs text-muted-foreground">
              Lv.{levelInfo.level + 1}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
