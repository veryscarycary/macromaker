import React, { useState } from 'react';
import { Text, View } from '../../components/Themed';
import { TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../design/tokens/colors';
import { fontFamilies } from '../../design/tokens/typography';
import {
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

  const [searchFocused, setSearchFocused] = useState(false);
  const [mealNameFocused, setMealNameFocused] = useState(false);

  const carbsNum = carbs ? Number(carbs) : 0;
  const proteinNum = protein ? Number(protein) : 0;
  const fatNum = fat ? Number(fat) : 0;

  const carbsCalories = convertCarbsToCalories(carbsNum, carbsUnit);
  const proteinCalories = convertProteinToCalories(proteinNum, proteinUnit);
  const fatCalories = convertFatToCalories(fatNum, fatUnit);

  const calories = carbsCalories + proteinCalories + fatCalories;

  const date = defaultDate || new Date();

  const isDisabled = !areFieldsValid(String(carbs), String(protein), String(fat));

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

        <Text style={styles.sectionHeader}>Meal Details</Text>
        <View style={styles.mealNameWrap}>
          <Text style={styles.fieldLabel}>Name</Text>
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

        <Text style={styles.sectionHeader}>Macros</Text>
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
          <Text style={styles.caloriesLabel}>Total Calories</Text>
          <Text style={styles.caloriesValue}>{Math.round(calories)}</Text>
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
            if (get(meal, 'id')) {
              try {
                updateMeal(getTodaysDate(), {
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
                  date: defaultDate!,
                  id: get(meal, 'id') as string,
                });
              } catch (e) {
                console.error(`Error: ${e}. Could not update meal of id ${get(meal, 'id')}!`);
              }
            } else {
              try {
                await storeMeal(shortDate || getTodaysDate(), {
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
                  date,
                  id: uuidv4(),
                });
              } catch (e) {
                console.error(`Error: ${e}. Could not store meal!`);
              }
            }
            navigation.pop();
          }}
        >
          <Text style={[styles.addMealText, isDisabled && styles.disabledAddMealText]}>
            {get(meal, 'id') ? 'Edit' : 'Add'} Meal
          </Text>
        </TouchableOpacity>
      </DismissKeyboardView>
    </>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.muted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
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
    paddingHorizontal: 20,
    paddingTop: 14,
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
    marginBottom: 16,
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
    backgroundColor: colors.surface.subtle,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.surface.border,
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
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: colors.surface.border,
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
    marginBottom: 16,
  },
  macroBarSeg: {
    height: '100%',
    borderRadius: 3,
  },
  addMealButton: {
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    borderRadius: 6,
    padding: 14,
    marginTop: 16,
    marginBottom: 20,
  },
  disabledAddMealButton: {
    backgroundColor: colors.surface.border,
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
