export const getTodaysDate = (): string => new Date().toLocaleDateString('en-us');

export const convertCarbsToCalories = (carbs: number): number => carbs * 4;
export const convertProteinToCalories = (protein: number): number => convertCarbsToCalories(protein);
export const convertFatToCalories = (fat: number): number => fat * 9;