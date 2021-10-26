import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DietHistoryScreenNavigationProp } from '../../../types';


type Props = {
  navigation: DietHistoryScreenNavigationProp;
};

const MenuButton = ({ navigation }: Props) => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('Modal')}
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
