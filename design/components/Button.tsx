import React from 'react';
import {
  TouchableOpacity,
  Text as RNText,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors, radius } from '../tokens';

export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const labelColor: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: colors.text.inverse,
  secondary: colors.brand.primary,
  ghost: colors.brand.primary,
};

export function Button({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      testID="ds-button"
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[styles.base, styles[variant], disabled && styles.disabled, style]}
    >
      <RNText style={{ color: labelColor[variant] }}>{label}</RNText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: colors.brand.primary,
  },
  secondary: {
    borderWidth: 1,
    borderColor: colors.brand.primary,
  },
  ghost: {},
  disabled: {
    opacity: 0.4,
  },
});
