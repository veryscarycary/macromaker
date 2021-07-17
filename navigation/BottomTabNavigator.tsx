/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import DietScreen from '../screens/DietScreen';
import FitnessScreen from '../screens/FitnessScreen';
import { BottomTabParamList, DietTabParamList, FitnessTabParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Diet"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Diet"
        component={DietTabNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Fitness"
        component={FitnessNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const DietTabStack = createStackNavigator<DietTabParamList>();

function DietTabNavigator() {
  return (
    <DietTabStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <DietTabStack.Screen
        name="DietScreen"
        component={DietScreen}
        options={{ headerTitle: 'Diet Title' }}
      />
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
        options={{ headerTitle: 'Fitness Title' }}
      />
    </FitnessTabStack.Navigator>
  );
}
