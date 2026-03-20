// design/components/Text.tsx
// DS Text wrapper — variant prop maps to typeScale entries from design tokens.
// Naming guard: import RN primitive as RNText to avoid shadowing this export.

import React from 'react';
import { Text as RNText, StyleProp, TextStyle, TextProps as RNTextProps } from 'react-native';
import { typeScale, colors, TypeScaleKey } from '../tokens';

export interface TextProps extends RNTextProps {
  variant?: TypeScaleKey;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function Text({
  variant = 'body',
  color = colors.text.primary,
  style,
  ...rest
}: TextProps) {
  return (
    <RNText
      testID="ds-text"
      style={[typeScale[variant], { color }, style]}
      {...rest}
    />
  );
}
