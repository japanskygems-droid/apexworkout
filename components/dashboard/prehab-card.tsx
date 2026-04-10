import type { PrehabExercise } from "@/types";
import { Activity } from "lucide-react";

interface PrehabCardProps {
  prehab: PrehabExercise[];
}

export function PrehabCard({ prehab }: PrehabCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        Pre-hab Routine
      </h3>

      <div className="space-y-3">
        {prehab.map((exercise, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{exercise.exercise}</p>
              <p className="text-xs text-muted-foreground">
                {exercise.durationOrReps}
              </p>
              <p className="text-xs text-primary mt-1 italic">
                {exercise.cue}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
