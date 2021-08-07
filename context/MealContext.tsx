import { Dispatch } from 'react';
import { GenericAction } from '../types';
import createDataContext from './createDataContext';

const SET_CARBS = 'SET_CARBS';
const SET_CARBS_UNIT = 'SET_CARBS_UNIT';
const SET_PROTEIN = 'SET_PROTEIN';
const SET_PROTEIN_UNIT = 'SET_PROTEIN_UNIT';
const SET_FAT = 'SET_FAT';
const SET_FAT_UNIT = 'SET_FAT_UNIT';
const RESET_STATE = 'RESET_STATE';

const defaultState = {
  carbs: '',
  protein: '',
  fat: '',
  carbsUnit: '',
  proteinUnit: '',
  fatUnit: '',
};

type State = {
  carbs: number;
  carbsUnit: string;
  protein: number;
  proteinUnit: string;
  fat: number;
  fatUnit: string;
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
  value: number | string
) => {
  const numericRegex = /[0-9]+/g;

  console.log(value);
  console.log(numericRegex.test(value.toString()));
  debugger;
  
  if (numericRegex.test(Number(value).toString()) || value === '') {
    dispatch({ type, payload: value });
  }
};

const setCarbs = (dispatch: Dispatch<GenericAction>) => (carbs: number) => {
  setMacro(dispatch, SET_CARBS, carbs);
};

const setProtein = (dispatch: Dispatch<GenericAction>) => (protein: number) => {
  setMacro(dispatch, SET_PROTEIN, protein);
};

const setFat = (dispatch: Dispatch<GenericAction>) => (fat: number) => {
  setMacro(dispatch, SET_FAT, fat);
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
  {
    resetMealState,
    setCarbs,
    setProtein,
    setFat,
    setCarbsUnit,
    setProteinUnit,
    setFatUnit,
  },
  defaultState,
);
