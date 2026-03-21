import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../../design/tokens/colors';

type Props = {
  totalSteps: number;
  currentStep: number; // 1-indexed
};

const StepIndicator = ({ totalSteps, currentStep }: Props) => (
  <View style={styles.container}>
    {Array.from({ length: totalSteps }, (_, i) => (
      <View
        key={i}
        testID="step-dot"
        accessibilityLabel={i < currentStep ? 'filled' : 'empty'}
        style={[styles.dot, i < currentStep ? styles.dotFilled : styles.dotEmpty]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotFilled: {
    backgroundColor: colors.accent.rose,
  },
  dotEmpty: {
    backgroundColor: colors.surface.border,
  },
});

export default StepIndicator;
