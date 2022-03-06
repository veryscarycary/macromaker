import { Meal } from '../../types';
import { MEAL_COLOR_MAP } from './constants';
import { MealTimeMeal } from './types';

export const getMealTimeMealsWithColor = (mealTimeMeals: Meal[]): MealTimeMeal[] => {
  return mealTimeMeals.map((mealTimeMeal: Meal) => {
    const { carbsCalories, proteinCalories, fatCalories } = mealTimeMeal;

    const highestCalories = Math.max(carbsCalories, proteinCalories, fatCalories);
    const mealTimeMealKey = (Object.keys(mealTimeMeal) as (keyof Meal)[]).find(key => mealTimeMeal[key] === highestCalories);
    const mealColor = mealTimeMealKey ? MEAL_COLOR_MAP[mealTimeMealKey.replace('Calories', '')] : 'black';

    return {...mealTimeMeal, color: mealColor };
  });
};