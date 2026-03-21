import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DietDay, DietScreenNavigationProp, GenericObject } from '../../../types';
import { colors } from '../../../design/tokens/colors';
import { spacing } from '../../../design/tokens/spacing';

const today = new Date();
const yesterday = new Date();
const twoDaysAgo = new Date();
const threeDaysAgo = new Date();
yesterday.setDate(today.getDate() - 1);
twoDaysAgo.setDate(today.getDate() - 2);
threeDaysAgo.setDate(today.getDate() - 3);

const keyExtractor = (item: any, index: number) => index.toString();

const DietHistoryListItem = ({ dietHistoryDay, onPress }: GenericObject) => (
  <View style={styles.rowCard}>
    <List.Item
      title={dietHistoryDay.day}
      titleStyle={styles.rowTitle}
      description={dietHistoryDay.date}
      descriptionStyle={styles.rowDescription}
      right={() => (
        <Ionicons
          size={22}
          color={colors.accent.teal}
          name="chevron-forward"
          style={styles.chevron}
        />
      )}
      onPress={onPress}
    />
    <Divider style={styles.divider} />
  </View>
);

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
    ) : null}
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
    overflow: 'hidden',
  },
  rowTitle: {
    color: colors.text.primary,
  },
  rowDescription: {
    color: colors.text.secondary,
  },
  divider: {
    backgroundColor: colors.neutral[200],
  },
  chevron: {
    alignSelf: 'center',
    marginVertical: 'auto',
  },
});

export default DietHistoryList;
