import {
  CALORIES_PER_MACRO_UNIT_MAPPING,
  KG_PER_POUND,
  CM_PER_INCH,
  M_PER_INCH,
} from './constants';
import { DietDay, Meal } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CONSTANTS from './constants';

export const getTodaysDate = (): string =>
  new Date().toLocaleDateString('en-us');
export const getDay = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-us', { weekday: 'long' });
export const convertCarbsToCalories = (
  carbs: number,
  carbsUnit: string = 'g'
): number => (carbs || 0) * CALORIES_PER_MACRO_UNIT_MAPPING.carbs[carbsUnit];
export const convertProteinToCalories = (
  protein: number,
  proteinUnit: string = 'g'
): number => convertCarbsToCalories(protein, proteinUnit);
export const convertFatToCalories = (
  fat: number,
  fatUnit: string = 'g'
): number => (fat || 0) * CALORIES_PER_MACRO_UNIT_MAPPING.fat[fatUnit];

export const calculateBMR = (
  gender: string,
  weight: number,
  height: number,
  age: number
) => {
  const genderUpperCase = gender.toUpperCase();
  const weightInKg = weight * KG_PER_POUND;
  const heightInCm = height * CM_PER_INCH;

  return (
    CONSTANTS[`BMR_${genderUpperCase}_BASE`] +
    CONSTANTS[`BMR_${genderUpperCase}_WEIGHT_MODIFIER`] * weightInKg +
    CONSTANTS[`BMR_${genderUpperCase}_HEIGHT_MODIFIER`] * heightInCm -
    CONSTANTS[`BMR_${genderUpperCase}_AGE_MODIFIER`] * age
  );
};

export const calculateBMI = (weight: number, heightInInches: number) => {
  const heightInMeters = M_PER_INCH * heightInInches;
  const bmi = (KG_PER_POUND * weight) / Math.pow(heightInMeters, 2);
  return bmi;
};

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

export const removeStoredData = async (key: string) => {
  debugger;
  const removedItem = await AsyncStorage.removeItem(key, (error) => {
    if (error) {
      console.error(
        `Error: Encountered an error while removing an item from AsyncStorage: ${error}`
      );
    }
  });

  return removedItem;
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
