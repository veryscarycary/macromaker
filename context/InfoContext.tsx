import { Dispatch } from 'react';
import { GenericAction, Info } from '../types';
import { calculateBMR } from '../utils';
import createDataContext from './createDataContext';

const SET_STATE = 'SET_STATE';
const SET_BMR = 'SET_BMR';

const defaultValues: Info = {
  name: '',
  age: 0,
  weight: 0,
  heightFeet: 0,
  heightInches: 0,
  gender: 'male',
  activityLevel: 'moderate',
  bmi: 0,
  bmr: 0,
  tdee: 0,
};

const infoReducer = (state: Info, action: GenericAction) => {
  switch (action.type) {
    case SET_STATE:
      return { ...state, ...action.payload };
    case SET_BMR:
      debugger;
      const { gender, weight, heightFeet, heightInches, age } = state;
      const totalHeightInches = (heightFeet * 12) + heightInches;
      const bmr = calculateBMR(gender, weight, totalHeightInches, age);

      return { ...state, bmr };
    default:
      return history;
  }
};

const setInfoState = (dispatch: Dispatch<GenericAction>) => (state: Info) => {
  dispatch({ type: SET_STATE, payload: state });
};

const setBMR = (dispatch: Dispatch<GenericAction>) => () => {
  dispatch({ type: SET_BMR });
};

export const { Provider, Context } = createDataContext(
  infoReducer,
  { setInfoState, setBMR },
  defaultValues
);
