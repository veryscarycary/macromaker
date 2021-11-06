import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { ModalStackParamList, Navigation } from '../types';
import ModalButton from './components/ModalButton';
import { createStackNavigator } from '@react-navigation/stack';
import BasicInfoScreen from './BasicInfoScreen';
import MoreInfoScreen from './MoreInfoScreen';

type Props = {
  navigation: Navigation;
};

const ModalStack = createStackNavigator<ModalStackParamList>();

const ModalScreen = ({ navigation }: Props) => {
  return (
      <ModalStack.Navigator>
        <ModalStack.Screen name="BasicInfo" component={BasicInfoScreen} />
        <ModalStack.Screen name="MoreInfo" component={MoreInfoScreen} />
    </ModalStack.Navigator>
  );
};

const styles = StyleSheet.create({
});

export default ModalScreen;