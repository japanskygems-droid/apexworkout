import type { UserProfile, NutritionPlan } from '@/types';

// Activity multipliers based on training days
const ACTIVITY_MULTIPLIERS: Record<number, number> = {
  3: 1.375, // Lightly active
  4: 1.55,  // Moderately active
  5: 1.55,  // Moderately active
  6: 1.725, // Very active
};

// Goal adjustments (calories)
const GOAL_ADJUSTMENTS: Record<string, number> = {
  fat_loss: -500,    // 500 calorie deficit
  recomp: -100,      // Slight deficit
  hypertrophy: 300,  // Moderate surplus
  strength: 400,     // Larger surplus for strength gains
};

// Diet-specific notes
const DIET_NOTES: Record<string, string> = {
  omnivore: 'Prioritize lean proteins like chicken, fish, and eggs across meals.',
  vegan: 'Combine legumes with grains for complete proteins; consider B12 and creatine supplementation.',
  vegetarian: 'Eggs and dairy are your primary protein sources; include legumes and tofu daily.',
  pescatarian: 'Fish provides excellent omega-3s; aim for fatty fish 2-3x per week.',
};

/**
 * Calculates BMR using Mifflin-St Jeor equation
 * This is the gold standard for BMR estimation
 */
function calculateBMR(user: UserProfile): number {
  if (user.gender === 'male') {
    return (10 * user.weightKg) + (6.25 * user.heightCm) - (5 * user.age) + 5;
  } else {
    return (10 * user.weightKg) + (6.25 * user.heightCm) - (5 * user.age) - 161;
  }
}

/**
 * Calculates TDEE (Total Daily Energy Expenditure)
 */
function calculateTDEE(bmr: number, trainingDays: number): number {
  const multiplier = ACTIVITY_MULTIPLIERS[trainingDays] || 1.55;
  return Math.round(bmr * multiplier);
}

/**
 * Calculates target calories based on goal
 */
function calculateTargetCalories(tdee: number, goal: string): number {
  const adjustment = GOAL_ADJUSTMENTS[goal] || 0;
  return Math.round(tdee + adjustment);
}

/**
 * Calculates macronutrient split
 * 
 * Protein: 2.0-2.2g per kg bodyweight (higher end for cutting)
 * Fat: 25% of calories (minimum for hormonal health)
 * Carbs: Remaining calories
 */
function calculateMacros(
  user: UserProfile,
  targetCalories: number
): { proteinG: number; fatG: number; carbsG: number } {
  // Protein calculation - higher during fat loss
  const proteinMultiplier = user.goal === 'fat_loss' ? 2.2 : 2.0;
  const proteinG = Math.round(user.weightKg * proteinMultiplier);
  const proteinCalories = proteinG * 4;
  
  // Fat calculation - 25% of total calories, minimum for health
  const fatCalories = Math.round(targetCalories * 0.25);
  const fatG = Math.round(fatCalories / 9);
  
  // Carbs - remaining calories
  const remainingCalories = targetCalories - proteinCalories - fatCalories;
  const carbsG = Math.round(remainingCalories / 4);
  
  return { proteinG, fatG, carbsG };
}

/**
 * Validates that macro math adds up correctly
 */
function validateMacros(
  targetCalories: number,
  macros: { proteinG: number; fatG: number; carbsG: number }
): boolean {
  const calculatedCalories = 
    (macros.proteinG * 4) + 
    (macros.fatG * 9) + 
    (macros.carbsG * 4);
  
  // Allow for 10 calorie rounding error
  return Math.abs(calculatedCalories - targetCalories) <= 10;
}

/**
 * Main function to calculate complete nutrition plan
 */
export function calculateNutrition(user: UserProfile): NutritionPlan {
  const bmr = calculateBMR(user);
  const tdee = calculateTDEE(bmr, user.trainingDays);
  const targetCalories = calculateTargetCalories(tdee, user.goal);
  const macros = calculateMacros(user, targetCalories);
  
  // Validate
  if (!validateMacros(targetCalories, macros)) {
    console.warn('Macro calculation mismatch - recalculating');
    // Recalculate carbs to match exactly
    const proteinCals = macros.proteinG * 4;
    const fatCals = macros.fatG * 9;
    macros.carbsG = Math.round((targetCalories - proteinCals - fatCals) / 4);
  }
  
  const dietNotes = DIET_NOTES[user.dietaryRestriction] || DIET_NOTES.omnivore;
  
  return {
    tdeeCalculation: tdee,
    targetCalories,
    macros,
    dietNotes,
  };
}

/**
 * Get macro-friendly food suggestions based on dietary restriction
 */
export function getProteinSources(dietaryRestriction: string): string[] {
  switch (dietaryRestriction) {
    case 'vegan':
      return ['Tofu', 'Tempeh', 'Seitan', 'Lentils', 'Chickpeas', 'Black beans', 'Edamame', 'Pea protein'];
    case 'vegetarian':
      return ['Eggs', 'Greek yogurt', 'Cottage cheese', 'Tofu', 'Lentils', 'Whey protein', 'Paneer'];
    case 'pescatarian':
      return ['Salmon', 'Tuna', 'Cod', 'Shrimp', 'Eggs', 'Greek yogurt', 'Tilapia'];
    default:
      return ['Chicken breast', 'Lean beef', 'Turkey', 'Eggs', 'Greek yogurt', 'Fish', 'Whey protein'];
  }
}
