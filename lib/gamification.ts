import type { GamificationState, Achievement, PersonalRecord, WorkoutSession, SetLog } from '@/types';

// XP rewards
export const XP_REWARDS = {
  WORKOUT_COMPLETE: 100,
  PR_SET: 50,
  STREAK_DAY: 25,
  WEEKLY_COMPLETION: 200,
  FIRST_WORKOUT: 150,
  SET_COMPLETED: 5,
} as const;

// Level thresholds and titles
export const LEVELS = [
  { level: 1, xp: 0, title: 'Rookie' },
  { level: 2, xp: 500, title: 'Apprentice' },
  { level: 3, xp: 1500, title: 'Warrior' },
  { level: 4, xp: 3000, title: 'Champion' },
  { level: 5, xp: 5000, title: 'Elite' },
  { level: 6, xp: 8000, title: 'Legend' },
  { level: 7, xp: 12000, title: 'Apex Predator' },
] as const;

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Complete your first workout',
    icon: 'trophy',
    target: 1,
  },
  {
    id: 'streak-7',
    name: 'Consistency King',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    target: 7,
  },
  {
    id: 'streak-30',
    name: 'Iron Will',
    description: 'Maintain a 30-day streak',
    icon: 'crown',
    target: 30,
  },
  {
    id: 'pr-hunter-10',
    name: 'PR Hunter',
    description: 'Set 10 personal records',
    icon: 'target',
    target: 10,
  },
  {
    id: 'pr-hunter-50',
    name: 'Record Breaker',
    description: 'Set 50 personal records',
    icon: 'medal',
    target: 50,
  },
  {
    id: 'volume-1000',
    name: 'Volume Master',
    description: 'Complete 1,000 total sets',
    icon: 'dumbbell',
    target: 1000,
  },
  {
    id: 'volume-5000',
    name: 'Iron Addict',
    description: 'Complete 5,000 total sets',
    icon: 'bolt',
    target: 5000,
  },
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: 'Complete all planned sessions in a week',
    icon: 'star',
    target: 1,
  },
  {
    id: 'level-5',
    name: 'Elite Status',
    description: 'Reach Level 5',
    icon: 'shield',
    target: 5,
  },
  {
    id: 'level-7',
    name: 'Apex Predator',
    description: 'Reach the maximum level',
    icon: 'crown',
    target: 7,
  },
  {
    id: 'workouts-10',
    name: 'Getting Started',
    description: 'Complete 10 workouts',
    icon: 'check',
    target: 10,
  },
  {
    id: 'workouts-50',
    name: 'Dedicated',
    description: 'Complete 50 workouts',
    icon: 'heart',
    target: 50,
  },
  {
    id: 'workouts-100',
    name: 'Centurion',
    description: 'Complete 100 workouts',
    icon: 'award',
    target: 100,
  },
];

// Initialize gamification state
export function initializeGamification(): GamificationState {
  return {
    xp: 0,
    level: 1,
    levelTitle: 'Rookie',
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    totalSets: 0,
    personalRecords: [],
    achievements: ACHIEVEMENT_DEFINITIONS.map(a => ({
      ...a,
      progress: 0,
      unlockedAt: undefined,
    })),
    weeklyProgress: {
      weekStart: getWeekStart(),
      plannedSessions: 0,
      completedSessions: 0,
      completedDays: [],
    },
  };
}

// Get the start of the current week (Monday)
function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

// Calculate level from XP
export function calculateLevel(xp: number): { level: number; title: string; progress: number; nextLevelXp: number } {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
      break;
    }
  }
  
  const xpInLevel = xp - currentLevel.xp;
  const xpNeeded = nextLevel.xp - currentLevel.xp;
  const progress = xpNeeded > 0 ? (xpInLevel / xpNeeded) * 100 : 100;
  
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    progress: Math.min(progress, 100),
    nextLevelXp: nextLevel.xp,
  };
}

// Check if a set is a PR
export function checkForPR(
  exerciseId: string,
  exerciseName: string,
  weight: number,
  reps: number,
  existingPRs: PersonalRecord[]
): PersonalRecord | null {
  const existingPR = existingPRs.find(pr => pr.exerciseId === exerciseId);
  
  // Calculate estimated 1RM using Epley formula
  const currentE1RM = weight * (1 + reps / 30);
  const existingE1RM = existingPR 
    ? existingPR.weight * (1 + existingPR.reps / 30) 
    : 0;
  
  if (currentE1RM > existingE1RM) {
    return {
      exerciseId,
      exerciseName,
      weight,
      reps,
      date: new Date().toISOString(),
    };
  }
  
  return null;
}

// Process workout completion and update gamification
export function processWorkoutCompletion(
  session: WorkoutSession,
  currentState: GamificationState,
  plannedDays: number
): {
  newState: GamificationState;
  xpGained: number;
  newPRs: PersonalRecord[];
  newAchievements: Achievement[];
  leveledUp: boolean;
  newLevel?: number;
} {
  let xpGained = XP_REWARDS.WORKOUT_COMPLETE;
  const newPRs: PersonalRecord[] = [];
  const newAchievements: Achievement[] = [];
  
  // Count completed sets
  let completedSets = 0;
  for (const log of session.exerciseLogs) {
    for (const set of log.sets) {
      if (set.completed) {
        completedSets++;
        
        // Check for PRs
        const pr = checkForPR(
          log.exerciseId,
          log.exerciseName,
          set.weight,
          set.reps,
          currentState.personalRecords
        );
        
        if (pr) {
          newPRs.push(pr);
          xpGained += XP_REWARDS.PR_SET;
        }
      }
    }
  }
  
  // Add XP for sets
  xpGained += completedSets * XP_REWARDS.SET_COMPLETED;
  
  // Update state
  const newState = { ...currentState };
  
  // First workout bonus
  if (newState.totalWorkouts === 0) {
    xpGained += XP_REWARDS.FIRST_WORKOUT;
  }
  
  // Update totals
  newState.totalWorkouts += 1;
  newState.totalSets += completedSets;
  newState.xp += xpGained;
  
  // Update PRs
  for (const pr of newPRs) {
    const existingIndex = newState.personalRecords.findIndex(
      p => p.exerciseId === pr.exerciseId
    );
    if (existingIndex >= 0) {
      newState.personalRecords[existingIndex] = pr;
    } else {
      newState.personalRecords.push(pr);
    }
  }
  
  // Update streak
  const today = new Date();
  const lastWorkout = currentState.weeklyProgress.completedDays.length > 0
    ? new Date(currentState.weeklyProgress.completedDays[currentState.weeklyProgress.completedDays.length - 1])
    : null;
  
  if (lastWorkout) {
    const dayDiff = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff <= 1) {
      newState.currentStreak += 1;
      xpGained += XP_REWARDS.STREAK_DAY;
    } else if (dayDiff > 2) {
      newState.currentStreak = 1; // Reset streak
    }
  } else {
    newState.currentStreak = 1;
  }
  
  // Update longest streak
  if (newState.currentStreak > newState.longestStreak) {
    newState.longestStreak = newState.currentStreak;
  }
  
  // Update weekly progress
  const currentWeekStart = getWeekStart();
  if (newState.weeklyProgress.weekStart !== currentWeekStart) {
    // New week
    newState.weeklyProgress = {
      weekStart: currentWeekStart,
      plannedSessions: plannedDays,
      completedSessions: 1,
      completedDays: [today.toISOString()],
    };
  } else {
    newState.weeklyProgress.completedSessions += 1;
    newState.weeklyProgress.completedDays.push(today.toISOString());
    
    // Check for perfect week
    if (newState.weeklyProgress.completedSessions >= newState.weeklyProgress.plannedSessions) {
      xpGained += XP_REWARDS.WEEKLY_COMPLETION;
    }
  }
  
  // Calculate new level
  const oldLevel = currentState.level;
  const levelInfo = calculateLevel(newState.xp);
  newState.level = levelInfo.level;
  newState.levelTitle = levelInfo.title;
  const leveledUp = levelInfo.level > oldLevel;
  
  // Check achievements
  newState.achievements = newState.achievements.map(achievement => {
    if (achievement.unlockedAt) return achievement; // Already unlocked
    
    let progress = achievement.progress || 0;
    
    switch (achievement.id) {
      case 'first-blood':
        progress = newState.totalWorkouts;
        break;
      case 'streak-7':
      case 'streak-30':
        progress = newState.currentStreak;
        break;
      case 'pr-hunter-10':
      case 'pr-hunter-50':
        progress = newState.personalRecords.length;
        break;
      case 'volume-1000':
      case 'volume-5000':
        progress = newState.totalSets;
        break;
      case 'perfect-week':
        progress = newState.weeklyProgress.completedSessions >= newState.weeklyProgress.plannedSessions ? 1 : 0;
        break;
      case 'level-5':
        progress = newState.level >= 5 ? 5 : newState.level;
        break;
      case 'level-7':
        progress = newState.level;
        break;
      case 'workouts-10':
      case 'workouts-50':
      case 'workouts-100':
        progress = newState.totalWorkouts;
        break;
    }
    
    const unlocked = progress >= (achievement.target || 0);
    
    if (unlocked && !achievement.unlockedAt) {
      newAchievements.push(achievement);
      return {
        ...achievement,
        progress,
        unlockedAt: new Date().toISOString(),
      };
    }
    
    return { ...achievement, progress };
  });
  
  return {
    newState,
    xpGained,
    newPRs,
    newAchievements,
    leveledUp,
    newLevel: leveledUp ? levelInfo.level : undefined,
  };
}
