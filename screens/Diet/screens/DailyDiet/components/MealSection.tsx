import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { deleteMeal, getMealData } from '../../../../../context/MealContext';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DietScreenNavigationProp, Meal } from '../../../../../types';
import { Text } from '../../../../../design/components';
import { colors } from '../../../../../design/tokens/colors';
import { spacing } from '../../../../../design/tokens/spacing';

type Props = {
  date: string;
  meal: Meal;
  mealName: string;
  mealNumber: number;
  navigation: DietScreenNavigationProp;
  setMeals: (meals: Meal[]) => void;
};

const MealSection = ({
  date,
  mealNumber,
  meal,
  navigation,
  setMeals,
}: Props) => {
  const { mealName, calories, carbs, protein, fat, id, carbsUnit, proteinUnit, fatUnit } = meal;
  return (
    <View style={styles.container}>
      <View style={styles.mealData}>
        <View style={[styles.row, styles.marginBottom8]}>
          <Text variant="bodyMedium" style={styles.label}>
            Meal #{mealNumber}:
          </Text>
          <Text variant="body" style={styles.value}>
            {mealName}
          </Text>
        </View>

        <View style={[styles.row, styles.marginBottom8]}>
          <Text variant="bodyMedium" style={styles.label}>
            Calories:
          </Text>
          <Text variant="body" style={styles.value}>
            {Math.round(calories)}
          </Text>
        </View>

        <View style={[styles.row, styles.spaceBetween]}>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Carbs:
            </Text>
            <Text variant="body" style={styles.value}>
              {carbs}
              {carbsUnit}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Protein:
            </Text>
            <Text variant="body" style={styles.value}>
              {protein}
              {proteinUnit}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Fat:
            </Text>
            <Text variant="body" style={styles.value}>
              {fat}
              {fatUnit}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditFoodScreen', { meal })}
        >
          <Feather name="edit" size={20} color={colors.text.inverse} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={async () => {
            await deleteMeal(id, date);
            const dietDay = await getMealData(date);
            if (dietDay) {
              setMeals(dietDay.meals);
            } else {
              setMeals([]);
            }
            navigation.pop();
          }}
        >
          <FontAwesome name="remove" size={20} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing.lg,
    borderRadius: spacing.md,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
  },
  mealData: {
    padding: spacing.md,
  },
  label: {
    color: colors.text.primary,
  },
  value: {
    marginLeft: spacing.sm,
    color: colors.text.secondary,
  },
  marginBottom8: {
    marginBottom: spacing.lg,
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
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    height: spacing.xl + spacing.md + spacing.xs,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.brand.primary,
    borderRightWidth: 1,
    borderRightColor: colors.brand.primaryDark,
  },
  deleteButton: {
    backgroundColor: colors.status.error,
  },
});

export default MealSection;
