
import React, { ComponentType } from 'react';
import { TouchableWithoutFeedback, Keyboard, ViewStyle } from 'react-native';
import { View } from './Themed';

type Props = {
  children: JSX.Element[];
  style: ViewStyle
};

const DismissKeyboardHOC = (Component: ComponentType) => {
  return ({ children, ...props }: Props) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Component {...props}>{children}</Component>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardHOC(View);