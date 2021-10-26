import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MacroGraph from '../../components/MacroGraph';
import { Text, View } from '../../components/Themed';
import { getAllMealData } from '../../context/MealContext';
import { DietHistoryScreenNavigationProp } from '../../types';
import { getAveragesFromDietDays } from '../../utils';
import DietHistoryList from './components/DietHistoryList';
import NoDataMacroGraph from './components/NoDataMacroGraph';

type Props = {
  navigation: DietHistoryScreenNavigationProp;
};

const DietHistoryScreen = ({ navigation }: Props) => {
  const [dietHistory, setDietHistory] = useState([]);

  const { averageCalories, averageCarbs, averageProtein, averageFat } =
    getAveragesFromDietDays(dietHistory);

  useEffect(
    () =>
      navigation.addListener('focus', async () => {
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
        <Text style={styles.data}>
          Calories: {Math.round(averageCalories) || 0}
        </Text>
      </View>
      <View style={styles.graphContainer}>
        <MacroGraph
          carbs={averageCarbs}
          protein={averageProtein}
          fat={averageFat}
        />
        {!averageCalories ? <NoDataMacroGraph /> : null}
      </View>
      <DietHistoryList dietHistory={dietHistory} navigation={navigation} />
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
  graphContainer: {
    position: 'relative',
    backgroundColor: 'transparent',
    left: 20,
  },
});

export default DietHistoryScreen;
