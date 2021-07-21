import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Themed';
import { DietScreenNavigationProp } from '../types';

type Props = {
  navigation: DietScreenNavigationProp,
};

const AddFoodHeaderButton = ({ navigation }: Props) => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('AddFoodScreen')}
  >
    <Text style={styles.plus}>+</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  plus: { fontSize: 30 },
});

export default AddFoodHeaderButton;
