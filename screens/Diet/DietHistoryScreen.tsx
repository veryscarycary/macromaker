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
  const recentLoggedDays = dietHistory.filter((day) => day.meals.length).length;
  const latestEntry = dietHistory[dietHistory.length - 1];

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
      <View style={styles.summaryCard}>
        <View style={styles.heroCard}>
          <View style={styles.summaryHeaderRow}>
            <View>
              <Text variant="label" style={styles.eyebrow}>
                Weekly Snapshot
              </Text>
              <Text variant="subheading" style={styles.title}>
                7-Day Average
              </Text>
            </View>
            <View style={styles.statPill}>
              <Text variant="body" style={styles.data}>
                {Math.round(averageCalories) || 0} cal
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.graphHeader}>
          <Text variant="bodySmall" style={styles.graphTitle}>
            Average macro split
          </Text>
        </View>
        <MacroGraph
          carbs={averageCarbs}
          protein={averageProtein}
          fat={averageFat}
        />
      </View>
      <View style={styles.listHeader}>
        <Text variant="subheading" style={styles.listTitle}>
          Logged Days
        </Text>
        <Text variant="caption" style={styles.listSubtitle}>
          {recentLoggedDays > 0
            ? `${recentLoggedDays} logged${latestEntry ? ` • latest ${latestEntry.day}` : ''}`
            : 'Tap a day to review your logged meals.'}
        </Text>
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
  summaryCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderRadius: spacing.md,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  heroCard: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.accent.teal,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text.primary,
  },
  statPill: {
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.neutral[100],
  },
  data: {
    color: colors.text.secondary,
  },
  graphHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: 0,
    marginBottom: spacing.xs,
  },
  graphTitle: {
    color: colors.text.primary,
  },
  listHeader: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  listTitle: {
    color: colors.text.primary,
  },
  listSubtitle: {
    color: colors.text.tertiary,
    marginTop: 2,
  },
});

export default DietHistoryScreen;
