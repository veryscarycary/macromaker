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
    mealName: string;
    carbs: number;
    carbsUnit: string;
    protein: number;
    proteinUnit: string;
    fat: number;
    fatUnit: string;
    calories: number;
}