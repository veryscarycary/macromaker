/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  MenuModal: undefined;
  Modal: undefined;
};

export type ModalStackParamList = {
  Welcome: undefined;
  BasicInfo: undefined;
  MoreInfo: undefined;
};

export type Navigation = StackNavigationProp<
  RootStackParamList,
  'Root'
>;

export type BottomTabParamList = {
  Diet: undefined;
  Fitness: undefined;
};

export type DietTabParamList = {
  DietHistoryScreen: undefined;
  DietTodayScreen: undefined;
  AddFoodScreen: undefined;
  EditFoodScreen: undefined;
  DailyDietScreen: undefined;
};

export type FitnessTabParamList = {
  FitnessScreen: undefined;
};

export type GenericObject = {
  [key: string]: any;
};

export interface GenericAction {
  type: string;
  payload?: any;
}

export interface DietDay {
  date: string;
  day: string;
  meals: Meal[]
}
export interface Meal {
    id: string;
    date: Date;
    mealName: string;
    carbs: number;
    carbsUnit: string;
    carbsCalories: number;
    protein: number;
    proteinUnit: string;
    proteinCalories: number;
    fat: number;
    fatUnit: string;
    fatCalories: number;
    calories: number;
}

export interface Info {
  name: string;
  age: number;
  weight: number;
  heightFeet: number;
  heightInches: number;
  gender: string;
  activityLevel: number;
  bmi: number;
  bmr: number;
  tdee: number;
  targetProteinPercentage: number;
  targetCarbsPercentage: number;
  targetFatPercentage: number;
}