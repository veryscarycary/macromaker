import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import DietHistoryList from '../components/DietHistoryList';
import MacroGraph from '../components/MacroGraph';
import { Text, View } from '../components/Themed';
import { getMealData } from '../context/MealContext';
import { Context as MealContext } from '../context/MealContext';


const MealDetailScreen = ({ route, navigation }) => {
  // const { date } = route.params;
  // const [meals, setMeals] = useState([]);

  // useEffect(
  //   () =>
  //     navigation.addListener('focus', async () => {
  //       const dietDay = await getMealData(date);
  //       if (dietDay) setMeals(dietDay.meals);
  //     }),
  //   []
  // );

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MEAL TITLE</Text>
      </View>
      <View style={styles.otherNutrientsContainer}>
        <Text style={styles.data}>Calories:</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 10,
    marginHorizontal: 100,
    borderRadius: 10,
    padding: 7,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  otherNutrientsContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 7,
    backgroundColor: 'transparent',
  },
  data: {
    color: '#808080',
    fontSize: 16,
  },
});

export default MealDetailScreen;
