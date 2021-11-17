import React, { ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
};

const createUseStateContext = (defaultValue: any) => {
  const Context = React.createContext();

  const Provider = ({ children }: Props) => {
    const [state, setState] = useState(defaultValue);

    return (
      <Context.Provider value={{ state, setState }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};

export default createUseStateContext;
