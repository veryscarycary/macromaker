import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { colors } from '../../../design/tokens/colors';
import { fontFamilies } from '../../../design/tokens/typography';

type Props = {
  type: string;
  value: string | number;
  unit: string;
  setValue: (value: string) => void;
  setUnit: (unitValue: string) => void;
};

const MacroInput = ({ type, value, unit, setValue, setUnit }: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{type}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
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
            style={[styles.unitPill, unit === unitOption && styles.unitPillSelected]}
            onPress={() => setUnit(unitOption)}
          >
            <Text style={[styles.unitText, unit === unitOption && styles.unitTextSelected]}>
              {unitOption}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: colors.surface.border,
  },
  label: {
    width: 60,
    fontFamily: fontFamilies.medium,
    fontSize: 15,
    color: colors.text.primary,
  },
  input: {
    width: 80,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: colors.text.primary,
    backgroundColor: colors.surface.subtle,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: colors.surface.border,
  },
  inputFocused: {

    borderBottomColor: colors.brand.primary,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  unitPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.muted,
  },
  unitPillSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  unitText: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: colors.text.secondary,
  },
  unitTextSelected: {
    color: colors.text.inverse,
  },
});

export default MacroInput;
