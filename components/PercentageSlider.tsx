import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from '../design/components';
import { colors } from '../design/tokens/colors';
import { fontFamilies } from '../design/tokens/typography';

const STEP = 0.05;
const SEGMENT_COUNT = 10;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const convertToWholePercent = (decimal: number) => Math.round(decimal * 100);
const roundToStep = (value: number) => Math.round(clamp(value) / STEP) * STEP;

type Props = {
  label: string,
  style?: ViewStyle,
  value: number,
  setValue: (value: number) => void,
  minTrackColor?: string,
  maxTrackColor?: string,
  thumbColor?: string,
};

const PercentageSlider = ({
  label,
  style,
  value,
  setValue,
  minTrackColor = colors.brand.primary,
  maxTrackColor = colors.surface.muted,
  thumbColor = colors.brand.primaryLight,
}: Props) => {
  const steppedValue = roundToStep(value);
  const activeSegments = Math.round(steppedValue * SEGMENT_COUNT);

  const updateValue = (nextValue: number) => {
    setValue(roundToStep(nextValue));
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{label}</Text>
        <View style={styles.stepper}>
        <Pressable
          accessibilityRole="button"
          onPress={() => updateValue(steppedValue - STEP)}
          style={[styles.stepButton, styles.stepButtonLeft]}
        >
          <Text style={styles.stepButtonLabel}>-</Text>
        </Pressable>
          <View style={styles.valuePill}>
            <Text style={styles.valueText}>{convertToWholePercent(steppedValue)}%</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateValue(steppedValue + STEP)}
            style={[styles.stepButton, styles.stepButtonRight]}
          >
            <Text style={styles.stepButtonLabel}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.controls}>
        <View style={styles.segmentRow}>
          {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
            <Pressable
              accessibilityRole="button"
              key={`${label}-${index}`}
              onPress={() => updateValue((index + 1) / SEGMENT_COUNT)}
              style={[
                styles.segment,
                {
                  backgroundColor: index < activeSegments ? minTrackColor : maxTrackColor,
                  borderColor: index === activeSegments - 1 ? thumbColor : maxTrackColor,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamilies.medium,
  },
  controls: {
    backgroundColor: 'transparent',
  },
  stepper: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  stepButton: {
    alignItems: 'center',
    backgroundColor: colors.surface.subtle,
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  stepButtonLeft: {
    marginRight: 8,
  },
  stepButtonRight: {
    marginLeft: 8,
  },
  stepButtonLabel: {
    color: colors.brand.primaryDark,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  valuePill: {
    backgroundColor: colors.brand.primary,
    borderRadius: 999,
    minWidth: 58,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  valueText: {
    color: colors.text.inverse,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  segmentRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    height: 10,
  },
});

export default PercentageSlider;
