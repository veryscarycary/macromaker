// design/components/NumericText.tsx
// DS NumericText — extends Text pattern with tabular-nums forced in style array.
// Implemented directly against token pattern (not imported from Text.tsx) to
// keep each component self-contained and avoid any circular dependency concerns.

import React from 'react';
import { Text as RNText, StyleProp, TextStyle, TextProps as RNTextProps } from 'react-native';
import { typeScale, colors, TypeScaleKey } from '../tokens';

export interface NumericTextProps extends RNTextProps {
  variant?: TypeScaleKey;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function NumericText({
  variant = 'body',
  color = colors.text.primary,
  style,
  ...rest
}: NumericTextProps) {
  return (
    <RNText
      testID="ds-numeric-text"
      style={[typeScale[variant], { color }, { fontVariant: ['tabular-nums'] }, style]}
      {...rest}
    />
  );
}
