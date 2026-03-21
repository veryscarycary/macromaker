import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MealList from './components/MealList';
import MacroGraph from '../../../../components/MacroGraph';
import { getMealData } from '../../../../context/MealContext';
import { getDay, getMacrosFromMeals } from '../../../../utils';
import { DietScreenNavigationProp, DietTabParamList, Meal } from '../../../../types';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Text } from '../../../../design/components';
import { colors } from '../../../../design/tokens/colors';
import { spacing } from '../../../../design/tokens/spacing';

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
    <View style={styles.screen}>
      <View style={styles.heroCard}>
        <Text variant="label" style={styles.eyebrow}>
          Daily Breakdown
        </Text>
        <Text variant="subheading" style={styles.title}>
          {getDay(date)}
        </Text>
        <View style={styles.statPill}>
          <Text variant="body" style={styles.data}>
            Calories: {Math.round(totalCalories)}
          </Text>
        </View>
      </View>
      <View style={styles.graphCard}>
        <MacroGraph carbs={totalCarbs} protein={totalProtein} fat={totalFat} />
      </View>
      <MealList date={date} setMeals={setMeals} meals={meals} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  heroCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: spacing.md,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  eyebrow: {
    color: colors.accent.rose,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text.primary,
  },
  statPill: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.neutral[100],
  },
  data: {
    color: colors.text.secondary,
  },
  graphCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: 'center',
  },
});

export default DailyDietScreen;
