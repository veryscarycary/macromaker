import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { defaultValues as defaultBasicInfo } from '../../../../context/InfoContext';
import { getAllMealData } from '../../../../context/MealContext';
import { DietDay, DietScreenNavigationProp, Info, Meal } from '../../../../types';
import {
  convertCarbsToCalories,
  convertFatToCalories,
  convertProteinToCalories,
  formatStoredDate,
  getMacrosFromMeals,
  getDay,
  getStoredData,
  getTodaysDate,
  parseStoredDate,
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
const DAY_WINDOW = 15;
const DAY_RAIL_ITEM_WIDTH = 52;
const DAY_RAIL_SIDE_PADDING =
  (Dimensions.get('window').width / 2) - (DAY_RAIL_ITEM_WIDTH / 2) - spacing.lg;

type DayCircleFill = 'empty' | 'half' | 'full';

type DayRailItem = {
  date: Date;
  key: string;
  label: string;
  dayLetter: string;
  fill: DayCircleFill;
  isAlert: boolean;
};

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

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getSelectedDateTitle(dateKey: string, todayKey: string): string {
  const selectedDate = parseStoredDate(dateKey);
  const prefix = dateKey === todayKey ? 'Today' : getDay(dateKey);

  return `${prefix}, ${selectedDate.toLocaleDateString('en-us', {
    month: 'long',
    day: 'numeric',
  })}`;
}

function getMacroHitCountAndAlert(
  meals: Meal[],
  targets: { carbs: number; protein: number; fat: number }
) {
  const { totalCarbs, totalProtein, totalFat, totalCalories } = getMacrosFromMeals(meals);
  const macros = [
    { logged: totalCarbs, target: targets.carbs },
    { logged: totalProtein, target: targets.protein },
    { logged: totalFat, target: targets.fat },
  ];

  let isAlert = false;

  macros.forEach(({ logged, target }) => {
    if (target <= 0) {
      return;
    }

    const progress = logged / target;

    if (progress >= 1 + SIGNIFICANT_OVERFLOW_RATIO) {
      isAlert = true;
    }
  });

  return { totalCalories, isAlert };
}

function getDayCircleState(
  meals: Meal[],
  targets: { carbs: number; protein: number; fat: number },
  calorieTarget: number
): { fill: DayCircleFill; isAlert: boolean } {
  const { totalCalories, isAlert } = getMacroHitCountAndAlert(meals, targets);

  if (totalCalories >= calorieTarget && totalCalories > 0) {
    return { fill: 'full', isAlert };
  }

  if (totalCalories > 0) {
    return { fill: 'half', isAlert };
  }

  return { fill: 'empty', isAlert };
}

const DietTodayScreen = ({}: Props) => {
  const [basicInfo, setBasicInfo] = useState<Info>(defaultBasicInfo);
  const todayKey = getTodaysDate();
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [dietDays, setDietDays] = useState<DietDay[]>([]);
  const railRef = useRef<FlatList<DayRailItem>>(null);
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
  const macroTargets = useMemo(
    () => ({
      carbs: targetCarbsGrams,
      protein: targetProteinGrams,
      fat: targetFatGrams,
    }),
    [targetCarbsGrams, targetProteinGrams, targetFatGrams]
  );
  const mealsByDate = useMemo(
    () =>
      dietDays.reduce<Record<string, Meal[]>>((acc, dietDay) => {
        acc[dietDay.date] = dietDay.meals;
        return acc;
      }, {}),
    [dietDays]
  );
  const selectedMeals = mealsByDate[selectedDateKey] || [];
  const { totalCarbs, totalProtein, totalFat } =
    getMacrosFromMeals(selectedMeals);
  const dayRailData = useMemo(() => {
    const today = parseStoredDate(todayKey);
    const middleIndex = Math.floor(DAY_WINDOW / 2);

    return Array.from({ length: DAY_WINDOW }, (_, index) => {
      const date = addDays(today, index - middleIndex);
      const key = formatStoredDate(date);
      const status = getDayCircleState(mealsByDate[key] || [], macroTargets, tdee);

      return {
        date,
        key,
        label: date.toLocaleDateString('en-us', { weekday: 'short' }).slice(0, 1),
        dayLetter: date.toLocaleDateString('en-us', { weekday: 'short' }).slice(0, 1),
        fill: status.fill,
        isAlert: status.isAlert,
      };
    });
  }, [todayKey, mealsByDate, macroTargets]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadToday = async () => {
        const basicInfo = (await getStoredData('basicInfo')) as Info;
        const allDietDays = await getAllMealData();

        if (!isActive) {
          return;
        }

        if (basicInfo) {
          setBasicInfo(basicInfo);
        }

        setDietDays(allDietDays || []);
      };

      loadToday();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    const middleIndex = Math.floor(DAY_WINDOW / 2);

    requestAnimationFrame(() => {
      railRef.current?.scrollToOffset({
        offset: middleIndex * DAY_RAIL_ITEM_WIDTH,
        animated: false,
      });
    });
  }, []);

  const handleDayRailMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = event.nativeEvent.contentOffset.x / DAY_RAIL_ITEM_WIDTH;
    const nextIndex = Math.min(
      Math.max(Math.round(rawIndex), 0),
      dayRailData.length - 1
    );

    setSelectedDateKey(dayRailData[nextIndex].key);
  };

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
    meals: getMealTimeMealsWithColor(selectedMeals),
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
      <View style={styles.dayRailCard}>
        <Text variant="subheading" style={styles.dayRailTitle}>
          {getSelectedDateTitle(selectedDateKey, todayKey)}
        </Text>
        <FlatList
          ref={railRef}
          data={dayRailData}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          snapToInterval={DAY_RAIL_ITEM_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={styles.dayRailContent}
          onMomentumScrollEnd={handleDayRailMomentumEnd}
          getItemLayout={(_, index) => ({
            length: DAY_RAIL_ITEM_WIDTH,
            offset: DAY_RAIL_ITEM_WIDTH * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const isSelected = item.key === selectedDateKey;
            const circleColor = item.isAlert
              ? colors.status.error
              : colors.accent.aqua;

            return (
              <TouchableOpacity
                style={styles.dayRailItem}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedDateKey(item.key);
                  railRef.current?.scrollToOffset({
                    offset: index * DAY_RAIL_ITEM_WIDTH,
                    animated: true,
                  });
                }}
              >
                <Text
                  variant="caption"
                  style={[
                    styles.dayRailLabel,
                    isSelected && styles.dayRailLabelSelected,
                  ]}
                >
                  {item.dayLetter}
                </Text>
                <View
                  style={[
                    styles.dayCircleOuter,
                    isSelected && styles.dayCircleOuterSelected,
                    item.fill === 'empty' && styles.dayCircleOuterEmpty,
                  ]}
                >
                  {item.fill !== 'empty' ? (
                    <View
                      style={[
                        styles.dayCircleFill,
                        item.fill === 'half'
                          ? styles.dayCircleFillHalf
                          : styles.dayCircleFillFull,
                        { backgroundColor: circleColor },
                      ]}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.calorieCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text variant="label" style={styles.eyebrow}>
              Daily Intake
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
  dayRailCard: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderRadius: spacing.md,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
  },
  dayRailTitle: {
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  dayRailContent: {
    paddingHorizontal: DAY_RAIL_SIDE_PADDING,
  },
  dayRailItem: {
    width: DAY_RAIL_ITEM_WIDTH,
    alignItems: 'center',
  },
  dayRailLabel: {
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  dayRailLabelSelected: {
    color: colors.text.secondary,
  },
  dayCircleOuter: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.surface.default,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  dayCircleOuterSelected: {
    borderColor: colors.neutral[900],
    borderWidth: 2,
  },
  dayCircleOuterEmpty: {
    backgroundColor: colors.neutral[100],
  },
  dayCircleFill: {
    width: '100%',
  },
  dayCircleFillHalf: {
    height: '50%',
  },
  dayCircleFillFull: {
    height: '100%',
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
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  macroDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 5,
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
