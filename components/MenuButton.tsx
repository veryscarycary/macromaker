import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DietScreenNavigationProp } from '../types';
import { Ionicons } from '@expo/vector-icons';


type Props = {
  navigation: DietScreenNavigationProp,
};

const MenuButton = ({ navigation }: Props) => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.openDrawer()}
  >
    <Ionicons size={30} style={{ marginBottom: -3 }} name="reorder-three"/>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginLeft: 5,
  },
  plus: { fontSize: 30 },
});

export default MenuButton;
