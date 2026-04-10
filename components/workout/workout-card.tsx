import type { WorkoutExercise } from "@/types";
import { cn } from "@/lib/utils";
import { Clock, Target } from "lucide-react";

interface WorkoutCardProps {
  exercise: WorkoutExercise;
  index: number;
  compact?: boolean;
}

export function WorkoutCard({ exercise, index, compact = false }: WorkoutCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 hover:bg-secondary/30 transition-colors",
        compact ? "p-4" : "p-5"
      )}
    >
      {/* Exercise number */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
        {index}
      </div>

      {/* Exercise details */}
      <div className="flex-1 min-w-0">
        <h4 className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
          {exercise.name}
        </h4>
        
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="text-sm text-muted-foreground">
            {exercise.sets} x {exercise.reps}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {exercise.restSeconds}s rest
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Target className="h-3 w-3 text-primary" />
            <span className="text-primary font-medium">{exercise.rir} RIR</span>
          </span>
        </div>

        {!compact && (
          <p className="text-sm text-muted-foreground mt-2 italic">
            {exercise.biomechanicalCue}
          </p>
        )}
      </div>
    </div>
  );
}
