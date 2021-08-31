import { DietDay, Meal } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTodaysDate = (): string =>
  new Date().toLocaleDateString('en-us');
export const getDay = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-us', { weekday: 'long' });
export const convertCarbsToCalories = (carbs: number): number =>
  (carbs || 0) * 4;
export const convertProteinToCalories = (protein: number): number =>
  convertCarbsToCalories(protein);
export const convertFatToCalories = (fat: number): number => (fat || 0) * 9;

export const storeData = async (key: string, value: any) => {
  if (typeof value !== 'string' && typeof value !== 'undefined') {
    value = JSON.stringify(value);
  }

  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(`Error: ${e}`);
  }
};

export const getStoredData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }

    return value;
  } catch (e) {
    console.error(`Error: ${e}`);
  }
};

export const getAllStoredData = async (): Promise<any[]> => {
  const keys = await AsyncStorage.getAllKeys();
  const result = await AsyncStorage.multiGet(keys);

  const data = result.map((tuple) =>
    typeof tuple[1] === 'string' ? [tuple[0], JSON.parse(tuple[1])] : tuple
  );
  return data;
};

export const getMacrosFromMeals = (meals: Meal[]) => {
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFat = 0;

  meals.forEach((meal: Meal) => {
    totalCalories += meal.calories;
    totalCarbs += meal.carbs;
    totalProtein += meal.protein;
    totalFat += meal.fat;
  });

  return {
    totalCalories,
    totalCarbs,
    totalProtein,
    totalFat,
  };
};

export const getAveragesFromDietDays = (dietDays: DietDay[]) => {
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFat = 0;

  dietDays.forEach((day: DietDay) => {
    if (day.meals.length) {
      day.meals.forEach((meal: Meal) => {
        totalCalories += meal.calories;
        totalCarbs += meal.carbs;
        totalProtein += meal.protein;
        totalFat += meal.fat;
      });
    }
  });

  return {
    averageCalories: totalCalories / dietDays.length,
    averageCarbs: totalCarbs / dietDays.length,
    averageProtein: totalProtein / dietDays.length,
    averageFat: totalFat / dietDays.length,
  };
};
