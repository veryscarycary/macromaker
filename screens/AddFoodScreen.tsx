import React, { useContext, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { Text, View } from '../components/Themed';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Spacer from '../components/Spacer';
import { Context as MealContext } from '../context/MealContext';

import MacroInput from '../components/MacroInput';

const AddFoodScreen = () => {
  const {
    calories,
    carbs,
    carbsUnit,
    setCarbs,
    setCarbsUnit,
    protein,
    proteinUnit,
    setProtein,
    setProteinUnit,
    fat,
    fatUnit,
    setFat,
    setFatUnit,
  } = useContext(MealContext);
  const [search, setSearch] = useState('');

  console.log('search', search);
  return (
    <>
      <SearchBar
        lightTheme={true}
        placeholder="Broccoli, pizza, etc"
        onChangeText={setSearch}
        value={search}
      />

      <View style={styles.addMealForm}>
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
        <TouchableOpacity style={styles.addMealButton}>
          <Text style={styles.addMealText}>Add Meal</Text>
        </TouchableOpacity>
      </View>
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
