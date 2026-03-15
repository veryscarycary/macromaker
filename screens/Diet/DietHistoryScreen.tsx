import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MacroGraph from '../../components/MacroGraph';
import { Text, View } from '../../components/Themed';
import { getAllMealData } from '../../context/MealContext';
import { DietDay, DietScreenNavigationProp } from '../../types';
import { getAveragesFromDietDays } from '../../utils';
import DietHistoryList from './components/DietHistoryList';
import { colors } from '../../design/tokens/colors';
import { fontFamilies } from '../../design/tokens/typography';

type Props = {
  navigation: DietScreenNavigationProp;
};

const DietHistoryScreen = ({ navigation }: Props) => {
  const [dietHistory, setDietHistory] = useState<DietDay[]>([]);

  const { averageCalories, averageCarbs, averageProtein, averageFat } =
    getAveragesFromDietDays(dietHistory);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadHistory = async () => {
        const history = await getAllMealData();

        if (isActive) {
          setDietHistory(history);
        }
      };

      loadHistory();

      return () => {
        isActive = false;
      };
    }, [])
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
    fontFamily: fontFamilies.semiBold,
    fontSize: 18,
    textAlign: 'center',
    color: colors.text.primary,
  },
  otherNutrientsContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 7,
    backgroundColor: 'transparent',
  },
  data: {
    fontFamily: fontFamilies.regular,
    color: colors.text.secondary,
    fontSize: 16,
  },
  graphContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});

export default DietHistoryScreen;
