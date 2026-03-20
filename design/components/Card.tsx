import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../tokens';

export interface CardProps {
  children: React.ReactNode;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, bordered = false, style }: CardProps) {
  return (
    <View
      testID="ds-card"
      style={[styles.base, bordered && styles.bordered, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.default,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
});
