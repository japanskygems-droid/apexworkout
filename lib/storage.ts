import type { AppState, UserProfile, WorkoutPlan, GamificationState, WorkoutSession } from '@/types';
import { initializeGamification } from './gamification';

const STORAGE_KEYS = {
  USER: 'apex_user',
  PLAN: 'apex_plan',
  GAMIFICATION: 'apex_gamification',
  SESSIONS: 'apex_sessions',
  CURRENT_SESSION: 'apex_current_session',
} as const;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Generic storage helpers
function getItem<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

function removeItem(key: string): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// User Profile
export function saveUser(user: UserProfile): void {
  setItem(STORAGE_KEYS.USER, user);
}

export function getUser(): UserProfile | null {
  return getItem<UserProfile>(STORAGE_KEYS.USER);
}

export function clearUser(): void {
  removeItem(STORAGE_KEYS.USER);
}

// Workout Plan
export function savePlan(plan: WorkoutPlan): void {
  setItem(STORAGE_KEYS.PLAN, plan);
}

export function getPlan(): WorkoutPlan | null {
  return getItem<WorkoutPlan>(STORAGE_KEYS.PLAN);
}

export function clearPlan(): void {
  removeItem(STORAGE_KEYS.PLAN);
}

// Gamification State
export function saveGamification(state: GamificationState): void {
  setItem(STORAGE_KEYS.GAMIFICATION, state);
}

export function getGamification(): GamificationState {
  const saved = getItem<GamificationState>(STORAGE_KEYS.GAMIFICATION);
  return saved || initializeGamification();
}

export function clearGamification(): void {
  removeItem(STORAGE_KEYS.GAMIFICATION);
}

// Workout Sessions
export function saveSessions(sessions: WorkoutSession[]): void {
  setItem(STORAGE_KEYS.SESSIONS, sessions);
}

export function getSessions(): WorkoutSession[] {
  return getItem<WorkoutSession[]>(STORAGE_KEYS.SESSIONS) || [];
}

export function addSession(session: WorkoutSession): void {
  const sessions = getSessions();
  sessions.push(session);
  saveSessions(sessions);
}

export function clearSessions(): void {
  removeItem(STORAGE_KEYS.SESSIONS);
}

// Current Session (in-progress workout)
export function saveCurrentSession(session: WorkoutSession | null): void {
  if (session) {
    setItem(STORAGE_KEYS.CURRENT_SESSION, session);
  } else {
    removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }
}

export function getCurrentSession(): WorkoutSession | null {
  return getItem<WorkoutSession>(STORAGE_KEYS.CURRENT_SESSION);
}

// Get full app state
export function getAppState(): AppState {
  return {
    user: getUser(),
    plan: getPlan(),
    gamification: getGamification(),
    currentSession: getCurrentSession(),
    sessions: getSessions(),
  };
}

// Clear all data
export function clearAllData(): void {
  clearUser();
  clearPlan();
  clearGamification();
  clearSessions();
  saveCurrentSession(null);
}

// Export plan to clipboard-friendly format
export function exportPlanToMarkdown(plan: WorkoutPlan): string {
  let markdown = `# ${plan.splitType} Training Program\n\n`;
  
  // Nutrition
  markdown += `## Nutrition\n`;
  markdown += `- Target: ${plan.nutrition.targetCalories} kcal/day\n`;
  markdown += `- Protein: ${plan.nutrition.macros.proteinG}g\n`;
  markdown += `- Carbs: ${plan.nutrition.macros.carbsG}g\n`;
  markdown += `- Fat: ${plan.nutrition.macros.fatG}g\n\n`;
  
  // Progression
  markdown += `## Progression: ${plan.progressionRules.system}\n`;
  markdown += `${plan.progressionRules.rule}\n\n`;
  
  // Pre-hab
  markdown += `## Pre-hab Routine\n`;
  for (const ex of plan.prehab) {
    markdown += `- ${ex.exercise}: ${ex.durationOrReps}\n`;
  }
  markdown += '\n';
  
  // Weekly Split
  markdown += `## Weekly Split\n`;
  for (const day of plan.days) {
    markdown += `\n### Day ${day.dayNumber}: ${day.focus}\n`;
    markdown += `*${day.totalSets} sets | ~${day.estimatedDuration} min*\n\n`;
    markdown += `| Exercise | Sets | Reps | Rest | RIR |\n`;
    markdown += `|----------|------|------|------|-----|\n`;
    for (const ex of day.exercises) {
      markdown += `| ${ex.name} | ${ex.sets} | ${ex.reps} | ${ex.restSeconds}s | ${ex.rir} |\n`;
    }
  }
  
  return markdown;
}
