import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DietScreenNavigationProp } from '../../../types';

type Props = {
  navigation: DietScreenNavigationProp,
};

const AddFoodHeaderButton = ({ navigation }: Props) => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('AddFoodScreen')}
  >
    <Ionicons size={30} style={{ marginBottom: -3 }} name="add-outline" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  plus: { fontSize: 30 },
});

export default AddFoodHeaderButton;
