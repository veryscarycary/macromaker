import React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DietDay, DietScreenNavigationProp, GenericObject } from '../../../types';
import { colors } from '../../../design/tokens/colors';
import { spacing } from '../../../design/tokens/spacing';
import { Text } from '../../../design/components';
import { getMacrosFromMeals } from '../../../utils';

const today = new Date();
const yesterday = new Date();
const twoDaysAgo = new Date();
const threeDaysAgo = new Date();
yesterday.setDate(today.getDate() - 1);
twoDaysAgo.setDate(today.getDate() - 2);
threeDaysAgo.setDate(today.getDate() - 3);

const keyExtractor = (item: any, index: number) => index.toString();

const DietHistoryListItem = ({ dietHistoryDay, onPress }: GenericObject) => {
  const mealCount = dietHistoryDay.meals.length;
  const { totalCalories } = getMacrosFromMeals(dietHistoryDay.meals);

  return (
    <TouchableOpacity style={styles.rowCard} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.rowTop}>
        <View>
          <Text variant="bodySmall" style={styles.rowTitle}>
            {dietHistoryDay.day}
          </Text>
          <Text variant="caption" style={styles.rowDescription}>
            {dietHistoryDay.date}
          </Text>
        </View>
        <View style={styles.rowMeta}>
          <Text variant="caption" style={styles.rowMetaText}>
            {mealCount} meals
          </Text>
          <View style={styles.rowMetaDot} />
          <Text variant="caption" style={styles.rowMetaText}>
            {Math.round(totalCalories)} cal
          </Text>
        </View>
        <Ionicons
          size={22}
          color={colors.accent.teal}
          name="chevron-forward"
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
};

type Props = {
  dietHistory: DietDay[],
  navigation: DietScreenNavigationProp;
}

const DietHistoryList = ({ dietHistory, navigation }: Props) => (
  <>
    {dietHistory.length ? (
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        keyExtractor={keyExtractor}
        data={dietHistory}
        renderItem={({ item }) => (
          <DietHistoryListItem
            dietHistoryDay={item}
            onPress={() => navigation.navigate('DailyDietScreen', {
              date: item.date,
            })}
          />
        )}
      />
    ) : (
      <View style={styles.emptyState}>
        <Text variant="bodySmall" style={styles.emptyTitle}>
          No meal history yet
        </Text>
        <Text variant="caption" style={styles.emptySubtitle}>
          Logged days will appear here once you start adding meals.
        </Text>
      </View>
    )}
  </>
);

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  rowCard: {
    marginBottom: spacing.sm,
    borderRadius: spacing.md,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.md,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    color: colors.text.primary,
  },
  rowDescription: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  chevron: {
    alignSelf: 'center',
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  rowMetaText: {
    color: colors.text.secondary,
  },
  rowMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.neutral[300],
  },
  emptyState: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.surface.default,
    alignItems: 'center',
  },
  emptyTitle: {
    color: colors.text.primary,
  },
  emptySubtitle: {
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default DietHistoryList;
