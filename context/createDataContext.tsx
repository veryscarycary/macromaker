import React, { Dispatch, Reducer, ReactNode, useReducer } from 'react';
import { GenericAction } from '../types';

type Props = {
  children: ReactNode;
};

export default (reducer: Reducer<any, any>, actionCreators: (dispatch: Dispatch<GenericAction>) => void, defaultValue: any) => {
  const Context = React.createContext();

  const Provider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const actionCreatorsWithDispatch = {};
    for (let key in actionCreators) {
      actionCreatorsWithDispatch[key] = actionCreators[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, ...actionCreatorsWithDispatch }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};
