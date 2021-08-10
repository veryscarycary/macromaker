import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import DietHistoryList from '../components/DietHistoryList';
import MacroGraph from '../components/MacroGraph';
import { Text, View } from '../components/Themed';
import { getAllMealData } from '../context/MealContext';

const DietScreen = ({ navigation }) => {
  const [dietHistory, setDietHistory] = useState([]);

  useEffect(
    () => navigation.addListener('focus', async () => {
      const dietHistory = await getAllMealData();
      setDietHistory(dietHistory);
    }),
    []
  );

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>7-Day Average</Text>
      </View>
      <View style={styles.otherNutrientsContainer}>
        <Text style={styles.data}>Calories:</Text>
      </View>
      <MacroGraph />
      <DietHistoryList dietHistory={dietHistory} />
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

export default DietScreen;
