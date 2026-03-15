import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DietDay, DietScreenNavigationProp, GenericObject } from '../../../types';
import { colors } from '../../../design/tokens/colors';

const today = new Date();
const yesterday = new Date();
const twoDaysAgo = new Date();
const threeDaysAgo = new Date();
yesterday.setDate(today.getDate() - 1);
twoDaysAgo.setDate(today.getDate() - 2);
threeDaysAgo.setDate(today.getDate() - 3);

const keyExtractor = (item: any, index: number) => index.toString();

const DietHistoryListItem = ({ dietHistoryDay, onPress }: GenericObject) => (
  <>
    <List.Item
      title={dietHistoryDay.day}
      description={dietHistoryDay.date}
      right={() => (
        <Ionicons
          size={22}
          color={colors.text.tertiary}
          name="chevron-forward"
          style={styles.chevron}
        />
      )}
      onPress={onPress}
    />
    <Divider />
  </>
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
  chevron: {
    alignSelf: 'center',
    marginVertical: 'auto',
  },
});

export default DietHistoryList;
