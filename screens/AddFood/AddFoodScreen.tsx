import React, { useState } from 'react';
import { Text, View } from '../../components/Themed';
import { TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../design/tokens/colors';
import { fontFamilies } from '../../design/tokens/typography';
import Spacer from '../../components/Spacer';
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
        <View style={styles.mealNameWrap}>
          <Text style={styles.fieldLabel}>Meal Name</Text>
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

        <MacroInput
          type="Carbs"
          unit={carbsUnit}
          value={carbs}
          setValue={setCarbs}
          setUnit={setCarbsUnit}
        />
        <MacroInput
          type="Protein"
          unit={proteinUnit}
          value={protein}
          setValue={setProtein}
          setUnit={setProteinUnit}
        />
        <MacroInput
          type="Fat"
          unit={fatUnit}
          value={fat}
          setValue={setFat}
          setUnit={setFatUnit}
        />

        <View style={styles.caloriesContainer}>
          <Text style={styles.calories}>Calories: {Math.round(calories)}</Text>
        </View>

        <Spacer />

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
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  mealNameWrap: {
    width: '84%',
    marginBottom: 4,
  },
  fieldLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: 2,
  },
  mealNameInput: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.surface.subtle,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.surface.border,
  },
  mealNameInputFocused: {
    borderBottomColor: colors.brand.primary,
  },
  caloriesContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    borderRadius: 7,
    backgroundColor: '#e8e8e8',
  },
  calories: {
    fontFamily: fontFamilies.regular,
    fontSize: 20,
    color: colors.text.primary,
  },
  addMealButton: {
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
  },
  disabledAddMealButton: {
    backgroundColor: '#c6c6c6',
  },
  addMealText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.text.inverse,
  },
  disabledAddMealText: {
    color: '#989898',
  },
});

export default AddFoodScreen;
