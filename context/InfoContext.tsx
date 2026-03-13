import { Dispatch } from 'react';
import { GenericAction, Info } from '../types';
import { calculateBMI, calculateBMR } from '../utils';
import createDataContext from './createDataContext';
import { storeData } from '../utils';

export const storeBasicInfo = async (basicInfo: Info) => {
  return await storeData('basicInfo', basicInfo);
};

const SET_STATE = 'SET_STATE';
const SET_BASIC_INFO_CALCULATIONS = 'SET_BASIC_INFO_CALCULATIONS';

const TDEE_LEVELS: Record<number, number> = {
  1: 1.2,
  2: 1.375,
  3: 1.55,
  4: 1.725,
  5: 1.9,
};

export const getInfoWithCalculatedMetrics = (info: Info): Info => {
  const { gender, weight, heightFeet, heightInches, age, activityLevel } = info;
  const totalHeightInches = (heightFeet * 12) + heightInches;
  const bmr = calculateBMR(gender, weight, totalHeightInches, age);
  const tdee = bmr * (TDEE_LEVELS[activityLevel] ?? 1.2);
  const bmi = calculateBMI(weight, totalHeightInches);

  return { ...info, bmr, tdee, bmi };
};

export const defaultValues: Info = {
  name: '',
  age: 0,
  weight: 0,
  heightFeet: 5,
  heightInches: 6,
  gender: 'male',
  activityLevel: 2,
  bmi: 0,
  bmr: 0,
  tdee: 0,
  targetProteinPercentage: 0.3,
  targetCarbsPercentage: 0.5,
  targetFatPercentage: 0.2,
};

const infoReducer = (state: Info, action: GenericAction): Info => {
  switch (action.type) {
    case SET_STATE:
      return { ...state, ...action.payload };
    case SET_BASIC_INFO_CALCULATIONS: {
      return getInfoWithCalculatedMetrics(state);
    }
    default:
      return state;
  }
};

const setInfoState = (dispatch: Dispatch<GenericAction>) => (payload: Partial<Info>) => {
  dispatch({ type: SET_STATE, payload });
};

const setBasicInfoCalculations = (dispatch: Dispatch<GenericAction>) => () => {
  dispatch({ type: SET_BASIC_INFO_CALCULATIONS });
};

export const { Provider, Context } = createDataContext<Info>(
  infoReducer,
  { setInfoState, setBasicInfoCalculations },
  defaultValues
);
