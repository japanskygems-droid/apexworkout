import type { Exercise, EquipmentType } from '@/types';

// Comprehensive exercise database with equipment filtering
export const EXERCISES: Exercise[] = [
  // CHEST - Horizontal Push
  {
    id: 'bench-press-barbell',
    name: 'Barbell Bench Press',
    muscleGroup: 'chest',
    movementPattern: 'horizontal_push',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Retract scapula, arch upper back, drive feet into floor'
  },
  {
    id: 'bench-press-dumbbell',
    name: 'Dumbbell Bench Press',
    muscleGroup: 'chest',
    movementPattern: 'horizontal_push',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Lower with control, press in slight arc toward midline'
  },
  {
    id: 'incline-press-dumbbell',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'chest',
    movementPattern: 'horizontal_push',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Set bench to 30-45 degrees, focus on upper chest squeeze'
  },
  {
    id: 'incline-press-barbell',
    name: 'Incline Barbell Press',
    muscleGroup: 'chest',
    movementPattern: 'horizontal_push',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Touch upper chest, elbows at 45 degrees'
  },
  {
    id: 'cable-fly',
    name: 'Cable Fly',
    muscleGroup: 'chest',
    movementPattern: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Slight elbow bend, squeeze at peak contraction'
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    muscleGroup: 'chest',
    movementPattern: 'isolation',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Keep soft elbow bend, lower until chest stretch, control descent'
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    muscleGroup: 'chest',
    movementPattern: 'horizontal_push',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    biomechanicalCue: 'Body in straight line, elbows 45 degrees from torso'
  },
  {
    id: 'decline-push-up',
    name: 'Decline Push-Up',
    muscleGroup: 'chest',
    movementPattern: 'horizontal_push',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Feet elevated, emphasizes upper chest and shoulders'
  },
  {
    id: 'chest-dip',
    name: 'Chest Dip',
    muscleGroup: 'chest',
    movementPattern: 'horizontal_push',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Lean forward 30 degrees, lower until shoulder stretch'
  },
  {
    id: 'machine-chest-press',
    name: 'Machine Chest Press',
    muscleGroup: 'chest',
    movementPattern: 'horizontal_push',
    equipment: ['machine'],
    difficulty: 'beginner',
    biomechanicalCue: 'Adjust seat so handles align with mid-chest'
  },

  // BACK - Horizontal Pull
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    muscleGroup: 'back',
    movementPattern: 'horizontal_pull',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Hinge at 45 degrees, pull to lower chest, squeeze lats'
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    muscleGroup: 'back',
    movementPattern: 'horizontal_pull',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Support on bench, drive elbow past torso, control negative'
  },
  {
    id: 'cable-row',
    name: 'Seated Cable Row',
    muscleGroup: 'back',
    movementPattern: 'horizontal_pull',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Keep chest tall, retract shoulder blades, pause at contraction'
  },
  {
    id: 'chest-supported-row',
    name: 'Chest Supported Dumbbell Row',
    muscleGroup: 'back',
    movementPattern: 'horizontal_pull',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Chest on incline bench, eliminates momentum, pure lat work'
  },
  {
    id: 'inverted-row',
    name: 'Inverted Row',
    muscleGroup: 'back',
    movementPattern: 'horizontal_pull',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    biomechanicalCue: 'Body straight, pull chest to bar, squeeze shoulder blades'
  },
  {
    id: 'machine-row',
    name: 'Machine Row',
    muscleGroup: 'back',
    movementPattern: 'horizontal_pull',
    equipment: ['machine'],
    difficulty: 'beginner',
    biomechanicalCue: 'Chest against pad, focus on lat stretch and contraction'
  },

  // BACK - Vertical Pull
  {
    id: 'pull-up',
    name: 'Pull-Up',
    muscleGroup: 'back',
    movementPattern: 'vertical_pull',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Lead with chest, drive elbows down and back'
  },
  {
    id: 'chin-up',
    name: 'Chin-Up',
    muscleGroup: 'back',
    movementPattern: 'vertical_pull',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Supinated grip, great for biceps and lower lats'
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'back',
    movementPattern: 'vertical_pull',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Lean back slightly, pull to upper chest, control return'
  },
  {
    id: 'single-arm-lat-pulldown',
    name: 'Single Arm Lat Pulldown',
    muscleGroup: 'back',
    movementPattern: 'vertical_pull',
    equipment: ['cable'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Allows greater ROM and lat stretch at top'
  },

  // SHOULDERS - Vertical Push
  {
    id: 'overhead-press-barbell',
    name: 'Overhead Press',
    muscleGroup: 'shoulders',
    movementPattern: 'vertical_push',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Brace core, press in straight line, head through at top'
  },
  {
    id: 'overhead-press-dumbbell',
    name: 'Dumbbell Shoulder Press',
    muscleGroup: 'shoulders',
    movementPattern: 'vertical_push',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Neutral or pronated grip, full ROM without flaring elbows'
  },
  {
    id: 'arnold-press',
    name: 'Arnold Press',
    muscleGroup: 'shoulders',
    movementPattern: 'vertical_push',
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Rotate palms as you press, hits all three delt heads'
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-Up',
    muscleGroup: 'shoulders',
    movementPattern: 'vertical_push',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Hips high, head between arms, mimic overhead press angle'
  },
  {
    id: 'handstand-push-up',
    name: 'Handstand Push-Up',
    muscleGroup: 'shoulders',
    movementPattern: 'vertical_push',
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    biomechanicalCue: 'Wall assisted, control descent, full lockout'
  },
  {
    id: 'machine-shoulder-press',
    name: 'Machine Shoulder Press',
    muscleGroup: 'shoulders',
    movementPattern: 'vertical_push',
    equipment: ['machine'],
    difficulty: 'beginner',
    biomechanicalCue: 'Adjust seat so handles at shoulder height'
  },

  // SHOULDERS - Isolation
  {
    id: 'lateral-raise-dumbbell',
    name: 'Dumbbell Lateral Raise',
    muscleGroup: 'shoulders',
    movementPattern: 'isolation',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Slight forward lean, lead with pinkies, stop at shoulder height'
  },
  {
    id: 'lateral-raise-cable',
    name: 'Cable Lateral Raise',
    muscleGroup: 'shoulders',
    movementPattern: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Constant tension throughout ROM, great for side delts'
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    muscleGroup: 'shoulders',
    movementPattern: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Pull to forehead, externally rotate at end, squeeze rear delts'
  },
  {
    id: 'rear-delt-fly-dumbbell',
    name: 'Rear Delt Fly',
    muscleGroup: 'shoulders',
    movementPattern: 'isolation',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Bent over, arms perpendicular to torso, squeeze at top'
  },
  {
    id: 'band-pull-apart',
    name: 'Band Pull Apart',
    muscleGroup: 'shoulders',
    movementPattern: 'isolation',
    equipment: ['bands'],
    difficulty: 'beginner',
    biomechanicalCue: 'Arms straight, pull band to chest level, retract scapula'
  },

  // BICEPS
  {
    id: 'barbell-curl',
    name: 'Barbell Curl',
    muscleGroup: 'biceps',
    movementPattern: 'isolation',
    equipment: ['barbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Elbows pinned, no swinging, squeeze at top'
  },
  {
    id: 'dumbbell-curl',
    name: 'Dumbbell Curl',
    muscleGroup: 'biceps',
    movementPattern: 'isolation',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Supinate as you curl, control the negative'
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    muscleGroup: 'biceps',
    movementPattern: 'isolation',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Neutral grip, targets brachialis for arm thickness'
  },
  {
    id: 'incline-curl',
    name: 'Incline Dumbbell Curl',
    muscleGroup: 'biceps',
    movementPattern: 'isolation',
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Bench at 45 degrees, arms hang straight, max bicep stretch'
  },
  {
    id: 'cable-curl',
    name: 'Cable Curl',
    muscleGroup: 'biceps',
    movementPattern: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Constant tension, great for peak contraction'
  },
  {
    id: 'concentration-curl',
    name: 'Concentration Curl',
    muscleGroup: 'biceps',
    movementPattern: 'isolation',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Elbow braced on inner thigh, isolates bicep peak'
  },

  // TRICEPS
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown',
    muscleGroup: 'triceps',
    movementPattern: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Elbows at sides, full extension, squeeze at bottom'
  },
  {
    id: 'overhead-tricep-extension',
    name: 'Overhead Tricep Extension',
    muscleGroup: 'triceps',
    movementPattern: 'isolation',
    equipment: ['dumbbell', 'cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Elbows by ears, lower behind head, stretch long head'
  },
  {
    id: 'skull-crusher',
    name: 'Skull Crusher',
    muscleGroup: 'triceps',
    movementPattern: 'isolation',
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Lower to forehead, elbows stationary, extend explosively'
  },
  {
    id: 'close-grip-bench',
    name: 'Close Grip Bench Press',
    muscleGroup: 'triceps',
    movementPattern: 'horizontal_push',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Hands shoulder width, elbows tucked, tricep emphasis'
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-Up',
    muscleGroup: 'triceps',
    movementPattern: 'horizontal_push',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Hands form diamond, elbows close to body'
  },
  {
    id: 'tricep-dip',
    name: 'Tricep Dip',
    muscleGroup: 'triceps',
    movementPattern: 'isolation',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Torso upright, elbows back not flared, full ROM'
  },
  {
    id: 'tricep-kickback',
    name: 'Tricep Kickback',
    muscleGroup: 'triceps',
    movementPattern: 'isolation',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Upper arm parallel to floor, extend and squeeze'
  },

  // QUADS
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    muscleGroup: 'quads',
    movementPattern: 'squat',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Brace core, sit back and down, knees track toes'
  },
  {
    id: 'front-squat',
    name: 'Front Squat',
    muscleGroup: 'quads',
    movementPattern: 'squat',
    equipment: ['barbell'],
    difficulty: 'advanced',
    biomechanicalCue: 'Elbows high, upright torso, quad dominant'
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    muscleGroup: 'quads',
    movementPattern: 'squat',
    equipment: ['dumbbell', 'kettlebell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Hold at chest, sit between heels, great for learning'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroup: 'quads',
    movementPattern: 'squat',
    equipment: ['machine'],
    difficulty: 'beginner',
    biomechanicalCue: 'Feet shoulder width, lower until 90 degrees, no butt lift'
  },
  {
    id: 'hack-squat',
    name: 'Hack Squat',
    muscleGroup: 'quads',
    movementPattern: 'squat',
    equipment: ['machine'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Shoulders against pad, feet low and close for quad focus'
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    muscleGroup: 'quads',
    movementPattern: 'isolation',
    equipment: ['machine'],
    difficulty: 'beginner',
    biomechanicalCue: 'Squeeze at top, control descent, great quad isolation'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    muscleGroup: 'quads',
    movementPattern: 'lunge',
    equipment: ['dumbbell', 'bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Rear foot elevated, torso upright, knee over toe'
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    muscleGroup: 'quads',
    movementPattern: 'lunge',
    equipment: ['dumbbell', 'bodyweight', 'barbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Long stride, control descent, drive through front heel'
  },
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    muscleGroup: 'quads',
    movementPattern: 'squat',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    biomechanicalCue: 'Arms forward for balance, full depth, pause at bottom'
  },
  {
    id: 'pistol-squat',
    name: 'Pistol Squat',
    muscleGroup: 'quads',
    movementPattern: 'squat',
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    biomechanicalCue: 'One leg extended, full depth, balance and strength'
  },

  // HAMSTRINGS
  {
    id: 'romanian-deadlift-barbell',
    name: 'Romanian Deadlift',
    muscleGroup: 'hamstrings',
    movementPattern: 'hip_hinge',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Soft knees, hinge at hips, bar close to legs, feel stretch'
  },
  {
    id: 'romanian-deadlift-dumbbell',
    name: 'Dumbbell Romanian Deadlift',
    muscleGroup: 'hamstrings',
    movementPattern: 'hip_hinge',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Dumbbells in front of thighs, push hips back, hamstring stretch'
  },
  {
    id: 'leg-curl-lying',
    name: 'Lying Leg Curl',
    muscleGroup: 'hamstrings',
    movementPattern: 'isolation',
    equipment: ['machine'],
    difficulty: 'beginner',
    biomechanicalCue: 'Hips pressed into pad, curl heels to glutes'
  },
  {
    id: 'leg-curl-seated',
    name: 'Seated Leg Curl',
    muscleGroup: 'hamstrings',
    movementPattern: 'isolation',
    equipment: ['machine'],
    difficulty: 'beginner',
    biomechanicalCue: 'Sit upright, full ROM, emphasizes hamstring at stretch'
  },
  {
    id: 'good-morning',
    name: 'Good Morning',
    muscleGroup: 'hamstrings',
    movementPattern: 'hip_hinge',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Bar on back, hinge until torso parallel, feel hamstring stretch'
  },
  {
    id: 'nordic-curl',
    name: 'Nordic Hamstring Curl',
    muscleGroup: 'hamstrings',
    movementPattern: 'isolation',
    equipment: ['bodyweight'],
    difficulty: 'advanced',
    biomechanicalCue: 'Ankles secured, lower with control, eccentric focus'
  },
  {
    id: 'single-leg-rdl',
    name: 'Single Leg RDL',
    muscleGroup: 'hamstrings',
    movementPattern: 'hip_hinge',
    equipment: ['dumbbell', 'bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Hinge on one leg, rear leg extends back, balance and stretch'
  },
  {
    id: 'glute-ham-raise',
    name: 'Glute Ham Raise',
    muscleGroup: 'hamstrings',
    movementPattern: 'isolation',
    equipment: ['machine'],
    difficulty: 'advanced',
    biomechanicalCue: 'Hip extension then knee flexion, complete posterior chain'
  },

  // GLUTES
  {
    id: 'hip-thrust-barbell',
    name: 'Barbell Hip Thrust',
    muscleGroup: 'glutes',
    movementPattern: 'hip_hinge',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Upper back on bench, drive through heels, squeeze at top'
  },
  {
    id: 'hip-thrust-dumbbell',
    name: 'Dumbbell Hip Thrust',
    muscleGroup: 'glutes',
    movementPattern: 'hip_hinge',
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Dumbbell on hips, full hip extension, pause at top'
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    muscleGroup: 'glutes',
    movementPattern: 'hip_hinge',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    biomechanicalCue: 'Feet flat, drive hips up, squeeze glutes hard at top'
  },
  {
    id: 'cable-pull-through',
    name: 'Cable Pull Through',
    muscleGroup: 'glutes',
    movementPattern: 'hip_hinge',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Face away from cable, hinge and extend, glute squeeze'
  },
  {
    id: 'kickback-cable',
    name: 'Cable Kickback',
    muscleGroup: 'glutes',
    movementPattern: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Ankle strap, kick back and squeeze, dont arch lower back'
  },
  {
    id: 'sumo-deadlift',
    name: 'Sumo Deadlift',
    muscleGroup: 'glutes',
    movementPattern: 'hip_hinge',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Wide stance, toes out, push floor apart, hips through'
  },

  // CALVES
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    muscleGroup: 'calves',
    movementPattern: 'isolation',
    equipment: ['machine', 'dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Full stretch at bottom, pause at top, straight legs'
  },
  {
    id: 'seated-calf-raise',
    name: 'Seated Calf Raise',
    muscleGroup: 'calves',
    movementPattern: 'isolation',
    equipment: ['machine'],
    difficulty: 'beginner',
    biomechanicalCue: 'Bent knee targets soleus, full ROM, controlled tempo'
  },
  {
    id: 'single-leg-calf-raise',
    name: 'Single Leg Calf Raise',
    muscleGroup: 'calves',
    movementPattern: 'isolation',
    equipment: ['bodyweight', 'dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Hold wall for balance, full stretch and squeeze'
  },

  // CORE
  {
    id: 'plank',
    name: 'Plank',
    muscleGroup: 'core',
    movementPattern: 'isolation',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    biomechanicalCue: 'Straight line from head to heels, brace abs, breathe'
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroup: 'core',
    movementPattern: 'isolation',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    biomechanicalCue: 'Lower back pressed to floor, opposite arm and leg extend'
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    muscleGroup: 'core',
    movementPattern: 'isolation',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Minimize swing, curl pelvis up, control descent'
  },
  {
    id: 'cable-crunch',
    name: 'Cable Crunch',
    muscleGroup: 'core',
    movementPattern: 'isolation',
    equipment: ['cable'],
    difficulty: 'beginner',
    biomechanicalCue: 'Kneel facing cable, crunch ribs to pelvis, squeeze abs'
  },
  {
    id: 'ab-wheel',
    name: 'Ab Wheel Rollout',
    muscleGroup: 'core',
    movementPattern: 'isolation',
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Extend fully, brace core, dont let hips sag'
  },
  {
    id: 'pallof-press',
    name: 'Pallof Press',
    muscleGroup: 'core',
    movementPattern: 'isolation',
    equipment: ['cable', 'bands'],
    difficulty: 'beginner',
    biomechanicalCue: 'Resist rotation, press out and hold, anti-rotation'
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunch',
    muscleGroup: 'core',
    movementPattern: 'isolation',
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    biomechanicalCue: 'Shoulder to opposite knee, full rotation, controlled'
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    muscleGroup: 'core',
    movementPattern: 'isolation',
    equipment: ['bodyweight', 'dumbbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Lean back, feet up, rotate fully side to side'
  },

  // DEADLIFT VARIATIONS
  {
    id: 'conventional-deadlift',
    name: 'Conventional Deadlift',
    muscleGroup: 'back',
    movementPattern: 'hip_hinge',
    equipment: ['barbell'],
    difficulty: 'intermediate',
    biomechanicalCue: 'Hips back, chest up, drive through heels, lockout with glutes'
  },
  {
    id: 'trap-bar-deadlift',
    name: 'Trap Bar Deadlift',
    muscleGroup: 'back',
    movementPattern: 'hip_hinge',
    equipment: ['barbell'],
    difficulty: 'beginner',
    biomechanicalCue: 'Stand inside bar, more quad involvement, safer for beginners'
  },
];

// Equipment mapping for filtering
export const EQUIPMENT_MAP: Record<string, EquipmentType[]> = {
  commercial_gym: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'bands', 'kettlebell'],
  dumbbells_only: ['dumbbell', 'bodyweight'],
  bodyweight: ['bodyweight'],
  home_gym: ['dumbbell', 'barbell', 'bodyweight', 'bands', 'kettlebell'],
};

// Get exercises filtered by equipment
export function getExercisesByEquipment(
  userEquipment: keyof typeof EQUIPMENT_MAP
): Exercise[] {
  const allowedEquipment = EQUIPMENT_MAP[userEquipment];
  
  return EXERCISES.filter(exercise => 
    exercise.equipment.some(eq => allowedEquipment.includes(eq))
  );
}

// Get exercises by muscle group and equipment
export function getExercisesForMuscle(
  muscleGroup: string,
  userEquipment: keyof typeof EQUIPMENT_MAP,
  experienceLevel?: string
): Exercise[] {
  const availableExercises = getExercisesByEquipment(userEquipment);
  
  let filtered = availableExercises.filter(ex => ex.muscleGroup === muscleGroup);
  
  // Filter by experience level if specified
  if (experienceLevel === 'beginner') {
    filtered = filtered.filter(ex => ex.difficulty === 'beginner');
  }
  
  return filtered;
}

// Get exercises by movement pattern
export function getExercisesByPattern(
  pattern: string,
  userEquipment: keyof typeof EQUIPMENT_MAP
): Exercise[] {
  const availableExercises = getExercisesByEquipment(userEquipment);
  return availableExercises.filter(ex => ex.movementPattern === pattern);
}
