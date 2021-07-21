/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import DietScreen from '../screens/DietScreen';
import FitnessScreen from '../screens/FitnessScreen';
import {
  BottomTabParamList,
  DietTabParamList,
  FitnessTabParamList,
} from '../types';
import { Text } from '../components/Themed';
import AddFoodHeaderButton from '../components/AddFoodHeaderButton';
import AddFoodScreen from '../screens/AddFoodScreen';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Diet"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Diet"
        component={DietTabNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Fitness"
        component={FitnessNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
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

function DietTabNavigator() {
  return (
    <DietTabStack.Navigator>
      <DietTabStack.Screen
        name="DietScreen"
        component={DietScreen}
        options={(props) => ({
          headerTitle: 'Diet History',
          headerRight: () => (
            <AddFoodHeaderButton {...props} />
          ),
        })}
      />
      <DietTabStack.Screen
        name="AddFoodScreen"
        component={AddFoodScreen}
        options={{
          headerTitle: 'Add Food',
        }}
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
        options={{ headerTitle: 'Fitness' }}
      />
    </FitnessTabStack.Navigator>
  );
}
