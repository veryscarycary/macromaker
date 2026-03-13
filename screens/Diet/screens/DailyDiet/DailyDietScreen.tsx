import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import MealList from './components/MealList';
import MacroGraph from '../../../../components/MacroGraph';
import { Text, View } from '../../../../components/Themed';
import { getMealData } from '../../../../context/MealContext';
// import { Context as MealContext } from '../context/MealContext';
import { getDay, getMacrosFromMeals } from '../../../../utils';
import { DietScreenNavigationProp, DietTabParamList, Meal } from '../../../../types';
import { RouteProp, useFocusEffect } from '@react-navigation/native';

type Props = {
  route: RouteProp<DietTabParamList, 'DailyDietScreen'>;
  navigation: DietScreenNavigationProp;
};

const DailyDietScreen = ({ route, navigation }: Props) => {
  const { date } = route.params;
  const [meals, setMeals] = useState<Meal[]>([]);

  const {
    totalCalories,
    totalCarbs,
    totalProtein,
    totalFat,
  } = getMacrosFromMeals(meals);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadMeals = async () => {
        const dietDay = await getMealData(date);

        if (isActive) {
          setMeals(dietDay ? dietDay.meals : []);
        }
      };

      loadMeals();

      return () => {
        isActive = false;
      };
    }, [date])
  );

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{getDay(date)}</Text>
      </View>
      <View style={styles.otherNutrientsContainer}>
        <Text style={styles.data}>Calories: {Math.round(totalCalories)}</Text>
      </View>
      <View style={styles.graphContainer}>
        <MacroGraph carbs={totalCarbs} protein={totalProtein} fat={totalFat} />
      </View>
      <MealList date={date} setMeals={setMeals} meals={meals} navigation={navigation} />
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

export default DailyDietScreen;
