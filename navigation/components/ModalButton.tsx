import React from 'react';
import { Text, View } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';

import { StyleSheet, TouchableOpacity } from 'react-native';
// import { DietScreenNavigationProp } from '../types';

type Props = {
  // navigation: DietScreenNavigationProp;
  children: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  hasBottomBorder?: boolean;
};

const ModalButton = ({
  children,
  icon,
  hasBottomBorder = true,
}: // navigation,
Props) => {
  return (
    <>
      <TouchableOpacity
        style={styles.container}
        // onPress={() => navigation.navigate('AddFoodScreen', { date })}
      >
        <Ionicons size={32} name={icon} />
        <Text style={styles.label}>{children}</Text>
      </TouchableOpacity>

      {/* bottom border */}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#dedede',
    overflow: 'hidden',
    fontSize: 42,
  },
  label: {
    fontSize: 20,
    marginLeft: 12,
  },
  bottomBorderContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  bottomBorder: {
    width: '90%',
    height: 1,
    backgroundColor: '#000',
  },
});

export default ModalButton;
