import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { ModalStackParamList, Navigation } from '../types';
import { createStackNavigator } from '@react-navigation/stack';

type Props = {
  navigation: Navigation;
};

const ModalStack = createStackNavigator<ModalStackParamList>();

const MoreInfoScreen = ({ navigation }: Props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>More Info!</Text>
      <Button onPress={() => navigation.navigate('Root')} title="Dismiss" />
    </View>
  );
};

const styles = StyleSheet.create({
});

export default MoreInfoScreen;
