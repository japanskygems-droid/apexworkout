import type { NutritionPlan } from "@/types";
import { Utensils } from "lucide-react";

interface NutritionCardProps {
  nutrition: NutritionPlan;
}

export function NutritionCard({ nutrition }: NutritionCardProps) {
  const macroData = [
    {
      label: "Protein",
      value: nutrition.macros.proteinG,
      unit: "g",
      color: "bg-blue-500",
      percentage:
        ((nutrition.macros.proteinG * 4) / nutrition.targetCalories) * 100,
    },
    {
      label: "Carbs",
      value: nutrition.macros.carbsG,
      unit: "g",
      color: "bg-primary",
      percentage:
        ((nutrition.macros.carbsG * 4) / nutrition.targetCalories) * 100,
    },
    {
      label: "Fat",
      value: nutrition.macros.fatG,
      unit: "g",
      color: "bg-orange-500",
      percentage:
        ((nutrition.macros.fatG * 9) / nutrition.targetCalories) * 100,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Utensils className="h-4 w-4 text-primary" />
          Daily Nutrition
        </h3>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums">
            {nutrition.targetCalories.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground ml-1">kcal</span>
        </div>
      </div>

      {/* Macro breakdown bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-4">
        {macroData.map((macro) => (
          <div
            key={macro.label}
            className={macro.color}
            style={{ width: `${macro.percentage}%` }}
          />
        ))}
      </div>

      {/* Macro values */}
      <div className="grid grid-cols-3 gap-2">
        {macroData.map((macro) => (
          <div key={macro.label} className="text-center">
            <div className="flex items-center justify-center gap-1">
              <div className={`w-2 h-2 rounded-full ${macro.color}`} />
              <span className="text-xs text-muted-foreground">
                {macro.label}
              </span>
            </div>
            <p className="font-semibold tabular-nums">
              {macro.value}
              <span className="text-xs text-muted-foreground">{macro.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Diet note */}
      <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
        {nutrition.dietNotes}
      </p>
    </div>
  );
}
