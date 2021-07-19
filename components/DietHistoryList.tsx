import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

import { GenericObject } from '../types';

const today = new Date();
const yesterday = new Date();
const twoDaysAgo = new Date();
const threeDaysAgo = new Date();
yesterday.setDate(today.getDate() - 1);
twoDaysAgo.setDate(today.getDate() - 2);
threeDaysAgo.setDate(today.getDate() - 3);

const mockHistoryList = [
  {
    date: today.toLocaleDateString('en-us'),
    day: today.toLocaleDateString('en-us', { weekday: 'long' }),
  },
  {
    date: yesterday.toLocaleDateString('en-us'),
    day: yesterday.toLocaleDateString('en-us', { weekday: 'long' }),
  },
  {
    date: twoDaysAgo.toLocaleDateString('en-us'),
    day: twoDaysAgo.toLocaleDateString('en-us', { weekday: 'long' }),
  },
  {
    date: threeDaysAgo.toLocaleDateString('en-us'),
    day: threeDaysAgo.toLocaleDateString('en-us', { weekday: 'long' }),
  },
];

const keyExtractor = (item: any, index: number) => index.toString();

const dietHistoryList = ({ item }: GenericObject) => (
  <ListItem bottomDivider>
    <Avatar source={{ uri: item.avatar_url }} />
    <ListItem.Content>
      <ListItem.Title>{item.day}</ListItem.Title>
      <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
);

const DietHistoryList = () => {
  return (
    <FlatList
      style={styles.list}
      keyExtractor={keyExtractor}
      data={mockHistoryList}
      renderItem={dietHistoryList}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  list: {
    flex: 1,
    width: '100%',
  },
});

export default DietHistoryList;
