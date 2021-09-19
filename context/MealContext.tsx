import { Dispatch } from 'react';
import { DietDay, GenericAction, Meal } from '../types';
import {
  getAllStoredData,
  getStoredData,
  removeStoredData,
  storeData,
} from '../utils';
import createDataContext from './createDataContext';
import { sortBy } from 'lodash';
import { uuid } from 'uuid';

const SET_CARBS = 'SET_CARBS';
const SET_CARBS_UNIT = 'SET_CARBS_UNIT';
const SET_PROTEIN = 'SET_PROTEIN';
const SET_PROTEIN_UNIT = 'SET_PROTEIN_UNIT';
const SET_FAT = 'SET_FAT';
const SET_FAT_UNIT = 'SET_FAT_UNIT';
const RESET_STATE = 'RESET_STATE';

const defaultState = {
  carbs: undefined,
  protein: undefined,
  fat: undefined,
  carbsUnit: undefined,
  proteinUnit: undefined,
  fatUnit: undefined,
};

type State = {
  carbs:  | undefined;
  carbsUnit:  | undefined;
  protein:  | undefined;
  proteinUnit:  | undefined;
  fat:  | undefined;
  fatUnit:  | undefined;
};

export const storeMeal = async (date: string, meal: Meal) => {
  const mealKey = `meals@${date}`;
  const meals = await getStoredData(mealKey);
  const areMeals = meals !== null && meals.length;

  // if already have meals stored for today
  if (areMeals) {
    const updatedMeals = [...meals, meal];

    return await storeData(mealKey, updatedMeals);
  }

  return await storeData(mealKey, [meal]);
};

export const updateMeal = async (date: string, updatedMeal: Meal) => {
  const mealKey = `meals@${date}`;
  const meals = await getStoredData(mealKey);
  const areMeals = meals !== null && meals.length;

  // should have meals stored already
  if (areMeals) {
    const meal = meals.find((meal: Meal) => meal.id === updatedMeal.id);
    const mealIndex = meals.indexOf(meal);
    const updatedMeals = [...meals];
    
    updatedMeals.splice(mealIndex, 1, updatedMeal);

    return await storeData(mealKey, updatedMeals);
  } else {
    throw new Error('Cannot update a meal that does not exist yet!');
  }
};

const updateMeals = async (date: string, meals: Meal[]) => {
  const mealKey = `meals@${date}`;

  return await storeData(mealKey, meals);
};

export const deleteMeal = async (id: string, date: string): Promise<Meal|undefined> => {
  const dietDay = await getMealData(date);
debugger;
  if (dietDay) {
    const mealToDelete = dietDay.meals.find((meal: Meal) => meal.id === id);
    if (mealToDelete) {
      const mealToDeleteIndex = dietDay.meals.indexOf(mealToDelete);
      const newMeals = [...dietDay.meals];
      newMeals.splice(mealToDeleteIndex, 1);

      if (newMeals.length) {
        console.log('update meal only');
        await updateMeals(date, newMeals);
      } else {
        console.log('detlete diet day');
        await deleteDietDay(date);
      }

      return mealToDelete;
    }
  }
};

const deleteDietDay = async (date: string) => {
  const mealKey = `meals@${date}`;

  return await removeStoredData(mealKey);
};

export const getAllMealData = async (): Promise<DietDay[]> => {
  // array of tuples
  const allStoredData = await getAllStoredData();

  const mealTuples = allStoredData.filter((tuple: [string, string | null]) => {
    const isMeal = tuple[0].includes('meals@');
    return isMeal;
  });

  const formattedMeals = mealTuples.map((tuple) => {
    const key = tuple[0];
    const date = key.substring(6);

    return {
      date,
      day: new Date(date).toLocaleDateString('en-us', { weekday: 'long' }),
      meals: tuple[1],
    };
  });

  const sortedFormattedMeals = sortBy(formattedMeals, ['date']);
  return sortedFormattedMeals;
};

export const getMealData = async (
  date: string
): Promise<DietDay | undefined> => {
  // if need better performance later, rewrite for single access
  const allMealData = await getAllMealData();
  const dietDay = allMealData.find((dietDay: DietDay) => dietDay.date === date);
  return dietDay;
};

const mealReducer = (state: State, action: GenericAction) => {
  switch (action.type) {
    case SET_CARBS:
      return { ...state, carbs: action.payload };
    case SET_CARBS_UNIT:
      return { ...state, carbsUnit: action.payload };
    case SET_PROTEIN:
      return { ...state, protein: action.payload };
    case SET_PROTEIN_UNIT:
      return { ...state, proteinUnit: action.payload };
    case SET_FAT:
      return { ...state, fat: action.payload };
    case SET_FAT_UNIT:
      return { ...state, fatUnit: action.payload };
    case RESET_STATE:
      return defaultState;
    default:
      return state;
  }
};

const resetMealState = (dispatch: Dispatch<GenericAction>) => () =>
  dispatch({ type: RESET_STATE });

const setMacro = (
  dispatch: Dispatch<GenericAction>,
  type: string,
  value: string
) => {
  const numericRegex = /^\d+$/;
  const isNumber = numericRegex.test(value);

  if (isNumber || value === '') {
    dispatch({ type, payload: value });
  }
};

const setCarbs = (dispatch: Dispatch<GenericAction>) => (carbs: string) => {
  setMacro(dispatch, SET_CARBS, carbs);
};

const setProtein = (dispatch: Dispatch<GenericAction>) => (protein: string) => {
  setMacro(dispatch, SET_PROTEIN, protein);
};

const setFat = (dispatch: Dispatch<GenericAction>) => (fat: string) => {
  setMacro(dispatch, SET_FAT, fat);
};

const setCarbsUnit =
  (dispatch: Dispatch<GenericAction>) => (carbsUnit: string) => {
    dispatch({ type: SET_CARBS_UNIT, payload: carbsUnit });
  };

const setProteinUnit =
  (dispatch: Dispatch<GenericAction>) => (proteinUnit: string) => {
    dispatch({ type: SET_PROTEIN_UNIT, payload: proteinUnit });
  };

const setFatUnit = (dispatch: Dispatch<GenericAction>) => (fatUnit: string) => {
  dispatch({ type: SET_FAT_UNIT, payload: fatUnit });
};

export const { Provider, Context } = createDataContext(
  mealReducer,
  {
    resetMealState,
    setCarbs,
    setProtein,
    setFat,
    setCarbsUnit,
    setProteinUnit,
    setFatUnit,
  },
  defaultState
);
