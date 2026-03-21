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
    <View style={styles.screen}>
      <View style={styles.heroCard}>
        <Text variant="label" style={styles.eyebrow}>
          Weekly Snapshot
        </Text>
        <Text variant="subheading" style={styles.title}>
          7-Day Average
        </Text>
        <View style={styles.statPill}>
          <Text variant="body" style={styles.data}>
            Calories: {Math.round(averageCalories) || 0}
          </Text>
        </View>
      </View>
      <View style={styles.graphCard}>
        <MacroGraph
          carbs={averageCarbs}
          protein={averageProtein}
          fat={averageFat}
        />
      </View>
      <DietHistoryList dietHistory={dietHistory} navigation={navigation} />
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
    color: colors.accent.teal,
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

export default DietHistoryScreen;
