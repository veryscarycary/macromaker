import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import DailyMealList from '../components/DailyMealList';
import MacroGraph from '../components/MacroGraph';
import { Text, View } from '../components/Themed';
import { getMealData } from '../context/MealContext';
// import { Context as MealContext } from '../context/MealContext';
import { getDay, getTodaysDate } from '../utils';


const DailyDietScreen = ({ route, navigation }) => {
  const { date } = route.params;
  const [meals, setMeals] = useState([]);

  useEffect(
    () =>
      navigation.addListener('focus', async () => {
        const dietDay = await getMealData(date);
        if (dietDay) setMeals(dietDay.meals);
      }),
    []
  );

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{getDay(date)}</Text>
      </View>
      <View style={styles.otherNutrientsContainer}>
        <Text style={styles.data}>Calories:</Text>
      </View>
      <MacroGraph />
      <DailyMealList meals={meals} navigation={navigation} />
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

export default DailyDietScreen;
