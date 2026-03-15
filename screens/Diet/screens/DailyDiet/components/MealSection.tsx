import React from 'react';
import { Text, View } from '../../../../../components/Themed';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { deleteMeal, getMealData } from '../../../../../context/MealContext';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DietScreenNavigationProp, Meal } from '../../../../../types';
import { colors } from '../../../../../design/tokens/colors';
import { fontFamilies } from '../../../../../design/tokens/typography';

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
          <Text style={[styles.label, styles.mealTitle]}>Meal #{mealNumber}:</Text>
          <Text style={styles.value}>{mealName}</Text>
        </View>

        <View style={[styles.row, styles.marginBottom8]}>
          <Text style={styles.label}>Calories:</Text>
          <Text style={styles.value}>{Math.round(calories)}</Text>
        </View>

        <View style={[styles.row, styles.spaceBetween]}>
          <View style={styles.row}>
            <Text style={styles.label}>Carbs:</Text>
            <Text style={styles.value}>{carbs}{carbsUnit}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Protein:</Text>
            <Text style={styles.value}>{protein}{proteinUnit}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fat:</Text>
            <Text style={styles.value}>{fat}{fatUnit}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditFoodScreen', { meal })}
        >
          <Feather name="edit" size={20} color={colors.text.secondary} />
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
    margin: 16,
    borderRadius: 12,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.surface.border,
    overflow: 'hidden',
  },
  mealData: {
    padding: 12,
  },
  label: {
    fontFamily: fontFamilies.medium,
    color: colors.text.primary,
  },
  mealTitle: {
    fontSize: 16,
  },
  value: {
    fontFamily: fontFamilies.regular,
    marginLeft: 8,
    color: colors.text.secondary,
  },
  marginBottom8: {
    marginBottom: 16,
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
    borderTopColor: colors.surface.border,
    height: 40,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.surface.muted,
    borderRightWidth: 1,
    borderRightColor: colors.surface.border,
  },
  deleteButton: {
    backgroundColor: colors.status.error,
  },
});

export default MealSection;
