import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { colors } from '../../../design/tokens/colors';
import { fontFamilies } from '../../../design/tokens/typography';

type Props = {
  type: string;
  value: string | number;
  unit: string;
  macroColor: string;
  kcal: number;
  setValue: (value: string) => void;
  setUnit: (unitValue: string) => void;
};

const MacroInput = ({ type, value, unit, macroColor, kcal, setValue, setUnit }: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: macroColor }]} />
      <Text style={styles.label}>{type}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, focused && { borderBottomColor: macroColor }]}
          placeholder="0"
          placeholderTextColor={colors.text.tertiary}
          onChangeText={setValue}
          value={value === undefined ? undefined : value.toString()}
          keyboardType="numeric"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <View style={styles.unitSelector}>
          {(['g', 'oz'] as const).map((unitOption) => (
            <TouchableOpacity
              key={unitOption}
              style={[
                styles.unitPill,
                unit === unitOption && { backgroundColor: macroColor, borderColor: macroColor },
              ]}
              onPress={() => setUnit(unitOption)}
            >
              <Text style={[styles.unitText, unit === unitOption && styles.unitTextSelected]}>
                {unitOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.kcalCol}>
        <Text style={styles.kcalNum}>{Math.round(kcal)}</Text>
        <Text style={styles.kcalLabel}>kcal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surface.border,
    paddingVertical: 20,
    paddingHorizontal: 22,  // 3px accent + ~11px gap
    marginBottom: 7,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  label: {
    width: 58,
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    color: colors.text.secondary,
    flexShrink: 0,
  },
  input: {
    width: 50,
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    color: colors.text.primary,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.surface.border,
    paddingBottom: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    gap: 8,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 3,
  },
  unitPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.muted,
  },
  unitText: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: colors.text.secondary,
  },
  unitTextSelected: {
    color: colors.text.inverse,
  },
  kcalCol: {
    alignItems: 'flex-end',
    minWidth: 28,
  },
  kcalNum: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
    color: colors.text.primary,
    lineHeight: 15,
  },
  kcalLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 10,
    color: colors.text.tertiary,
  },
});

export default MacroInput;
