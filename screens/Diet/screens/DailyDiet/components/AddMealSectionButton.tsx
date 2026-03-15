import React from 'react';
import { Text } from '../../../../../components/Themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DietScreenNavigationProp } from '../../../../../types';
import { colors } from '../../../../../design/tokens/colors';
import { fontFamilies } from '../../../../../design/tokens/typography';

type Props = {
  navigation: DietScreenNavigationProp;
  date: string;
};

const AddMealSectionButton = ({ date, navigation }: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('AddFoodScreen', { date })}
    >
      <Ionicons size={24} name="add-circle-outline" color={colors.text.inverse} />
      <Text style={styles.label}>Meal</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    margin: 16,
    borderRadius: 8,
    backgroundColor: colors.brand.primary,
    overflow: 'hidden',
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.text.inverse,
  },
});

export default AddMealSectionButton;
