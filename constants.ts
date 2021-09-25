interface CalorieToUnitMapping {
  [unit: string]: number;
}

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