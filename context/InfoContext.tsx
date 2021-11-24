import { Dispatch } from 'react';
import { GenericAction, Info } from '../types';
import { calculateBMI, calculateBMR } from '../utils';
import * as CONSTANTS from '../constants';
import createDataContext from './createDataContext';
import {
  storeData,
} from '../utils';

export const storeBasicInfo = async (basicInfo: Info) => {
  const key = 'basicInfo';

  return await storeData(key, basicInfo);
};

const SET_STATE = 'SET_STATE';
const SET_BASIC_INFO_CALCULATIONS = 'SET_BASIC_INFO_CALCULATIONS';

export const defaultValues: Info = {
  name: '',
  age: 0,
  weight: 0,
  heightFeet: 0,
  heightInches: 0,
  gender: 'male',
  activityLevel: 2,
  bmi: 0,
  bmr: 0,
  tdee: 0,
  targetProteinPercentage: 0.3,
  targetCarbsPercentage: 0.5,
  targetFatPercentage: 0.2,
};

const infoReducer = (state: Info, action: GenericAction) => {
  switch (action.type) {
    case SET_STATE:
      return { ...state, ...action.payload };
    case SET_BASIC_INFO_CALCULATIONS:
      const { gender, weight, heightFeet, heightInches, age, activityLevel } = state;
      const totalHeightInches = (heightFeet * 12) + heightInches;
      const bmr = calculateBMR(gender, weight, totalHeightInches, age);
      const tdee = bmr * CONSTANTS[`TDEE_LEVEL_${activityLevel}`];
      const bmi = calculateBMI(weight, (heightFeet * 12) + heightInches);

      return { ...state, bmr, tdee, bmi };
    default:
      return history;
  }
};

const setInfoState = (dispatch: Dispatch<GenericAction>) => (state: Info) => {
  dispatch({ type: SET_STATE, payload: state });
};

const setBasicInfoCalculations =
  (dispatch: Dispatch<GenericAction>) => () => {
    dispatch({ type: SET_BASIC_INFO_CALCULATIONS });
  };

export const { Provider, Context } = createDataContext(
  infoReducer,
  { setInfoState, setBasicInfoCalculations },
  defaultValues
);
