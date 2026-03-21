import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const DismissKeyboardView = ({ children, style }: Props) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={style}>{children}</View>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
