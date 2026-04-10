import type { UserProfile, WorkoutPlan, WorkoutDay, WorkoutExercise, MuscleGroup, PrehabExercise } from '@/types';
import { getExercisesForMuscle, getExercisesByPattern, EXERCISES } from './exercises-db';
import { calculateNutrition } from './nutrition-engine';

// HARDCODED PHYSIOLOGICAL LAWS - NON-NEGOTIABLE
const PHYSIOLOGICAL_LAWS = {
  // Session limits
  MAX_EXERCISES_PER_SESSION: 6,
  MAX_WORKING_SETS_PER_SESSION: 18,
  MIN_WORKING_SETS_PER_SESSION: 12,
  
  // Weekly volume (sets per muscle group)
  VOLUME_CEILING: { min: 10, max: 18 },
  
  // Volume by experience
  BEGINNER_VOLUME: { min: 10, max: 12 },
  INTERMEDIATE_VOLUME: { min: 12, max: 16 },
  ADVANCED_VOLUME: { min: 14, max: 18 },
  
  // Rep ranges by goal
  REP_RANGES: {
    strength: { compound: '3-5', isolation: '6-8' },
    hypertrophy: { compound: '6-10', isolation: '10-15' },
    fat_loss: { compound: '8-12', isolation: '12-15' },
    recomp: { compound: '6-10', isolation: '10-12' },
  },
  
  // Sets per exercise
  SETS_COMPOUND: 3,
  SETS_ISOLATION: 3,
  
  // Rest periods (seconds)
  REST_COMPOUND: 120,
  REST_ISOLATION: 60,
  REST_STRENGTH: 180,
  
  // RIR targets
  RIR: {
    compound: 2,
    isolation: 1,
    final_set: 0,
  },
} as const;

// Pre-hab protocols based on postural issues
const PREHAB_PROTOCOLS: Record<string, PrehabExercise[]> = {
  desk_worker: [
    { exercise: 'Wall Slides', durationOrReps: '2 x 10 reps', cue: 'Elbows and wrists against wall' },
    { exercise: 'Hip Flexor Stretch', durationOrReps: '2 x 30s/side', cue: 'Squeeze glute, tuck pelvis' },
    { exercise: 'Chin Tucks', durationOrReps: '3 x 10 reps', cue: 'Make double chin, hold 5s' },
  ],
  lower_back_pain: [
    { exercise: 'Dead Bug', durationOrReps: '2 x 8/side', cue: 'Press lower back into floor' },
    { exercise: 'Cat-Cow Stretch', durationOrReps: '2 x 10 reps', cue: 'Breathe into each position' },
    { exercise: 'Bird Dog', durationOrReps: '2 x 8/side', cue: 'Brace core, move slowly' },
  ],
  forward_head: [
    { exercise: 'Chin Tucks', durationOrReps: '3 x 10 reps', cue: 'Retract head, hold 5s' },
    { exercise: 'Thoracic Extension', durationOrReps: '2 x 10 reps', cue: 'Foam roller under upper back' },
    { exercise: 'Neck Stretches', durationOrReps: '30s/side', cue: 'Gentle ear to shoulder' },
  ],
  rounded_shoulders: [
    { exercise: 'Band Pull Aparts', durationOrReps: '3 x 15 reps', cue: 'Squeeze shoulder blades' },
    { exercise: 'Doorway Pec Stretch', durationOrReps: '2 x 30s/side', cue: 'Elbow at 90 degrees' },
    { exercise: 'Face Pulls', durationOrReps: '2 x 15 reps', cue: 'Pull to forehead level' },
  ],
  anterior_pelvic_tilt: [
    { exercise: 'Glute Bridge', durationOrReps: '3 x 12 reps', cue: 'Posterior tilt at top' },
    { exercise: 'Hip Flexor Stretch', durationOrReps: '2 x 45s/side', cue: 'Squeeze glute hard' },
    { exercise: 'Dead Bug', durationOrReps: '2 x 10/side', cue: 'Flatten lower back' },
  ],
  none: [
    { exercise: 'World\'s Greatest Stretch', durationOrReps: '5 reps/side', cue: 'Flow through positions' },
    { exercise: 'Arm Circles', durationOrReps: '20 each direction', cue: 'Gradually increase size' },
    { exercise: 'Leg Swings', durationOrReps: '15/leg', cue: 'Control the swing' },
  ],
};

// Split templates
interface SplitTemplate {
  name: string;
  days: {
    focus: string;
    muscleGroups: MuscleGroup[];
    patterns: string[];
  }[];
}

const SPLIT_TEMPLATES: Record<number, SplitTemplate> = {
  3: {
    name: 'Full Body',
    days: [
      {
        focus: 'Full Body A - Push Focus',
        muscleGroups: ['chest', 'quads', 'shoulders', 'triceps', 'core'],
        patterns: ['horizontal_push', 'squat', 'vertical_push', 'isolation'],
      },
      {
        focus: 'Full Body B - Pull Focus',
        muscleGroups: ['back', 'hamstrings', 'biceps', 'shoulders', 'core'],
        patterns: ['horizontal_pull', 'vertical_pull', 'hip_hinge', 'isolation'],
      },
      {
        focus: 'Full Body C - Legs Focus',
        muscleGroups: ['quads', 'glutes', 'hamstrings', 'calves', 'core'],
        patterns: ['squat', 'hip_hinge', 'lunge', 'isolation'],
      },
    ],
  },
  4: {
    name: 'Upper/Lower',
    days: [
      {
        focus: 'Upper A - Horizontal',
        muscleGroups: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
        patterns: ['horizontal_push', 'horizontal_pull', 'isolation'],
      },
      {
        focus: 'Lower A - Quad Focus',
        muscleGroups: ['quads', 'glutes', 'hamstrings', 'calves', 'core'],
        patterns: ['squat', 'lunge', 'isolation'],
      },
      {
        focus: 'Upper B - Vertical',
        muscleGroups: ['shoulders', 'back', 'chest', 'biceps', 'triceps'],
        patterns: ['vertical_push', 'vertical_pull', 'isolation'],
      },
      {
        focus: 'Lower B - Posterior Chain',
        muscleGroups: ['hamstrings', 'glutes', 'quads', 'calves', 'core'],
        patterns: ['hip_hinge', 'squat', 'isolation'],
      },
    ],
  },
  5: {
    name: 'Push/Pull/Legs + Upper/Lower',
    days: [
      {
        focus: 'Push',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        patterns: ['horizontal_push', 'vertical_push', 'isolation'],
      },
      {
        focus: 'Pull',
        muscleGroups: ['back', 'biceps', 'shoulders'],
        patterns: ['horizontal_pull', 'vertical_pull', 'isolation'],
      },
      {
        focus: 'Legs',
        muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves'],
        patterns: ['squat', 'hip_hinge', 'lunge', 'isolation'],
      },
      {
        focus: 'Upper',
        muscleGroups: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
        patterns: ['horizontal_push', 'horizontal_pull', 'vertical_push', 'isolation'],
      },
      {
        focus: 'Lower',
        muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'core'],
        patterns: ['squat', 'hip_hinge', 'isolation'],
      },
    ],
  },
  6: {
    name: 'Push/Pull/Legs x2',
    days: [
      {
        focus: 'Push A - Chest Focus',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        patterns: ['horizontal_push', 'vertical_push', 'isolation'],
      },
      {
        focus: 'Pull A - Width Focus',
        muscleGroups: ['back', 'biceps', 'shoulders'],
        patterns: ['vertical_pull', 'horizontal_pull', 'isolation'],
      },
      {
        focus: 'Legs A - Quad Focus',
        muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves'],
        patterns: ['squat', 'lunge', 'isolation'],
      },
      {
        focus: 'Push B - Shoulder Focus',
        muscleGroups: ['shoulders', 'chest', 'triceps'],
        patterns: ['vertical_push', 'horizontal_push', 'isolation'],
      },
      {
        focus: 'Pull B - Thickness Focus',
        muscleGroups: ['back', 'biceps', 'shoulders'],
        patterns: ['horizontal_pull', 'vertical_pull', 'isolation'],
      },
      {
        focus: 'Legs B - Posterior Focus',
        muscleGroups: ['hamstrings', 'glutes', 'quads', 'calves'],
        patterns: ['hip_hinge', 'squat', 'isolation'],
      },
    ],
  },
};

function getVolumeRange(experienceLevel: string) {
  switch (experienceLevel) {
    case 'beginner':
      return PHYSIOLOGICAL_LAWS.BEGINNER_VOLUME;
    case 'advanced':
      return PHYSIOLOGICAL_LAWS.ADVANCED_VOLUME;
    default:
      return PHYSIOLOGICAL_LAWS.INTERMEDIATE_VOLUME;
  }
}

function getRepRange(goal: string, isCompound: boolean) {
  const ranges = PHYSIOLOGICAL_LAWS.REP_RANGES[goal as keyof typeof PHYSIOLOGICAL_LAWS.REP_RANGES] 
    || PHYSIOLOGICAL_LAWS.REP_RANGES.hypertrophy;
  return isCompound ? ranges.compound : ranges.isolation;
}

function getRest(goal: string, isCompound: boolean) {
  if (goal === 'strength') return PHYSIOLOGICAL_LAWS.REST_STRENGTH;
  return isCompound ? PHYSIOLOGICAL_LAWS.REST_COMPOUND : PHYSIOLOGICAL_LAWS.REST_ISOLATION;
}

function selectExercisesForDay(
  dayTemplate: { focus: string; muscleGroups: MuscleGroup[]; patterns: string[] },
  userEquipment: string,
  experienceLevel: string,
  usedExerciseIds: Set<string>
): WorkoutExercise[] {
  const exercises: WorkoutExercise[] = [];
  const maxExercises = PHYSIOLOGICAL_LAWS.MAX_EXERCISES_PER_SESSION;
  
  // Priority order: compounds first, then isolations
  const compoundPatterns = ['horizontal_push', 'horizontal_pull', 'vertical_push', 'vertical_pull', 'squat', 'hip_hinge', 'lunge'];
  
  // First pass: add compound movements
  for (const pattern of dayTemplate.patterns) {
    if (exercises.length >= maxExercises - 1) break; // Leave room for isolation
    if (!compoundPatterns.includes(pattern)) continue;
    
    const availableExercises = getExercisesByPattern(pattern, userEquipment as any)
      .filter(ex => !usedExerciseIds.has(ex.id))
      .filter(ex => experienceLevel === 'beginner' ? ex.difficulty === 'beginner' : true);
    
    if (availableExercises.length > 0) {
      // Pick the best exercise for the pattern
      const selected = availableExercises[0];
      usedExerciseIds.add(selected.id);
      
      const isCompound = compoundPatterns.includes(selected.movementPattern);
      exercises.push({
        exerciseId: selected.id,
        name: selected.name,
        sets: PHYSIOLOGICAL_LAWS.SETS_COMPOUND,
        reps: getRepRange('hypertrophy', isCompound),
        restSeconds: getRest('hypertrophy', isCompound),
        rir: PHYSIOLOGICAL_LAWS.RIR.compound,
        biomechanicalCue: selected.biomechanicalCue,
      });
    }
  }
  
  // Second pass: add isolation movements for each target muscle
  for (const muscleGroup of dayTemplate.muscleGroups) {
    if (exercises.length >= maxExercises) break;
    
    const isolationExercises = getExercisesForMuscle(muscleGroup, userEquipment as any, experienceLevel)
      .filter(ex => ex.movementPattern === 'isolation')
      .filter(ex => !usedExerciseIds.has(ex.id));
    
    if (isolationExercises.length > 0) {
      const selected = isolationExercises[0];
      usedExerciseIds.add(selected.id);
      
      exercises.push({
        exerciseId: selected.id,
        name: selected.name,
        sets: PHYSIOLOGICAL_LAWS.SETS_ISOLATION,
        reps: getRepRange('hypertrophy', false),
        restSeconds: getRest('hypertrophy', false),
        rir: PHYSIOLOGICAL_LAWS.RIR.isolation,
        biomechanicalCue: selected.biomechanicalCue,
      });
    }
  }
  
  // Ensure we have at least some exercises
  if (exercises.length < 4) {
    // Add more from muscle groups
    for (const muscleGroup of dayTemplate.muscleGroups) {
      if (exercises.length >= maxExercises) break;
      
      const moreExercises = getExercisesForMuscle(muscleGroup, userEquipment as any)
        .filter(ex => !usedExerciseIds.has(ex.id));
      
      if (moreExercises.length > 0) {
        const selected = moreExercises[0];
        usedExerciseIds.add(selected.id);
        
        const isCompound = compoundPatterns.includes(selected.movementPattern);
        exercises.push({
          exerciseId: selected.id,
          name: selected.name,
          sets: isCompound ? PHYSIOLOGICAL_LAWS.SETS_COMPOUND : PHYSIOLOGICAL_LAWS.SETS_ISOLATION,
          reps: getRepRange('hypertrophy', isCompound),
          restSeconds: getRest('hypertrophy', isCompound),
          rir: isCompound ? PHYSIOLOGICAL_LAWS.RIR.compound : PHYSIOLOGICAL_LAWS.RIR.isolation,
          biomechanicalCue: selected.biomechanicalCue,
        });
      }
    }
  }
  
  return exercises.slice(0, maxExercises);
}

function calculateWeeklyVolume(days: WorkoutDay[]): Record<MuscleGroup, number> {
  const volume: Record<string, number> = {};
  
  for (const day of days) {
    for (const exercise of day.exercises) {
      const ex = EXERCISES.find(e => e.id === exercise.exerciseId);
      if (ex) {
        volume[ex.muscleGroup] = (volume[ex.muscleGroup] || 0) + exercise.sets;
      }
    }
  }
  
  return volume as Record<MuscleGroup, number>;
}

function getPrehab(posturalIssues: string[]): PrehabExercise[] {
  if (posturalIssues.length === 0 || posturalIssues.includes('none')) {
    return PREHAB_PROTOCOLS.none;
  }
  
  // Combine protocols for multiple issues, limit to 4 exercises
  const allExercises: PrehabExercise[] = [];
  const seenExercises = new Set<string>();
  
  for (const issue of posturalIssues) {
    const protocol = PREHAB_PROTOCOLS[issue];
    if (protocol) {
      for (const ex of protocol) {
        if (!seenExercises.has(ex.exercise)) {
          seenExercises.add(ex.exercise);
          allExercises.push(ex);
        }
      }
    }
  }
  
  return allExercises.slice(0, 4);
}

export function generateWorkoutPlan(user: UserProfile): WorkoutPlan {
  const splitTemplate = SPLIT_TEMPLATES[user.trainingDays];
  const usedExerciseIds = new Set<string>();
  
  // Generate each day
  const days: WorkoutDay[] = splitTemplate.days.map((dayTemplate, index) => {
    const exercises = selectExercisesForDay(
      dayTemplate,
      user.equipment,
      user.experienceLevel,
      usedExerciseIds
    );
    
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const estimatedDuration = exercises.reduce((sum, ex) => {
      const setTime = 45; // Average time per set in seconds
      const restTime = ex.restSeconds * (ex.sets - 1);
      return sum + (setTime * ex.sets) + restTime;
    }, 0);
    
    return {
      dayId: `day-${index + 1}`,
      dayNumber: index + 1,
      focus: dayTemplate.focus,
      exercises,
      totalSets,
      estimatedDuration: Math.round(estimatedDuration / 60), // Convert to minutes
    };
  });
  
  // Calculate weekly volume
  const weeklyVolume = calculateWeeklyVolume(days);
  
  // Get pre-hab exercises
  const prehab = getPrehab(user.posturalIssues);
  
  // Calculate nutrition
  const nutrition = calculateNutrition(user);
  
  // Generate progression rules
  const progressionRules = {
    system: 'Double Progression',
    rule: 'When you hit the top of the rep range for all sets, increase weight by 2.5-5kg next session.',
    rirTarget: `${PHYSIOLOGICAL_LAWS.RIR.compound} RIR for compounds, ${PHYSIOLOGICAL_LAWS.RIR.isolation}-${PHYSIOLOGICAL_LAWS.RIR.final_set} RIR for isolations`,
  };
  
  return {
    id: `plan-${Date.now()}`,
    userId: user.id,
    splitType: splitTemplate.name,
    weeklyVolume,
    days,
    progressionRules,
    prehab,
    nutrition,
    createdAt: new Date().toISOString(),
  };
}

// Validate that a plan meets physiological laws
export function validatePlan(plan: WorkoutPlan): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const day of plan.days) {
    // Check exercise count
    if (day.exercises.length > PHYSIOLOGICAL_LAWS.MAX_EXERCISES_PER_SESSION) {
      errors.push(`${day.focus}: Exceeds max exercises (${day.exercises.length}/${PHYSIOLOGICAL_LAWS.MAX_EXERCISES_PER_SESSION})`);
    }
    
    // Check total sets
    if (day.totalSets > PHYSIOLOGICAL_LAWS.MAX_WORKING_SETS_PER_SESSION) {
      errors.push(`${day.focus}: Exceeds max sets (${day.totalSets}/${PHYSIOLOGICAL_LAWS.MAX_WORKING_SETS_PER_SESSION})`);
    }
  }
  
  // Check weekly volume per muscle group
  for (const [muscle, sets] of Object.entries(plan.weeklyVolume)) {
    if (sets > PHYSIOLOGICAL_LAWS.VOLUME_CEILING.max) {
      errors.push(`${muscle}: Weekly volume too high (${sets}/${PHYSIOLOGICAL_LAWS.VOLUME_CEILING.max} sets)`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
