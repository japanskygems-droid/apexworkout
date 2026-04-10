"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { PRESETS, createUserFromPreset } from "@/lib/presets";
import { generateWorkoutPlan } from "@/lib/workout-engine";
import { saveUser, savePlan, saveGamification } from "@/lib/storage";
import { initializeGamification } from "@/lib/gamification";
import type { UserProfile, PosturalIssue } from "@/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dumbbell,
  Building2,
  Home,
  User,
  Loader2,
} from "lucide-react";

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1: Body Basics
  age: number;
  gender: "male" | "female";
  heightCm: number;
  weightKg: number;
  useImperial: boolean;
  
  // Step 2: Goals & Access
  goal: UserProfile["goal"];
  trainingDays: 3 | 4 | 5 | 6;
  equipment: UserProfile["equipment"];
  
  // Step 3: Fine-tuning
  posturalIssues: PosturalIssue[];
  dietaryRestriction: UserProfile["dietaryRestriction"];
  experienceLevel: UserProfile["experienceLevel"];
}

const DEFAULT_FORM: FormData = {
  age: 25,
  gender: "male",
  heightCm: 175,
  weightKg: 75,
  useImperial: false,
  goal: "hypertrophy",
  trainingDays: 4,
  equipment: "commercial_gym",
  posturalIssues: [],
  dietaryRestriction: "omnivore",
  experienceLevel: "intermediate",
};

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetId = searchParams.get("preset");
  
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<typeof PRESETS[0] | null>(null);

  // Load preset if provided
  useEffect(() => {
    if (presetId) {
      const preset = PRESETS.find((p) => p.id === presetId);
      if (preset) {
        setSelectedPreset(preset);
        setFormData((prev) => ({
          ...prev,
          goal: preset.goal,
          trainingDays: preset.trainingDays,
          equipment: preset.equipment,
          experienceLevel: preset.experienceLevel,
        }));
      }
    }
  }, [presetId]);

  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate loading for effect
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Create user profile
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      age: formData.age,
      gender: formData.gender,
      heightCm: formData.heightCm,
      weightKg: formData.weightKg,
      goal: formData.goal,
      trainingDays: formData.trainingDays,
      equipment: formData.equipment,
      dietaryRestriction: formData.dietaryRestriction,
      posturalIssues: formData.posturalIssues.length > 0 ? formData.posturalIssues : ["none"],
      experienceLevel: formData.experienceLevel,
      createdAt: new Date().toISOString(),
    };

    // Generate plan
    const plan = generateWorkoutPlan(user);
    
    // Initialize gamification
    const gamification = initializeGamification();
    gamification.weeklyProgress.plannedSessions = user.trainingDays;
    
    // Save everything
    saveUser(user);
    savePlan(plan);
    saveGamification(gamification);
    
    // Navigate to dashboard
    router.push("/dashboard");
  };

  // Convert height for display
  const heightFeet = Math.floor(formData.heightCm / 30.48);
  const heightInches = Math.round((formData.heightCm / 2.54) % 12);
  const weightLbs = Math.round(formData.weightKg * 2.205);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  s < step
                    ? "bg-primary text-primary-foreground"
                    : s === step
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {s < step ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "w-12 h-1 mx-2 rounded-full transition-colors",
                    s < step ? "bg-primary" : "bg-secondary"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Preset badge */}
        {selectedPreset && (
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              <Dumbbell className="h-4 w-4" />
              {selectedPreset.name} Template
            </span>
          </div>
        )}

        {/* Step content */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          {/* Step 1: Body Basics */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Body Basics</h2>
              <p className="text-muted-foreground mb-6">
                Quick info to calculate your nutrition and tailor your program.
              </p>

              {/* Unit toggle */}
              <div className="flex items-center justify-end gap-2 mb-6">
                <span className={cn("text-sm", !formData.useImperial && "text-primary font-medium")}>
                  Metric
                </span>
                <button
                  onClick={() => updateForm("useImperial", !formData.useImperial)}
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-colors",
                    formData.useImperial ? "bg-primary" : "bg-secondary"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                      formData.useImperial ? "translate-x-7" : "translate-x-1"
                    )}
                  />
                </button>
                <span className={cn("text-sm", formData.useImperial && "text-primary font-medium")}>
                  Imperial
                </span>
              </div>

              <div className="space-y-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateForm("age", parseInt(e.target.value) || 18)}
                    min={13}
                    max={80}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["male", "female"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => updateForm("gender", g)}
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all",
                          formData.gender === g
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-secondary border-border hover:border-primary/50"
                        )}
                      >
                        <User className="h-4 w-4" />
                        <span className="capitalize">{g}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Height {formData.useImperial ? `(${heightFeet}'${heightInches}")` : `(${formData.heightCm} cm)`}
                  </label>
                  <input
                    type="range"
                    value={formData.heightCm}
                    onChange={(e) => updateForm("heightCm", parseInt(e.target.value))}
                    min={140}
                    max={220}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formData.useImperial ? "4'7\"" : "140cm"}</span>
                    <span>{formData.useImperial ? "7'3\"" : "220cm"}</span>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Weight {formData.useImperial ? `(${weightLbs} lbs)` : `(${formData.weightKg} kg)`}
                  </label>
                  <input
                    type="range"
                    value={formData.weightKg}
                    onChange={(e) => updateForm("weightKg", parseInt(e.target.value))}
                    min={40}
                    max={150}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formData.useImperial ? "88 lbs" : "40kg"}</span>
                    <span>{formData.useImperial ? "330 lbs" : "150kg"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals & Access */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Goals & Access</h2>
              <p className="text-muted-foreground mb-6">
                What you want to achieve and what you have to work with.
              </p>

              <div className="space-y-6">
                {/* Goal */}
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Goal</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "hypertrophy", label: "Build Muscle", desc: "Maximum growth" },
                      { value: "fat_loss", label: "Lose Fat", desc: "Preserve muscle" },
                      { value: "recomp", label: "Recomp", desc: "Both at once" },
                      { value: "strength", label: "Get Stronger", desc: "Peak performance" },
                    ].map((g) => (
                      <button
                        key={g.value}
                        onClick={() => updateForm("goal", g.value as UserProfile["goal"])}
                        className={cn(
                          "flex flex-col items-start p-4 rounded-lg border transition-all text-left",
                          formData.goal === g.value
                            ? "bg-primary/10 border-primary"
                            : "bg-secondary border-border hover:border-primary/50"
                        )}
                      >
                        <span className="font-medium">{g.label}</span>
                        <span className="text-xs text-muted-foreground">{g.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Training Days */}
                <div>
                  <label className="block text-sm font-medium mb-2">Training Days per Week</label>
                  <div className="grid grid-cols-4 gap-2">
                    {([3, 4, 5, 6] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => updateForm("trainingDays", d)}
                        className={cn(
                          "py-3 rounded-lg border text-center font-semibold transition-all",
                          formData.trainingDays === d
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary border-border hover:border-primary/50"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-sm font-medium mb-2">Equipment Access</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "commercial_gym", label: "Full Gym", icon: Building2 },
                      { value: "home_gym", label: "Home Gym", icon: Home },
                      { value: "dumbbells_only", label: "Dumbbells Only", icon: Dumbbell },
                      { value: "bodyweight", label: "Bodyweight", icon: User },
                    ].map((e) => {
                      const Icon = e.icon;
                      return (
                        <button
                          key={e.value}
                          onClick={() => updateForm("equipment", e.value as UserProfile["equipment"])}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border transition-all",
                            formData.equipment === e.value
                              ? "bg-primary/10 border-primary"
                              : "bg-secondary border-border hover:border-primary/50"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{e.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Fine-tuning */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2">Fine-Tuning</h2>
              <p className="text-muted-foreground mb-6">
                Optional details for a more personalized program. Skip if you prefer defaults.
              </p>

              <div className="space-y-6">
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "beginner", label: "Beginner", desc: "<1 year" },
                      { value: "intermediate", label: "Intermediate", desc: "1-3 years" },
                      { value: "advanced", label: "Advanced", desc: "3+ years" },
                    ].map((e) => (
                      <button
                        key={e.value}
                        onClick={() => updateForm("experienceLevel", e.value as UserProfile["experienceLevel"])}
                        className={cn(
                          "flex flex-col items-center p-3 rounded-lg border transition-all",
                          formData.experienceLevel === e.value
                            ? "bg-primary/10 border-primary"
                            : "bg-secondary border-border hover:border-primary/50"
                        )}
                      >
                        <span className="font-medium text-sm">{e.label}</span>
                        <span className="text-xs text-muted-foreground">{e.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Postural Issues */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Any Postural Issues? <span className="text-muted-foreground">(for pre-hab)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "desk_worker", label: "Desk Worker" },
                      { value: "lower_back_pain", label: "Lower Back Pain" },
                      { value: "forward_head", label: "Forward Head" },
                      { value: "rounded_shoulders", label: "Rounded Shoulders" },
                      { value: "anterior_pelvic_tilt", label: "Anterior Pelvic Tilt" },
                    ].map((p) => {
                      const isSelected = formData.posturalIssues.includes(p.value as PosturalIssue);
                      return (
                        <button
                          key={p.value}
                          onClick={() => {
                            if (isSelected) {
                              updateForm(
                                "posturalIssues",
                                formData.posturalIssues.filter((i) => i !== p.value)
                              );
                            } else {
                              updateForm("posturalIssues", [
                                ...formData.posturalIssues,
                                p.value as PosturalIssue,
                              ]);
                            }
                          }}
                          className={cn(
                            "px-3 py-2 rounded-lg border text-sm transition-all",
                            isSelected
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-secondary border-border hover:border-primary/50"
                          )}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dietary Restriction */}
                <div>
                  <label className="block text-sm font-medium mb-2">Dietary Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "omnivore", label: "Omnivore" },
                      { value: "vegetarian", label: "Vegetarian" },
                      { value: "vegan", label: "Vegan" },
                      { value: "pescatarian", label: "Pescatarian" },
                    ].map((d) => (
                      <button
                        key={d.value}
                        onClick={() => updateForm("dietaryRestriction", d.value as UserProfile["dietaryRestriction"])}
                        className={cn(
                          "py-3 rounded-lg border text-sm font-medium transition-all",
                          formData.dietaryRestriction === d.value
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-secondary border-border hover:border-primary/50"
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                step === 1
                  ? "text-muted-foreground cursor-not-allowed"
                  : "hover:bg-secondary"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : step === 3 ? (
                <>
                  Generate Program
                  <Check className="h-5 w-5" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip to generate (only on step 3) */}
        {step === 3 && !isGenerating && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            These settings are optional. You can{" "}
            <button
              onClick={handleGenerate}
              className="text-primary hover:underline"
            >
              generate now
            </button>{" "}
            with defaults.
          </p>
        )}
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
