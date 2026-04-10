import type { Preset, UserProfile } from '@/types';

export const PRESETS: Preset[] = [
  {
    id: 'beginner-gains',
    name: 'Beginner Gains',
    description: 'Perfect for newcomers. Build foundational strength with 3 full-body sessions per week.',
    icon: 'rocket',
    trainingDays: 3,
    goal: 'hypertrophy',
    equipment: 'commercial_gym',
    experienceLevel: 'beginner',
    splitType: 'Full Body',
  },
  {
    id: 'shred-mode',
    name: 'Shred Mode',
    description: 'Maximize fat loss while preserving muscle with this efficient 4-day upper/lower split.',
    icon: 'flame',
    trainingDays: 4,
    goal: 'fat_loss',
    equipment: 'commercial_gym',
    experienceLevel: 'intermediate',
    splitType: 'Upper/Lower',
  },
  {
    id: 'aesthetic-builder',
    name: 'Aesthetic Builder',
    description: 'The classic bodybuilding approach. 5 days of targeted training for maximum muscle growth.',
    icon: 'star',
    trainingDays: 5,
    goal: 'hypertrophy',
    equipment: 'commercial_gym',
    experienceLevel: 'intermediate',
    splitType: 'Push/Pull/Legs + Upper/Lower',
  },
  {
    id: 'advanced-ppl',
    name: 'Advanced PPL',
    description: 'High-frequency training for experienced lifters. Push, pull, legs twice per week.',
    icon: 'crown',
    trainingDays: 6,
    goal: 'hypertrophy',
    equipment: 'commercial_gym',
    experienceLevel: 'advanced',
    splitType: 'Push/Pull/Legs x2',
  },
];

// Create a user profile from a preset with minimal info
export function createUserFromPreset(
  preset: Preset,
  basicInfo: {
    age: number;
    gender: 'male' | 'female';
    heightCm: number;
    weightKg: number;
  }
): UserProfile {
  return {
    id: `user-${Date.now()}`,
    age: basicInfo.age,
    gender: basicInfo.gender,
    heightCm: basicInfo.heightCm,
    weightKg: basicInfo.weightKg,
    goal: preset.goal,
    trainingDays: preset.trainingDays,
    equipment: preset.equipment,
    dietaryRestriction: 'omnivore',
    posturalIssues: ['none'],
    experienceLevel: preset.experienceLevel,
    createdAt: new Date().toISOString(),
  };
}
