import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from '../../../../../components/Themed';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { deleteMeal, getMealData } from '../../../../../context/MealContext';

import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { DietScreenNavigationProp, Meal } from '../../../../../types';

type Props = {
  date: string;
  meal: Meal;
  mealName: string;
  mealNumber: number;
  navigation: DietScreenNavigationProp;
  setMeals: (meals: Meal[]) => void,
};

const MealSection = ({
  date,
  mealNumber,
  meal,
  navigation,
  setMeals,
}: Props) => {
  const { calories, carbs, protein, fat, id } = meal;
  return (
    <View style={styles.container}>
      <View style={styles.mealData}>
        {/* Meal Title */}
        <View style={[styles.row, styles.marginBottom8]}>
          <Text style={[styles.bold, styles.mealTitle]}>
            Meal #{mealNumber}:
          </Text>
          <Text style={styles.value}>Lunch</Text>
        </View>

        <View style={[styles.row, styles.marginBottom8]}>
          <Text style={styles.bold}>Calories:</Text>
          <Text style={styles.value}>{calories}</Text>
        </View>

        <View style={[styles.row, styles.spaceBetween]}>
          <View style={styles.row}>
            <Text style={styles.bold}>Carbs:</Text>
            <Text style={styles.value}>{carbs}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Protein:</Text>
            <Text style={styles.value}>{protein}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bold}>Fat:</Text>
            <Text style={styles.value}>{fat}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('AddFoodScreen')}
        >
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={async () => {
            console.log('DELETING MEAL');
            await deleteMeal(id, date);
            const dietDay = await getMealData(date);
            if (dietDay) {
              setMeals(dietDay.meals)
            } else {
              setMeals([]);
            }
            navigation.pop();
          }}
        >
          <FontAwesome name="remove" size={26} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  mealData: {
    padding: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  mealTitle: {
    fontSize: 20,
  },
  value: {
    marginLeft: 10,
  },
  marginBottom8: {
    marginBottom: 20,
  },
  marginBottom4: {
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 10,
  },
  editButton: {
    backgroundColor: '#ffc446',
  },
  deleteButton: {
    backgroundColor: '#ff3333',
  },
});

export default MealSection;
