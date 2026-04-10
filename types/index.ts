// User Profile Types
export interface UserProfile {
  id: string;
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  bodyFatPercent?: number;
  goal: 'recomp' | 'hypertrophy' | 'fat_loss' | 'strength';
  trainingDays: 3 | 4 | 5 | 6;
  equipment: 'commercial_gym' | 'dumbbells_only' | 'bodyweight' | 'home_gym';
  dietaryRestriction: 'omnivore' | 'vegan' | 'vegetarian' | 'pescatarian';
  posturalIssues: PosturalIssue[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

export type PosturalIssue = 'desk_worker' | 'lower_back_pain' | 'forward_head' | 'rounded_shoulders' | 'anterior_pelvic_tilt' | 'none';

// Nutrition Types
export interface NutritionPlan {
  tdeeCalculation: number;
  targetCalories: number;
  macros: {
    proteinG: number;
    fatG: number;
    carbsG: number;
  };
  dietNotes: string;
}

// Pre-hab Types
export interface PrehabExercise {
  exercise: string;
  durationOrReps: string;
  cue: string;
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  movementPattern: MovementPattern;
  equipment: EquipmentType[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  biomechanicalCue: string;
}

export type MuscleGroup = 
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' 
  | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core' | 'forearms';

export type MovementPattern = 
  | 'horizontal_push' | 'horizontal_pull' | 'vertical_push' | 'vertical_pull'
  | 'hip_hinge' | 'squat' | 'lunge' | 'isolation' | 'carry';

export type EquipmentType = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'bands' | 'kettlebell';

// Workout Plan Types
export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  rir: number;
  biomechanicalCue: string;
}

export interface WorkoutDay {
  dayId: string;
  dayNumber: number;
  focus: string;
  exercises: WorkoutExercise[];
  totalSets: number;
  estimatedDuration: number;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  splitType: string;
  weeklyVolume: Record<MuscleGroup, number>;
  days: WorkoutDay[];
  progressionRules: ProgressionRules;
  prehab: PrehabExercise[];
  nutrition: NutritionPlan;
  createdAt: string;
}

export interface ProgressionRules {
  system: string;
  rule: string;
  rirTarget: string;
}

// Gamification Types
export interface GamificationState {
  xp: number;
  level: number;
  levelTitle: string;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalSets: number;
  personalRecords: PersonalRecord[];
  achievements: Achievement[];
  weeklyProgress: WeeklyProgress;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface WeeklyProgress {
  weekStart: string;
  plannedSessions: number;
  completedSessions: number;
  completedDays: number[];
}

// Workout Session Types
export interface WorkoutSession {
  id: string;
  dayId: string;
  startedAt: string;
  completedAt?: string;
  exerciseLogs: ExerciseLog[];
  totalVolume: number;
  xpEarned: number;
  prsHit: PersonalRecord[];
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  timestamp: string;
}

// Preset Types
export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  trainingDays: 3 | 4 | 5 | 6;
  goal: UserProfile['goal'];
  equipment: UserProfile['equipment'];
  experienceLevel: UserProfile['experienceLevel'];
  splitType: string;
}

// App State
export interface AppState {
  user: UserProfile | null;
  plan: WorkoutPlan | null;
  gamification: GamificationState;
  currentSession: WorkoutSession | null;
  sessions: WorkoutSession[];
}
