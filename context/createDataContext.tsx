import React, { Dispatch, Reducer, ReactNode, useReducer } from 'react';
import { GenericAction } from '../types';

type Props = {
  children: ReactNode;
};

type ActionCreators = Record<string, (dispatch: Dispatch<GenericAction>) => any>;

export default function createDataContext<S>(
  reducer: Reducer<S, GenericAction>,
  actionCreators: ActionCreators,
  defaultValue: S
) {
  const Context = React.createContext<any>(undefined);

  const Provider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const bound: Record<string, any> = {};
    for (const key in actionCreators) {
      bound[key] = actionCreators[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, ...bound }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
}
