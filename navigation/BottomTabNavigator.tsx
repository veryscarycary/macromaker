import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
import { View } from 'react-native';

import { colors } from '../design/tokens/colors';
import { fontFamilies } from '../design/tokens/typography';
import { spacing } from '../design/tokens/spacing';
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
import DailyDietScreen from '../screens/Diet/screens/DailyDiet/DailyDietScreen';
import DietTodayScreen from '../screens/Diet/screens/Today/DietTodayScreen';
import { getStoredData } from '../utils';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

type Props = {
  navigation: Navigation;
};

export default function BottomTabNavigator({ navigation }: Props) {
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
      screenOptions={{ tabBarActiveTintColor: colors.brand.primary }}
    >
      <BottomTab.Screen
        name="Diet"
        component={DietNavigator}
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'restaurant-sharp' : 'restaurant-outline'}
              color={color}
            />
          ),
          tabBarStyle: getDietTabBarStyle(route),
        })}
      />
      <BottomTab.Screen
        name="Fitness"
        component={FitnessNavigator}
        options={{
          headerShown: false,
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

function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const getDietTabBarStyle = (
  route: RouteProp<BottomTabParamList, 'Diet'>
) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'DietTodayScreen';
  return routeName === 'DietTodayScreen' ? undefined : { display: 'none' as const };
};

const DietTabStack = createStackNavigator<DietTabParamList>();

const sharedStackScreenOptions = {
  headerStyle: {
    backgroundColor: colors.neutral[50],
    shadowColor: colors.neutral[200],
    elevation: 0,
  },
  headerTitleStyle: {
    color: colors.text.primary,
    fontFamily: fontFamilies.semiBold,
    fontSize: 18,
  },
  headerTintColor: colors.brand.primary,
  headerBackTitleStyle: {
    color: colors.brand.primary,
  },
  headerBackTitleVisible: false,
  headerBackImage: () => (
    <Ionicons
      name="chevron-back"
      size={19}
      color={colors.brand.primary}
      style={{ marginLeft: spacing.xs }}
    />
  ),
  headerTitleAlign: 'center',
  headerLeftContainerStyle: {
    paddingLeft: spacing.sm,
  },
  headerRightContainerStyle: {
    paddingRight: spacing.sm,
  },
  headerTitleContainerStyle: {
    paddingHorizontal: spacing.xl,
  },
  headerShadowVisible: true,
} as const;

function DietNavigator() {
  return (
    <DietTabStack.Navigator
      screenOptions={({ navigation }: { navigation: any; route: any }) => ({
        ...sharedStackScreenOptions,
        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <AddFoodHeaderButton navigation={navigation} />
            <MenuButton />
          </View>
        ),
      })}
    >
      <DietTabStack.Screen
        name="DietTodayScreen"
        component={DietTodayScreen as any}
        options={{ headerTitle: "Today's Macros" }}
      />
      <DietTabStack.Screen
        name="DietHistoryScreen"
        component={DietHistoryScreen}
        options={{ headerTitle: 'Diet History' }}
      />
      <DietTabStack.Screen
        name="AddFoodScreen"
        component={AddFoodScreen as any}
        options={{ headerTitle: 'Add Food' }}
      />
      <DietTabStack.Screen
        name="EditFoodScreen"
        component={AddFoodScreen as any}
        options={{ headerTitle: 'Edit Food' }}
      />
      <DietTabStack.Screen name="DailyDietScreen" component={DailyDietScreen} />
    </DietTabStack.Navigator>
  );
}

const FitnessTabStack = createStackNavigator<FitnessTabParamList>();

function FitnessNavigator() {
  return (
    <FitnessTabStack.Navigator screenOptions={sharedStackScreenOptions}>
      <FitnessTabStack.Screen
        name="FitnessScreen"
        component={FitnessScreen}
        options={{ headerTitle: 'Fitness' }}
      />
    </FitnessTabStack.Navigator>
  );
}
