import React, { useState } from 'react';
import { Text } from '../../design/components';
import { TextInput, TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../design/tokens/colors';
import { fontFamilies } from '../../design/tokens/typography';
import {
  deleteMeal,
  storeMeal,
  updateMeal,
} from '../../context/MealContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { RouteProp } from '@react-navigation/native';
import { get } from 'lodash';

import MacroInput from './components/MacroInput';
import {
  convertCarbsToCalories,
  convertFatToCalories,
  convertProteinToCalories,
  formatStoredDate,
  getTodaysDate,
} from '../../utils';
import { DietScreenNavigationProp, DietTabParamList } from '../../types';
import DismissKeyboardView from '../../components/DismissKeyboardView';

type Props = {
  navigation: DietScreenNavigationProp;
  route: RouteProp<DietTabParamList, 'AddFoodScreen'>;
};

const areFieldsValid = (carbs: string, protein: string, fat: string) => {
  return ![carbs, protein, fat].some(
    (field: string) => field === '' || field === '.'
  );
};

const getDefaultMacroState = (state: string | number | undefined): string | number =>
  !state && typeof state !== 'number' ? '' : state!;

const DATE_INPUT_REGEX = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
const TIME_INPUT_REGEX = /^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/;

const normalizeMealDate = (value?: string | Date): Date => {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatTimeInput = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const twelveHour = hours % 12 || 12;

  return `${twelveHour}:${minutes} ${meridiem}`;
};

const parseMealDateTime = (dateInput: string, timeInput: string): Date | null => {
  const trimmedDate = dateInput.trim();
  const trimmedTime = timeInput.trim().toUpperCase();

  if (!DATE_INPUT_REGEX.test(trimmedDate)) {
    return null;
  }

  const [month, day, year] = trimmedDate.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  const timeMatch = trimmedTime.match(TIME_INPUT_REGEX);

  if (!timeMatch) {
    return null;
  }

  const parsedHours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const meridiem = timeMatch[3];

  if (parsedHours < 1 || parsedHours > 12 || minutes > 59) {
    return null;
  }

  let hours = parsedHours % 12;

  if (meridiem === 'PM') {
    hours += 12;
  }

  date.setHours(hours, minutes, 0, 0);
  return date;
};

const AddFoodScreen = ({ route, navigation }: Props) => {
  const meal = get(route, 'params.meal');
  const shortDate = get(route, 'params.date');

  const defaultCarbs = get(meal, 'carbs');
  const defaultProtein = get(meal, 'protein');
  const defaultFat = get(meal, 'fat');
  const defaultCarbsUnit = get(meal, 'carbsUnit');
  const defaultProteinUnit = get(meal, 'proteinUnit');
  const defaultFatUnit = get(meal, 'fatUnit');
  const defaultMealName = get(meal, 'mealName');
  const defaultDate = get(meal, 'date');

  const [search, setSearch] = useState('');
  const [carbs, setCarbs] = useState(getDefaultMacroState(defaultCarbs));
  const [protein, setProtein] = useState(getDefaultMacroState(defaultProtein));
  const [fat, setFat] = useState(getDefaultMacroState(defaultFat));
  const [carbsUnit, setCarbsUnit] = useState(defaultCarbsUnit || 'g');
  const [proteinUnit, setProteinUnit] = useState(defaultProteinUnit || 'g');
  const [fatUnit, setFatUnit] = useState(defaultFatUnit || 'g');
  const [mealName, setMealName] = useState(defaultMealName || '');
  const initialMealDate = normalizeMealDate(defaultDate);
  const initialStoredDate = shortDate || formatStoredDate(initialMealDate);
  const [mealDateInput, setMealDateInput] = useState(initialStoredDate);
  const [mealTimeInput, setMealTimeInput] = useState(formatTimeInput(initialMealDate));

  const [searchFocused, setSearchFocused] = useState(false);
  const [mealNameFocused, setMealNameFocused] = useState(false);
  const [mealDateFocused, setMealDateFocused] = useState(false);
  const [mealTimeFocused, setMealTimeFocused] = useState(false);

  const carbsNum = carbs ? Number(carbs) : 0;
  const proteinNum = protein ? Number(protein) : 0;
  const fatNum = fat ? Number(fat) : 0;

  const carbsCalories = convertCarbsToCalories(carbsNum, carbsUnit);
  const proteinCalories = convertProteinToCalories(proteinNum, proteinUnit);
  const fatCalories = convertFatToCalories(fatNum, fatUnit);

  const calories = carbsCalories + proteinCalories + fatCalories;

  const selectedMealDate = parseMealDateTime(mealDateInput, mealTimeInput);
  const selectedDateKey = selectedMealDate ? formatStoredDate(selectedMealDate) : null;
  const originalDateKey = defaultDate
    ? formatStoredDate(normalizeMealDate(defaultDate))
    : shortDate || getTodaysDate();

  const isDisabled = (
    !areFieldsValid(String(carbs), String(protein), String(fat)) ||
    !selectedMealDate
  );

  return (
    <>
      <View style={[styles.searchbar, searchFocused && styles.searchbarFocused]}>
        <Ionicons name="search-outline" size={18} color={colors.text.tertiary} />
        <TextInput
          style={styles.searchbarInput}
          placeholder="Broccoli, pizza, etc"
          placeholderTextColor={colors.text.tertiary}
          onChangeText={(value: string) => setSearch(value)}
          value={search}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </View>

      <DismissKeyboardView style={styles.form}>
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text variant="label" style={styles.sectionHeader}>Meal Details</Text>
          <View style={styles.mealNameWrap}>
            <Text variant="label" style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={[styles.mealNameInput, mealNameFocused && styles.mealNameInputFocused]}
              onChangeText={setMealName}
              value={mealName}
              placeholder="e.g. Chicken breast"
              placeholderTextColor={colors.text.tertiary}
              onFocus={() => setMealNameFocused(true)}
              onBlur={() => setMealNameFocused(false)}
            />
          </View>

          <View style={styles.logTimeCard}>
            <Text variant="label" style={styles.sectionHeader}>Log Timing</Text>
            <Text variant="caption" style={styles.logTimeHelper}>
              Choose when this meal was eaten so it lands in the right day and time slot.
            </Text>

            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeField}>
                <Text variant="label" style={styles.fieldLabel}>Day</Text>
                <TextInput
                  style={[styles.dateTimeInput, mealDateFocused && styles.dateTimeInputFocused]}
                  value={mealDateInput}
                  onChangeText={setMealDateInput}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numbers-and-punctuation"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setMealDateFocused(true)}
                  onBlur={() => setMealDateFocused(false)}
                />
              </View>
              <View style={styles.dateTimeField}>
                <Text variant="label" style={styles.fieldLabel}>Time</Text>
                <TextInput
                  style={[styles.dateTimeInput, mealTimeFocused && styles.dateTimeInputFocused]}
                  value={mealTimeInput}
                  onChangeText={setMealTimeInput}
                  placeholder="8:30 PM"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numbers-and-punctuation"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  onFocus={() => setMealTimeFocused(true)}
                  onBlur={() => setMealTimeFocused(false)}
                />
              </View>
            </View>

            {selectedMealDate ? (
              <Text variant="caption" style={styles.logTimePreview}>
                Logging for {selectedMealDate.toLocaleDateString('en-us', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })} at {selectedMealDate.toLocaleTimeString('en-us', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            ) : (
              <Text variant="caption" style={styles.logTimeError}>
                Enter a valid date like 03/21/2026 and a time like 8:30 PM.
              </Text>
            )}
          </View>

          <Text variant="label" style={styles.sectionHeader}>Macros</Text>
          <MacroInput
            type="Carbs"
            unit={carbsUnit}
            value={carbs}
            macroColor={colors.macro.carbs}
            kcal={carbsCalories}
            setValue={setCarbs}
            setUnit={setCarbsUnit}
          />
          <MacroInput
            type="Protein"
            unit={proteinUnit}
            value={protein}
            macroColor={colors.macro.protein}
            kcal={proteinCalories}
            setValue={setProtein}
            setUnit={setProteinUnit}
          />
          <MacroInput
            type="Fat"
            unit={fatUnit}
            value={fat}
            macroColor={colors.macro.fat}
            kcal={fatCalories}
            setValue={setFat}
            setUnit={setFatUnit}
          />

          <View style={styles.caloriesRow}>
            <Text variant="body" style={styles.caloriesLabel}>Total Calories</Text>
            <Text variant="subheading" style={styles.caloriesValue}>{Math.round(calories)}</Text>
          </View>

          {calories > 0 && (
            <View style={styles.macroBar}>
              {carbsCalories > 0 && (
                <View style={[styles.macroBarSeg, { flex: carbsCalories, backgroundColor: colors.macro.carbs }]} />
              )}
              {proteinCalories > 0 && (
                <View style={[styles.macroBarSeg, { flex: proteinCalories, backgroundColor: colors.macro.protein }]} />
              )}
              {fatCalories > 0 && (
                <View style={[styles.macroBarSeg, { flex: fatCalories, backgroundColor: colors.macro.fat }]} />
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.addMealButton, isDisabled && styles.disabledAddMealButton]}
            disabled={isDisabled}
            onPress={async () => {
              if (!selectedMealDate || !selectedDateKey) {
                return;
              }

              const mealPayload = {
                mealName,
                carbsUnit,
                proteinUnit,
                fatUnit,
                carbs: carbsNum,
                protein: proteinNum,
                fat: fatNum,
                carbsCalories,
                proteinCalories,
                fatCalories,
                calories,
                date: selectedMealDate,
              };

              if (get(meal, 'id')) {
                try {
                  const updatedMeal = {
                    ...mealPayload,
                    id: get(meal, 'id') as string,
                  };

                  if (selectedDateKey === originalDateKey) {
                    await updateMeal(originalDateKey, updatedMeal);
                  } else {
                    await deleteMeal(get(meal, 'id') as string, originalDateKey);
                    await storeMeal(selectedDateKey, updatedMeal);
                  }
                } catch (e) {
                  console.error(`Error: ${e}. Could not update meal of id ${get(meal, 'id')}!`);
                }
              } else {
                try {
                  await storeMeal(selectedDateKey, {
                    ...mealPayload,
                    id: uuidv4(),
                  });
                } catch (e) {
                  console.error(`Error: ${e}. Could not store meal!`);
                }
              }
              navigation.pop();
            }}
          >
            <Text
              variant="body"
              style={[styles.addMealText, isDisabled && styles.disabledAddMealText]}
            >
              {get(meal, 'id') ? 'Edit' : 'Add'} Meal
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </DismissKeyboardView>
    </>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.neutral[200],
  },
  searchbarFocused: {
    borderBottomColor: colors.brand.primary,
  },
  searchbarInput: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 4,
  },
  form: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
  sectionHeader: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  mealNameWrap: {
    marginBottom: 18,
  },
  logTimeCard: {
    backgroundColor: colors.neutral[100],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: 12,
    marginBottom: 18,
  },
  logTimeHelper: {
    color: colors.text.secondary,
    marginBottom: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeField: {
    flex: 1,
  },
  dateTimeInput: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.surface.default,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 6,
  },
  dateTimeInputFocused: {
    borderColor: colors.brand.primary,
  },
  logTimePreview: {
    color: colors.text.secondary,
    marginTop: 10,
  },
  logTimeError: {
    color: colors.status.error,
    marginTop: 10,
  },
  fieldLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  mealNameInput: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.neutral[50],
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 6,
  },
  mealNameInputFocused: {
    borderColor: colors.brand.primary,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  caloriesLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  caloriesValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  macroBar: {
    flexDirection: 'row',
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
    marginBottom: 18,
  },
  macroBarSeg: {
    height: '100%',
    borderRadius: 3,
  },
  addMealButton: {
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  disabledAddMealButton: {
    backgroundColor: colors.neutral[200],
  },
  addMealText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    color: colors.text.inverse,
  },
  disabledAddMealText: {
    color: colors.text.tertiary,
  },
});

export default AddFoodScreen;
