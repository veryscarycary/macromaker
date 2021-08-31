/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import DietScreen from '../screens/Diet/DietScreen';
import FitnessScreen from '../screens/FitnessScreen';
import {
  BottomTabParamList,
  DietTabParamList,
  FitnessTabParamList,
} from '../types';
import AddFoodHeaderButton from '../screens/Diet/components/AddFoodHeaderButton';
import AddFoodScreen from '../screens/AddFood/AddFoodScreen';
import MacroScreen from '../screens/MacroScreen';
import MenuButton from '../screens/Diet/components/MenuButton';
import { View } from '../components/Themed';
import { Provider as MealProvider } from '../context/MealContext';
import DailyDietScreen from '../screens/Diet/screens/DailyDiet/DailyDietScreen';
import withProvider from '../components/withProvider';

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
        component={DietTabDrawerNavigator}
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
const Drawer = createDrawerNavigator();

const DietTabDrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="DietTab" drawerPosition="right">
    <Drawer.Screen name="DietTab" component={DietTabNavigator} />
    <Drawer.Screen name="MacroScreen" component={MacroScreen} />
  </Drawer.Navigator>
);

function DietTabNavigator() {
  return (
    <DietTabStack.Navigator>
      <DietTabStack.Screen
        name="DietScreen"
        component={DietScreen}
        options={(props) => ({
          headerTitle: 'Diet History',
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
      />
      <DietTabStack.Screen
        name="AddFoodScreen"
        component={withProvider(AddFoodScreen, MealProvider)}
        options={{
          headerTitle: 'Add Food',
        }}
      />
      <DietTabStack.Screen
        name="DailyDietScreen"
        component={DailyDietScreen}
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
