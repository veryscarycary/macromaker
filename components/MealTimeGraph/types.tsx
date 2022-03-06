import { Meal } from "../../types";

export interface MealTimeData {
  meals: MealTimeMeal[];
  tdee: number;
}

export interface MealTimeMeal extends Meal {
  color: string;
}
