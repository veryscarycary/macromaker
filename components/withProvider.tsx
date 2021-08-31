import React from 'react';

const withProvider = (Component: any, Provider: any) => {
  return (props: any) => (
    <Provider>
      <Component {...props} />
    </Provider>
  );
};

export default withProvider;