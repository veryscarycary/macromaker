import React from 'react';
import { Text } from '../../../../../components/Themed';
import { Ionicons } from '@expo/vector-icons';

import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { DietScreenNavigationProp } from '../../../../../types';

type Props = {
  navigation: DietScreenNavigationProp;
};

const AddMealSectionButton = ({
  navigation,
}: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('AddFoodScreen')}
    >
      <Ionicons size={32} name="add-outline" />
      <Text style={styles.label}>Meal</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#dedede',
    overflow: 'hidden',
    fontSize: 42,
  },
  label: {
    fontSize: 20,
  }
});

export default AddMealSectionButton;
