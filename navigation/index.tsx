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
import { ColorSchemeName, Dimensions, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

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

const screenHeight = Dimensions.get('window').height;

function ModalScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <View
        style={{
          height: '50%',
          width: '100%',
          backgroundColor: '#bf0000',
          justifyContent: 'center',
        }}
      >
        <Text>Testing a modal with transparent background</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
        gestureDirection: 'vertical',
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
      }}
      mode="modal"
    >
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      <Stack.Screen name="Modal" component={ModalScreen} options={{
        gestureDirection: 'vertical',
        gestureEnabled: true
      }} />
    </Stack.Navigator>
  );
}
