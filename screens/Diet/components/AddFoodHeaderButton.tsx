import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DietScreenNavigationProp } from '../../../types';

type Props = {
  navigation: DietScreenNavigationProp;
};

const AddFoodHeaderButton = ({ navigation }: Props) => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('AddFoodScreen')}
  >
    <Ionicons size={30} style={{ marginBottom: -3 }} name="add-circle-outline" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
});

export default AddFoodHeaderButton;
