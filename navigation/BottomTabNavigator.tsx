/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import DietHistoryScreen from '../screens/Diet/DietHistoryScreen';
import FitnessScreen from '../screens/FitnessScreen';
import {
  BottomTabParamList,
  DietTabParamList,
  FitnessTabParamList,
  Info,
  Navigation,
} from '../types';
import AddFoodHeaderButton from '../screens/Diet/components/AddFoodHeaderButton';
import AddFoodScreen from '../screens/AddFood/AddFoodScreen';
import MenuButton from '../screens/Diet/components/MenuButton';
import { View } from '../components/Themed';
import DailyDietScreen from '../screens/Diet/screens/DailyDiet/DailyDietScreen';
import DietTodayScreen from '../components/DietTodayScreen';
import { getStoredData, removeStoredData } from '../utils';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

type Props = {
  navigation: Navigation
};

export default function BottomTabNavigator({ navigation }: Props) {
  const colorScheme = useColorScheme();

  // I wonder there is a better way to check for info
  // launch the modal if info is not found
  useEffect(
    () =>
      navigation.addListener('focus', async () => {
        const basicInfo = (await getStoredData('basicInfo')) as Info;
        if (!basicInfo) navigation.navigate('Modal');
      }),
    []
  );

  return (
    <BottomTab.Navigator
      initialRouteName="Diet"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Diet"
        component={DietNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'restaurant-sharp' : 'restaurant-outline'}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Fitness"
        component={FitnessNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'fitness-sharp' : 'fitness-outline'}
              color={color}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const DietTabStack = createStackNavigator<DietTabParamList>();

function DietNavigator() {
  return (
    <DietTabStack.Navigator
      screenOptions={(props) => ({
        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginRight: 15,
            }}
          >
            <AddFoodHeaderButton {...props} />
            <MenuButton {...props} />
          </View>
        ),
      })}
    >
      <DietTabStack.Screen
        name="DietTodayScreen"
        component={(props) => <DietTodayScreen {...props} />}
        options={(props) => ({
          headerTitle: 'Today',
        })}
      />
      <DietTabStack.Screen
        name="DietHistoryScreen"
        component={DietHistoryScreen}
        options={(props) => ({
          headerTitle: 'Diet History',
        })}
      />
      <DietTabStack.Screen
        name="AddFoodScreen"
        component={(props) => <AddFoodScreen {...props} />}
        options={{
          headerTitle: 'Add Food',
        }}
      />
      <DietTabStack.Screen
        name="EditFoodScreen"
        component={(props) => <AddFoodScreen {...props} />}
        options={{
          headerTitle: 'Edit Food',
        }}
      />
      <DietTabStack.Screen name="DailyDietScreen" component={DailyDietScreen} />
    </DietTabStack.Navigator>
  );
}

const FitnessTabStack = createStackNavigator<FitnessTabParamList>();

function FitnessNavigator() {
  return (
    <FitnessTabStack.Navigator>
      <FitnessTabStack.Screen
        name="FitnessScreen"
        component={FitnessScreen}
        options={{ headerTitle: 'Fitness' }}
      />
    </FitnessTabStack.Navigator>
  );
}
