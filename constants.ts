interface CalorieToUnitMapping {
  [unit: string]: number;
}

export const DAILY_RECOMMENDED_CALORIES = 2000;

export const KG_PER_POUND = 0.453592;
export const CM_PER_INCH = 2.54;
export const M_PER_INCH = CM_PER_INCH / 100;

export const GRAMS_PER_OUNCE = 28.3495;
export const CALORIES_PER_MACRO_UNIT_MAPPING: Record<string, CalorieToUnitMapping> = {
  carbs: {
    g: 4,
    oz: 4 * GRAMS_PER_OUNCE,
  },
  protein: {
    g: 4,
    oz: 4 * GRAMS_PER_OUNCE,
  },
  fat: {
    g: 9,
    oz: 9 * GRAMS_PER_OUNCE,
  },
};

export const BMR_MALE_BASE = 88.362;
export const BMR_MALE_WEIGHT_MODIFIER = 13.397;
export const BMR_MALE_HEIGHT_MODIFIER = 4.799;
export const BMR_MALE_AGE_MODIFIER = 5.677;
export const BMR_FEMALE_BASE = 447.593;
export const BMR_FEMALE_WEIGHT_MODIFIER = 9.247;
export const BMR_FEMALE_HEIGHT_MODIFIER = 3.098;
export const BMR_FEMALE_AGE_MODIFIER = 4.330;

export const TDEE_LEVEL_1 = 1.2;
export const TDEE_LEVEL_2 = 1.375;
export const TDEE_LEVEL_3 = 1.55;
export const TDEE_LEVEL_4 = 1.725;
export const TDEE_LEVEL_5 = 1.9;