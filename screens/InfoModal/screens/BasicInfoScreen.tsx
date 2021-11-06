import React, { useState } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../../components/Themed';
import { ModalStackParamList, Navigation } from '../../../types';
import { createStackNavigator } from '@react-navigation/stack';
import DismissKeyboardView from '../../../components/DismissKeyboardView';
import { Input } from 'react-native-elements';
import Spacer from '../../../components/Spacer';

type Props = {
  navigation: Navigation;
};

const ModalStack = createStackNavigator<ModalStackParamList>();

const BasicInfoScreen = ({ navigation }: Props) => {
  return (
    <DismissKeyboardView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      {/* <View style={styles.fields}> */}
      <Input placeholder="Your Name" />
      <Input placeholder="Your Gender" />
      <Input placeholder="Your Height" />
      <Input placeholder="Your Weight" />
      <Input placeholder="Your Age" />
      <Input placeholder="Activity Level" />

      {/* </View> */}
      {/* <Spacer /> */}
      <TouchableOpacity onPress={() => navigation.navigate('MoreInfo')}>
        <Text>Calculate BMI</Text>
      </TouchableOpacity>
    </DismissKeyboardView>
  );
};
{
  /* <Button onPress={() => navigation.navigate('MoreInfo')} title="Go to More Info" /> */
}

const styles = StyleSheet.create({});

export default BasicInfoScreen;
