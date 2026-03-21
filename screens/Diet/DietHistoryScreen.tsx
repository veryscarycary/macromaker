import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MacroGraph from '../../components/MacroGraph';
import { getAllMealData } from '../../context/MealContext';
import { DietDay, DietScreenNavigationProp } from '../../types';
import { getAveragesFromDietDays } from '../../utils';
import DietHistoryList from './components/DietHistoryList';
import { Text } from '../../design/components';
import { colors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';

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
        <Text variant="subheading" style={styles.title}>
          7-Day Average
        </Text>
      </View>
      <View style={styles.otherNutrientsContainer}>
        <Text variant="body" style={styles.data}>
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
    padding: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  otherNutrientsContainer: {
    marginTop: 10,
    marginHorizontal: spacing.lg,
    borderRadius: 10,
    padding: spacing.sm,
    backgroundColor: 'transparent',
  },
  data: {
    color: colors.text.secondary,
  },
  graphContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});

export default DietHistoryScreen;
