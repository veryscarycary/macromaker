import React from 'react';
import MealSection from './MealSection';
import { DietScreenNavigationProp, Meal } from '../../../../../types';
import { ScrollView, StyleSheet } from 'react-native';
import AddMealSectionButton from './AddMealSectionButton';

type Props = {
  meals: Meal[];
  setMeals: (meals: Meal[]) => void;
  date: string;
  navigation: DietScreenNavigationProp;
};

const MealList = ({ date, meals, setMeals, navigation }: Props) => {
  return (
    <>
      <ScrollView style={styles.list}>
        {meals.map((meal: Meal, i: number) => {
          return (
            <MealSection
              mealNumber={i + 1}
              mealName={'MealName'}
              meal={meal}
              navigation={navigation}
              key={i + 1}
              date={date}
              setMeals={setMeals}
            />
          );
        })}
        <AddMealSectionButton navigation={navigation} date={date} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'transparent',
  },
});

export default MealList;
