import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { defaultValues as defaultBasicInfo } from '../../../../context/InfoContext';
import { getMealData } from '../../../../context/MealContext';
import { DietDay, DietScreenNavigationProp, Info, Meal } from '../../../../types';
import {
  convertCarbsToCalories,
  convertFatToCalories,
  convertProteinToCalories,
  getMacrosFromMeals,
  getStoredData,
  getTodaysDate,
} from '../../../../utils';
import BarGraph from '../../../../components/BarGraph';
import { BarGraphData } from '../../../../components/BarGraph/types';
import TotalCaloriesGraph from '../../../../components/TotalCaloriesGraph';
import D3Rectangle from '../../../../components/MealTimeGraph/components/D3Rectangle';
import MealTimeGraph from '../../../../components/MealTimeGraph';
import { getMealTimeMealsWithColor } from '../../../../components/MealTimeGraph/utils';
import { colors } from '../../../../design/tokens/colors';
import { spacing } from '../../../../design/tokens/spacing';
import { MacroProgressBar, Text } from '../../../../design/components';

type Props = {
  navigation: DietScreenNavigationProp;
};

const SIGNIFICANT_OVERFLOW_RATIO = 0.1;
const MAX_OVERFLOW_VISUAL_RATIO = 0.25;

function alpha(color: string, opacity: number): string {
  const normalized = color.replace('#', '');

  if (normalized.length !== 6) {
    return color;
  }

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

const DietTodayScreen = ({}: Props) => {
  const [basicInfo, setBasicInfo] = useState<Info>(defaultBasicInfo);
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const {
    tdee,
    targetProteinPercentage,
    targetCarbsPercentage,
    targetFatPercentage,
  } = basicInfo;

  const targetProteinCalories = targetProteinPercentage * tdee;
  const targetCarbsCalories = targetCarbsPercentage * tdee;
  const targetFatCalories = targetFatPercentage * tdee;
  const targetCarbsGrams = targetCarbsCalories / 4;
  const targetProteinGrams = targetProteinCalories / 4;
  const targetFatGrams = targetFatCalories / 9;

  const { totalCarbs, totalProtein, totalFat } =
    getMacrosFromMeals(todaysMeals);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadToday = async () => {
        const basicInfo = (await getStoredData('basicInfo')) as Info;
        const dietDay = (await getMealData(getTodaysDate())) as DietDay;

        if (!isActive) {
          return;
        }

        if (basicInfo) {
          setBasicInfo(basicInfo);
        }

        setTodaysMeals(dietDay ? dietDay.meals : []);
      };

      loadToday();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const data: BarGraphData[] = [
    {
      label: 'Carbs',
      amount: convertCarbsToCalories(totalCarbs),
      targetAmount: targetCarbsCalories,
      color: colors.macro.carbs,
    },
    {
      label: 'Protein',
      amount: convertProteinToCalories(totalProtein),
      targetAmount: targetProteinCalories,
      color: colors.macro.protein,
    },
    {
      label: 'Fat',
      amount: convertFatToCalories(totalFat),
      targetAmount: targetFatCalories,
      color: colors.macro.fat,
    },
  ];
  const mealTimeData = {
    meals: getMealTimeMealsWithColor(todaysMeals),
    tdee,
  };
  const totalCalories = Math.round(data.reduce((acc, curr) => acc + curr.amount, 0));
  const remainingCalories = Math.max(Math.round(tdee - totalCalories), 0);
  const macroRows = [
    {
      label: 'Carbs',
      color: colors.macro.carbs,
      loggedGrams: totalCarbs,
      targetGrams: targetCarbsGrams,
      loggedCalories: convertCarbsToCalories(totalCarbs),
      targetCalories: targetCarbsCalories,
    },
    {
      label: 'Protein',
      color: colors.macro.protein,
      loggedGrams: totalProtein,
      targetGrams: targetProteinGrams,
      loggedCalories: convertProteinToCalories(totalProtein),
      targetCalories: targetProteinCalories,
    },
    {
      label: 'Fat',
      color: colors.macro.fat,
      loggedGrams: totalFat,
      targetGrams: targetFatGrams,
      loggedCalories: convertFatToCalories(totalFat),
      targetCalories: targetFatCalories,
    },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.calorieCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text variant="label" style={styles.eyebrow}>
              Today&apos;s Intake
            </Text>
            <Text variant="subheading" style={styles.cardTitle}>
              Calories over time
            </Text>
          </View>
          <View style={styles.metricPill}>
            <Text variant="caption" style={styles.metricPillLabel}>
              Consumed
            </Text>
            <Text variant="bodySmall" style={styles.metricPillText}>
              {totalCalories} cal
            </Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statBlock}>
            <Text variant="caption" style={styles.statLabel}>Remaining</Text>
            <Text variant="subheading" style={styles.statValue}>{remainingCalories}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text variant="caption" style={styles.statLabel}>Target</Text>
            <Text variant="subheading" style={styles.statValue}>{Math.round(tdee)}</Text>
          </View>
        </View>

        <MealTimeGraph data={mealTimeData} />
      </View>

      <View style={styles.macroCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text variant="label" style={styles.eyebrow}>
              Macro Targets
            </Text>
            <Text variant="subheading" style={styles.cardTitle}>
              Logged vs target
            </Text>
          </View>
        </View>

        <View style={styles.macroSummary}>
          <View style={styles.macroSummaryHeader}>
            <Text variant="caption" style={styles.macroSummaryLabel}>
              Daily balance
            </Text>
            <Text variant="bodySmall" style={styles.macroSummaryValue}>
              {totalCalories} / {Math.round(tdee)} cal
            </Text>
          </View>
          <MacroProgressBar
            carbsTarget={targetCarbsGrams}
            proteinTarget={targetProteinGrams}
            fatTarget={targetFatGrams}
            carbsLogged={totalCarbs}
            proteinLogged={totalProtein}
            fatLogged={totalFat}
            style={styles.macroProgressBar}
          />
        </View>

        <View style={styles.macroRows}>
          {macroRows.map((macro) => {
            const progressRatio = macro.targetGrams > 0
              ? macro.loggedGrams / macro.targetGrams
              : 0;
            const overflowRatio = Math.max(progressRatio - 1, 0);
            const remainingGrams = Math.max(
              Math.round(macro.targetGrams - macro.loggedGrams),
              0
            );
            const isComplete = progressRatio >= 1;
            const isOverByALot = overflowRatio >= SIGNIFICANT_OVERFLOW_RATIO;
            const visualOverflowRatio = isOverByALot
              ? Math.min(overflowRatio, MAX_OVERFLOW_VISUAL_RATIO)
              : 0;
            const visualDenominator = 1 + visualOverflowRatio;
            const targetZonePercent = `${(1 / visualDenominator) * 100}%`;
            const overflowZonePercent = `${(visualOverflowRatio / visualDenominator) * 100}%`;

            return (
              <View key={macro.label} style={styles.macroRowCard}>
                <View style={styles.macroRowHeader}>
                  <View style={styles.macroLabelGroup}>
                    <View
                      style={[
                        styles.macroDot,
                        { backgroundColor: macro.color },
                      ]}
                    />
                    <View>
                      <Text variant="bodySmall" style={styles.macroName}>
                        {macro.label}
                      </Text>
                      <Text variant="caption" style={styles.macroMeta}>
                        {Math.round(macro.loggedCalories)} cal logged
                      </Text>
                    </View>
                  </View>
                  <Text
                    variant="caption"
                    style={[
                      styles.macroPercent,
                      isOverByALot && styles.macroPercentOver,
                      isComplete && !isOverByALot && styles.macroPercentComplete,
                    ]}
                  >
                    {Math.round(progressRatio * 100)}%
                  </Text>
                </View>

                <View
                  style={[
                    styles.macroTrack,
                    { backgroundColor: alpha(macro.color, 0.14) },
                  ]}
                >
                  <View
                    style={[
                      styles.macroTargetZone,
                      { width: targetZonePercent },
                    ]}
                  >
                    <View
                      style={[
                        styles.macroFill,
                        {
                          width: isComplete ? '100%' : `${progressRatio * 100}%`,
                          backgroundColor: isComplete
                            ? colors.neutral[900]
                            : macro.color,
                        },
                      ]}
                    />
                  </View>
                  {isOverByALot ? (
                    <View
                      style={[
                        styles.macroOverflowZone,
                        {
                          width: overflowZonePercent,
                        },
                      ]}
                    >
                      <View style={styles.macroOverflowFill} />
                    </View>
                  ) : null}
                  {isOverByALot ? (
                    <View
                      style={[
                        styles.macroTargetMarker,
                        { left: targetZonePercent },
                      ]}
                    />
                  ) : null}
                </View>

                <View style={styles.macroRowFooter}>
                  <View>
                    <Text variant="caption" style={styles.macroFooterLabel}>
                      Remaining
                    </Text>
                    <Text variant="bodySmall" style={styles.macroRemaining}>
                      {remainingGrams}g
                    </Text>
                  </View>
                  <View style={styles.macroFooterStats}>
                    <Text variant="caption" style={styles.macroAmount}>
                      Logged {Math.round(macro.loggedGrams)}g
                    </Text>
                    <Text variant="caption" style={styles.macroTarget}>
                      Target {Math.round(macro.targetGrams)}g
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.legacyGraphMount} pointerEvents="none">
          <BarGraph data={data} />
          <TotalCaloriesGraph data={data} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  calorieCard: {
    backgroundColor: colors.surface.default,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  macroCard: {
    backgroundColor: colors.surface.default,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    color: colors.accent.teal,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    color: colors.text.primary,
  },
  metricPill: {
    backgroundColor: colors.neutral[100],
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: 'center',
  },
  metricPillLabel: {
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  metricPillText: {
    color: colors.text.secondary,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.neutral[100],
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    paddingVertical: spacing.sm,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  statValue: {
    color: colors.text.primary,
  },
  statDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.neutral[200],
  },
  macroSummary: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: spacing.sm,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  macroSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  macroSummaryLabel: {
    color: colors.text.tertiary,
  },
  macroSummaryValue: {
    color: colors.text.secondary,
  },
  macroProgressBar: {
    height: 12,
    borderRadius: 999,
  },
  macroRows: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  macroRowCard: {
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.md,
  },
  macroRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  macroLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  macroDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  macroName: {
    color: colors.text.primary,
  },
  macroMeta: {
    color: colors.text.tertiary,
    marginTop: 2,
  },
  macroPercent: {
    color: colors.text.secondary,
  },
  macroPercentComplete: {
    color: colors.neutral[900],
  },
  macroPercentOver: {
    color: colors.status.error,
  },
  macroTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  macroTargetZone: {
    height: '100%',
  },
  macroFill: {
    height: '100%',
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  },
  macroOverflowZone: {
    height: '100%',
    justifyContent: 'flex-start',
  },
  macroOverflowFill: {
    height: '100%',
    backgroundColor: colors.status.errorStrong,
    width: '100%',
  },
  macroTargetMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    marginLeft: -1,
    backgroundColor: alpha(colors.surface.default, 0.9),
  },
  macroRowFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  macroFooterLabel: {
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  macroRemaining: {
    color: colors.text.primary,
  },
  macroFooterStats: {
    alignItems: 'flex-end',
  },
  macroAmount: {
    color: colors.text.secondary,
  },
  macroTarget: {
    color: colors.text.tertiary,
  },
  legacyGraphMount: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
    overflow: 'hidden',
  },
});

export default DietTodayScreen;
