import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DietScreenNavigationProp } from '../../../../../types';
import { Text } from '../../../../../design/components';
import { colors } from '../../../../../design/tokens/colors';
import { spacing } from '../../../../../design/tokens/spacing';

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
      <Text variant="bodyMedium" style={styles.label}>
        Meal
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    margin: spacing.lg,
    borderRadius: spacing.sm,
    backgroundColor: colors.brand.primary,
    overflow: 'hidden',
  },
  label: {
    color: colors.text.inverse,
  },
});

export default AddMealSectionButton;
