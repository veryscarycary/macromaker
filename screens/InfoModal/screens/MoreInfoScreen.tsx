import React, { useState, useContext } from 'react';
import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { ModalStackParamList, Navigation } from '../../../types';
import { createStackNavigator } from '@react-navigation/stack';
import { Context as InfoContext } from '../../../context/InfoContext';

type Props = {
  navigation: Navigation;
};

const ModalStack = createStackNavigator<ModalStackParamList>();

const MoreInfoScreen = ({ navigation }: Props) => {
  const {
    state: {
      name,
      age,
      gender,
      heightFeet,
      heightInches,
      weight,
      activityLevel,
      bmr,
      bmi,
      tdee,
    },
  } = useContext(InfoContext);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>name: {name}</Text>
      <Text>age: {age}</Text>
      <Text>gender: {gender}</Text>
      <Text>heightFeet: {heightFeet}</Text>
      <Text>heightInches: {heightInches}</Text>
      <Text>weight: {weight}</Text>
      <Text>activityLevel: {activityLevel}</Text>
      <Text>BMR: {bmr}</Text>
      <Text>TDEE: {tdee}</Text>
      <Text>BMI: {bmi}</Text>
      <Text style={{ fontSize: 30 }}>More Info!</Text>
      <Button onPress={() => navigation.navigate('Root')} title="Dismiss" />
    </View>
  );
};

const styles = StyleSheet.create({});

export default MoreInfoScreen;
