/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type DietScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Root'
>;

export type BottomTabParamList = {
  Diet: undefined;
  Fitness: undefined;
};

export type DietTabParamList = {
  DietScreen: undefined;
  AddFoodScreen: undefined;
};

export type FitnessTabParamList = {
  FitnessScreen: undefined;
};

export type GenericObject = {
  [key: string]: any;
};

export interface GenericAction {
  type: string;
  payload: any;
}
