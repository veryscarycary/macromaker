
import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';

type Props = {
  children: any
};

const DismissKeyboardHOC = (Component: any) => {
  return ({ children, ...props }: Props) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Component {...props}>{children}</Component>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardHOC(View);