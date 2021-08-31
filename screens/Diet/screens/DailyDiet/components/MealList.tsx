import React from 'react';
import MealSection from './MealSection';
import { DietScreenNavigationProp, Meal } from '../../../../../types';
import { ScrollView, StyleSheet } from 'react-native';

type Props = {
  meals: Meal[];
  navigation: DietScreenNavigationProp;
};

const MealList = ({ meals, navigation }: Props) => {
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
            />
          );
        })}
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
