import { Dispatch } from 'react';
import { GenericAction } from '../types';
import { getTodaysDate } from '../utils';
import createDataContext from './createDataContext';

const SET_DAILY_PROGRESS = 'SET_DAILY_PROGRESS';

interface DietHistory {
  [date: string]: DailyDietProgress;
}

interface DailyDietProgress {
  calories: number;
  carbs: number;
  protien: number;
  fat: number;
}

const historyReducer = (history: DietHistory, action: GenericAction) => {
  switch (action.type) {
    case SET_DAILY_PROGRESS:
      return { ...history, ...action.payload };
    default:
      return history;
  }
};

const setDailyProgress = (dispatch: Dispatch<GenericAction>) => (
  progress: DailyDietProgress
) => {
  const todaysDate = getTodaysDate();
  const dialyProgress = { [todaysDate]: progress };
  dispatch({ type: 'SET_DAILY_PROGRESS', payload: dialyProgress });
};

export const { Provider, Context } = createDataContext(
  historyReducer,
  { setDailyProgress },
  {}
);
