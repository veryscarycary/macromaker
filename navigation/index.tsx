/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, Dimensions } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import MenuModalScreen from './MenuModalScreen';
import ModalScreen from '../screens/InfoModal/ModalScreen';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

// console.disableYellowBox = true;

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
        gestureDirection: 'vertical',
        headerShown: false,
        // cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
      }}
      mode="modal"
    >
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      <Stack.Screen
        name="Modal"
        component={ModalScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MenuModal"
        component={MenuModalScreen}
        options={{
          gestureDirection: 'vertical',
          gestureEnabled: true,
          /**
           * Distance from top to register swipe to dismiss modal gesture. Default (135)
           * https://reactnavigation.org/docs/en/stack-navigator.html#gestureresponsedistance
           */
          gestureResponseDistance: { vertical: 1000 }, // default is 135 },
        }}
      />
    </Stack.Navigator>
  );
}
