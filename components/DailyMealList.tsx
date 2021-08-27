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


const keyExtractor = (item: any, index: number) => index.toString();

const MealListItem = ({ meal }: GenericObject) => (
  <ListItem bottomDivider>
    {/* <Avatar source={{ uri: '' }} /> */}
    <ListItem.Content>
      <ListItem.Title>{meal.calories}</ListItem.Title>
      <ListItem.Subtitle>{meal.calories}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
);

const MealList = ({ meals, navigation }) => (
  <>
    {meals.length ? (
      <FlatList
        style={styles.list}
        keyExtractor={keyExtractor}
        data={meals}
        renderItem={({ item }) => (
          <MealListItem
            meal={item}
            onClick={() => navigation.navigate('MealDetailScreen', {
              date: item.date,
            })}
          />
        )}
      />
    ) : null}
  </>
);

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

export default MealList;
