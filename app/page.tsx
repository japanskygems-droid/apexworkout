"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { PRESETS } from "@/lib/presets";
import { getPlan, getUser } from "@/lib/storage";
import {
  Rocket,
  Flame,
  Star,
  Crown,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Shield,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_ICONS = {
  rocket: Rocket,
  flame: Flame,
  star: Star,
  crown: Crown,
};

export default function LandingPage() {
  const router = useRouter();
  const [hasExistingPlan, setHasExistingPlan] = useState(false);
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);

  useEffect(() => {
    const plan = getPlan();
    const user = getUser();
    if (plan && user) {
      setHasExistingPlan(true);
    }
  }, []);

  const handlePresetSelect = (presetId: string) => {
    router.push(`/onboarding?preset=${presetId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-20" />

        <div className="container mx-auto px-4 pt-16 pb-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            {hasExistingPlan && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 hover:bg-primary/20 transition-colors"
              >
                <Zap className="h-4 w-4" />
                Continue your program
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Elite Training Programs,{" "}
              <span className="gradient-text">Scientifically Built</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Zero junk volume. Evidence-based splits. Real progression. Get a
              personalized program in seconds, not hours.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Build My Program
                <ArrowRight className="h-5 w-5" />
              </Link>
              {hasExistingPlan && (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg hover:bg-secondary/80 transition-colors"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Science-backed protocols</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Auto-regulated RIR</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Progressive overload built-in</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Presets */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Quick Start Templates
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose a template to get started instantly. Just add your basic
              info and you&apos;re ready to train.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {PRESETS.map((preset) => {
              const Icon =
                PRESET_ICONS[preset.icon as keyof typeof PRESET_ICONS] || Star;
              const isHovered = hoveredPreset === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  onMouseEnter={() => setHoveredPreset(preset.id)}
                  onMouseLeave={() => setHoveredPreset(null)}
                  className={cn(
                    "group relative flex flex-col items-start p-6 rounded-2xl border text-left transition-all duration-300",
                    isHovered
                      ? "bg-card border-primary/50 shadow-lg shadow-primary/5 scale-[1.02]"
                      : "bg-card/50 border-border hover:border-border/80"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-colors",
                      isHovered ? "bg-primary/20" : "bg-primary/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isHovered ? "text-primary" : "text-primary/70"
                      )}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-1">{preset.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {preset.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium">
                      {preset.trainingDays} days/week
                    </span>
                    <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium capitalize">
                      {preset.experienceLevel}
                    </span>
                  </div>

                  {/* Arrow indicator */}
                  <div
                    className={cn(
                      "absolute top-6 right-6 transition-all",
                      isHovered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2"
                    )}
                  >
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom option */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Want more control? Customize every detail.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Build Custom Program
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 border-t border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Why Apex Delivers 10/10 Programs
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                title: "Zero Junk Volume",
                description:
                  "Every set has purpose. Max 6 exercises, 18 sets per session. We follow MEV-MRV-MAV principles.",
              },
              {
                title: "Equipment-Strict",
                description:
                  "Select 'Dumbbells Only' and you'll never see a barbell exercise. We respect your setup.",
              },
              {
                title: "Auto-Regulated RIR",
                description:
                  "No more 'lift heavier.' Precise Reps in Reserve targets for compounds and isolations.",
              },
              {
                title: "Mifflin-St Jeor Nutrition",
                description:
                  "Gold-standard TDEE calculation with macro math that actually adds up.",
              },
              {
                title: "Gamified Progress",
                description:
                  "XP, levels, achievements, and streaks. Making consistency feel like winning.",
              },
              {
                title: "Targeted Pre-hab",
                description:
                  "Desk worker? Lower back issues? Get 3-4 specific movements, not generic stretches.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors"
              >
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Train Smarter?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join the elite. Get your personalized program in under 60 seconds.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Building
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with science. Powered by evidence.{" "}
            <span className="gradient-text font-semibold">Apex Fitness</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
