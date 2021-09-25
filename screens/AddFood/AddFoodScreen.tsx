import React, { useContext, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { Text, View } from '../../components/Themed';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Spacer from '../../components/Spacer';
import {
  Context as MealContext,
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
import { DietScreenNavigationProp, Meal } from '../../types';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import { Input } from 'react-native-elements';

type Props = {
  navigation: DietScreenNavigationProp;
  route: RouteProp<{ params: { meal: Meal } }, 'params'>;
};

const areFieldsValid = (carbs: string, protein: string, fat: string) => {
  return ![carbs,protein,fat].some((field: string) => field === '' || field === '.');
}

const AddFoodScreen = ({ route, navigation }: Props) => {
  const meal = get(route, 'params.meal');
  const date = get(route, 'params.date');

  const [search, setSearch] = useState('');
  // const {
  //   state: { carbs, carbsUnit, protein, proteinUnit, fat, fatUnit },
  //   state,
  //   setCarbs,
  //   setCarbsUnit,
  //   setProtein,
  //   setProteinUnit,
  //   setFat,
  //   setFatUnit,
  // } = useContext(MealContext);

  const [carbs, setCarbs] = useState(get(meal, 'carbs') || '');
  const [protein, setProtein] = useState(get(meal, 'protein') || '');
  const [fat, setFat] = useState(get(meal, 'fat') || '');
  const [carbsUnit, setCarbsUnit] = useState(get(meal, 'carbsUnit') || 'g');
  const [proteinUnit, setProteinUnit] = useState(get(meal, 'proteinUnit') || 'g');
  const [fatUnit, setFatUnit] = useState(get(meal, 'fatUnit') || 'g');
  const [mealName, setMealName] = useState(get(meal, 'mealName') || '');

  const carbsNum = carbs ? Number(carbs) : 0;
  const proteinNum = protein ? Number(protein) : 0;
  const fatNum = fat ? Number(fat) : 0;

  const calories =
    convertCarbsToCalories(carbsNum, carbsUnit) +
    convertProteinToCalories(proteinNum, proteinUnit) +
    convertFatToCalories(fatNum, fatUnit);

  const isDisabled = !areFieldsValid(carbs, protein, fat);

  return (
    <>
      <SearchBar
        lightTheme={true}
        placeholder="Broccoli, pizza, etc"
        onChangeText={(value: string) => setSearch(value)}
        value={search}
      />

      <DismissKeyboardView style={styles.addMealForm}>
        {/* <View style={styles.fields}> */}
        <Input
          containerStyle={styles.input}
          onChangeText={setMealName}
          value={mealName}
          placeholder="Meal Name"
        />

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
        {/* </View> */}
        <Spacer />
        <TouchableOpacity
          style={[
            styles.addMealButton,
            isDisabled && styles.disabledAddMealButton,
          ]}
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
                  calories,
                  id: get(meal, 'id'),
                });
              } catch (e) {
                console.error(
                  `Error: ${e}. Could not update meal of id ${get(meal, 'id')}!`
                );
              }
            } else {
              try {
                await storeMeal(date || getTodaysDate(), {
                  mealName,
                  carbsUnit,
                  proteinUnit,
                  fatUnit,
                  carbs: carbsNum,
                  protein: proteinNum,
                  fat: fatNum,
                  calories,
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
            style={[
              styles.addMealText,
              isDisabled && styles.disabledAddMealText,
            ]}
          >
            {get(meal, 'id') ? 'Edit' : 'Add'} Meal
          </Text>
        </TouchableOpacity>
      </DismissKeyboardView>
    </>
  );
};

const styles = StyleSheet.create({
  caloriesContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    marginRight: 10,
    borderRadius: 7,
    backgroundColor: '#e8e8e8',
  },
  calories: { fontSize: 24 },
  marginTop: { marginTop: 5 },
  addMealForm: {
    flex: 1,
    margin: 40,
    paddingLeft: 10,
    paddingTop: 5,
  },
  addMealButton: {
    backgroundColor: '#7078df',
    alignItems: 'center',
    borderRadius: 5,
    padding: 12,
    marginHorizontal: 10,
    marginRight: 20,
    marginBottom: 20,
  },
  disabledAddMealButton: {
    backgroundColor: '#c6c6c6',
  },
  addMealText: {
    fontSize: 20,
  },
  disabledAddMealText: {
    color: '#989898',
  },
  fields: {
    marginBottom: 40,
  },
  input: {
    width: '84%',
    paddingHorizontal: 0,
  },
});

export default AddFoodScreen;