import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Themed';
import { DietScreenNavigationProp } from '../types';
import { Ionicons } from '@expo/vector-icons';


type Props = {
  navigation: DietScreenNavigationProp,
};

const MenuButton = ({ navigation }: Props) => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('AddFoodScreen')}
  >
    <Ionicons size={30} style={{ marginBottom: -3 }} name="reorder-three"/>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  plus: { fontSize: 30 },
});

export default MenuButton;
