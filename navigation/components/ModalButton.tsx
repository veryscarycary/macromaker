import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../design/components';
import { colors } from '../../design/tokens/colors';
import { radius } from '../../design/tokens/radius';
import { spacing } from '../../design/tokens/spacing';

type Props = {
  children: string;
  icon: string;
  hasBottomBorder?: boolean;
  onPress: () => void;
};

const ModalButton = ({
  children,
  icon,
  hasBottomBorder = true,
  onPress,
}: Props) => {
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.iconWrap}>
          <Ionicons size={24} name={icon} color={colors.brand.primary} />
        </View>
        <Text variant="subheading" style={styles.label}>
          {children}
        </Text>
      </TouchableOpacity>

      {hasBottomBorder ? (
        <View style={styles.bottomBorderContainer}>
          <View style={styles.bottomBorder}></View>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  label: {
    marginLeft: spacing.md,
    color: colors.text.primary,
  },
  bottomBorderContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  bottomBorder: {
    width: '90%',
    height: 1,
    backgroundColor: colors.neutral[200],
  },
});

export default ModalButton;
