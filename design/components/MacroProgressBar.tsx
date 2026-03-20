import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../tokens';

export interface MacroProgressBarProps {
  carbsTarget: number;
  proteinTarget: number;
  fatTarget: number;
  carbsLogged: number;
  proteinLogged: number;
  fatLogged: number;
  style?: StyleProp<ViewStyle>;
}

function segmentFlex(target: number, total: number): number {
  return total > 0 ? target / total : 1 / 3;
}

function fillWidth(logged: number, target: number): string {
  if (target <= 0) return '0%';
  return `${Math.min(logged / target, 1) * 100}%`;
}

function fillColor(logged: number, target: number, macroColor: string): string {
  return logged > target && target > 0 ? colors.status.error : macroColor;
}

export function MacroProgressBar({
  carbsTarget,
  proteinTarget,
  fatTarget,
  carbsLogged,
  proteinLogged,
  fatLogged,
  style,
}: MacroProgressBarProps) {
  const total = carbsTarget + proteinTarget + fatTarget;

  return (
    <View
      testID="macro-bar-container"
      style={[styles.container, style]}
    >
      <View
        testID="macro-segment-carbs"
        style={[styles.segment, { flex: segmentFlex(carbsTarget, total) }]}
      >
        <View
          testID="macro-fill-carbs"
          style={[
            styles.fill,
            {
              width: fillWidth(carbsLogged, carbsTarget),
              backgroundColor: fillColor(carbsLogged, carbsTarget, colors.macro.carbs),
            },
          ]}
        />
      </View>
      <View
        testID="macro-segment-protein"
        style={[styles.segment, { flex: segmentFlex(proteinTarget, total) }]}
      >
        <View
          testID="macro-fill-protein"
          style={[
            styles.fill,
            {
              width: fillWidth(proteinLogged, proteinTarget),
              backgroundColor: fillColor(proteinLogged, proteinTarget, colors.macro.protein),
            },
          ]}
        />
      </View>
      <View
        testID="macro-segment-fat"
        style={[styles.segment, { flex: segmentFlex(fatTarget, total) }]}
      >
        <View
          testID="macro-fill-fat"
          style={[
            styles.fill,
            {
              width: fillWidth(fatLogged, fatTarget),
              backgroundColor: fillColor(fatLogged, fatTarget, colors.macro.fat),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.surface.muted,
  },
  segment: {
    height: '100%',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
  },
});
