import { Dispatch } from 'react';
import { GenericAction, Info } from '../types';
import createDataContext from './createDataContext';

const SET_STATE = 'SET_STATE';

const defaultValues: Info = {
  name: '',
  age: 0,
  weight: 0,
  heightFeet: 0,
  heightInches: 0,
  gender: '',
  activityLevel: '',
};

const infoReducer = (state: Info, action: GenericAction) => {
  switch (action.type) {
    case SET_STATE:
      return { ...state, ...action.payload };
    default:
      return history;
  }
};

const setInfoState = (dispatch: Dispatch<GenericAction>) => (state: Info) => {
  dispatch({ type: SET_STATE, payload: state });
};

export const { Provider, Context } = createDataContext(
  infoReducer,
  { setInfoState },
  defaultValues
);
