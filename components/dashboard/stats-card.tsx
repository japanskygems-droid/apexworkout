import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accentColor?: string;
  suffix?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  accentColor = "text-primary",
  suffix,
}: StatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 card-hover">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-secondary", accentColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums">{value}</span>
            {suffix && (
              <span className="text-sm text-muted-foreground">{suffix}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
