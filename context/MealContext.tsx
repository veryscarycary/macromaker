import { Dispatch } from 'react';
import { GenericAction } from '../types';
import { convertCarbsToCalories, convertFatToCalories, convertProteinToCalories } from '../utils';
import createDataContext from './createDataContext';

const SET_CARBS = 'SET_CARBS';
const SET_CARBS_UNIT = 'SET_CARBS_UNIT';
const SET_PROTEIN = 'SET_PROTEIN';
const SET_PROTEIN_UNIT = 'SET_PROTEIN_UNIT';
const SET_FAT = 'SET_FAT';
const SET_FAT_UNIT = 'SET_FAT_UNIT';

type State = {
  carbs: number;
  carbsUnit: string;
  protein: number;
  proteinUnit: string;
  fat: number;
  fatUnit: string;
};

const mealReducer = (state: State, action: GenericAction) => {
  let calories;
  
  switch (action.type) {
    case SET_CARBS:
      const carbs = action.payload;
      calories = convertCarbsToCalories(carbs);
      return { ...state, carbs, calories };
    case SET_CARBS_UNIT:
      return { ...state, carbsUnit: action.payload };
    case SET_PROTEIN:
      const protein = action.payload;
      calories = convertProteinToCalories(protein);
      return { ...state, protein, calories };
    case SET_PROTEIN_UNIT:
      return { ...state, proteinUnit: action.payload };
    case SET_FAT:
      const fat = action.payload;
      calories = convertFatToCalories(fat);
      return { ...state, fat, calories };
    case SET_FAT_UNIT:
      return { ...state, fatUnit: action.payload };
    default:
      return state;
  }
};

const setCarbs = (dispatch: Dispatch<GenericAction>) => (carbs: number) => {
  dispatch({ type: SET_CARBS, payload: carbs });
};

const setProtein = (dispatch: Dispatch<GenericAction>) => (protein: number) => {
  dispatch({ type: SET_PROTEIN, payload: protein });
};

const setFat = (dispatch: Dispatch<GenericAction>) => (fat: number) => {
  dispatch({ type: SET_FAT, payload: fat });
};

const setCarbsUnit = (dispatch: Dispatch<GenericAction>) => (
  carbsUnit: string
) => {
  dispatch({ type: SET_CARBS, payload: carbsUnit });
};

const setProteinUnit = (dispatch: Dispatch<GenericAction>) => (
  proteinUnit: string
) => {
  dispatch({ type: SET_PROTEIN, payload: proteinUnit });
};

const setFatUnit = (dispatch: Dispatch<GenericAction>) => (fatUnit: string) => {
  dispatch({ type: SET_FAT, payload: fatUnit });
};

export const { Provider, Context } = createDataContext(
  mealReducer,
  { setCarbs, setProtein, setFat, setCarbsUnit, setProteinUnit, setFatUnit },
  {}
);
