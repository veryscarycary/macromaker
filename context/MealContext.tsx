import { Dispatch } from 'react';
import { GenericAction } from '../types';
import createDataContext from './createDataContext';

const SET_CARBS = 'SET_CARBS';
const SET_PROTEIN = 'SET_PROTEIN';
const SET_FAT = 'SET_FAT';

type State = {
  carbs: number;
  protein: number;
  fat: number;
};

const mealReducer = (state: State, action: GenericAction) => {
  switch (action.type) {
    case 'SET_CARBS':
      return { ...state, carbs: action.payload };
    case 'SET_PROTEIN':
      return { ...state, protein: action.payload };
    case 'SET_FAT':
      return { ...state, fat: action.payload };
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

export const { Provider, Context } = createDataContext(
  mealReducer,
  { setCarbs, setProtein, setFat },
  {}
);
