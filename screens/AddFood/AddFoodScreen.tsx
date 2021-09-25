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
import withProvider from '../../components/withProvider';
import { Provider as MealProvider } from '../../context/MealContext';
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

type Props = {
  navigation: DietScreenNavigationProp;
  route: RouteProp<{ params: { meal: Meal } }, 'params'>;
};

const AddFoodScreen = ({ route, navigation }: Props) => {
  const meal = get(route, 'params.meal');

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

  const carbsNum = carbs ? Number(carbs) : 0;
  const proteinNum = protein ? Number(protein) : 0;
  const fatNum = fat ? Number(fat) : 0;

  const calories =
    convertCarbsToCalories(carbsNum) +
    convertProteinToCalories(proteinNum) +
    convertFatToCalories(fatNum);

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
          <Text style={styles.calories}>Calories: {calories}</Text>
        </View>
        {/* </View> */}
        <Spacer />
        <TouchableOpacity
          style={styles.addMealButton}
          disabled={!carbs || !protein || !fat}
          onPress={async () => {
            if (get(meal, 'id')) {
              try {
                updateMeal(getTodaysDate(), {
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
                  `Error: ${e}. Could not update meal of id ${id}!`
                );
              }
            } else {
              try {
                await storeMeal(getTodaysDate(), {
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
          <Text style={styles.addMealText}>{get(meal, 'id') ? 'Edit' : 'Add'} Meal</Text>
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
  addMealText: {
    fontSize: 20,
  },
  fields: {
    marginBottom: 40,
  },
});

export default AddFoodScreen;