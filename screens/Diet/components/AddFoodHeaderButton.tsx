import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DietScreenNavigationProp } from '../../../types';
import { colors } from '../../../design/tokens/colors';

type Props = {
  navigation: DietScreenNavigationProp;
};

const AddFoodHeaderButton = ({ navigation }: Props) => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('AddFoodScreen')}
  >
    <Ionicons size={24} color={colors.brand.primary} name="add-circle-outline" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});

export default AddFoodHeaderButton;
