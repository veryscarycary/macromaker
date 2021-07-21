import React from 'react';
import { View, StyleSheet } from 'react-native';

const Spacer = ({ children }) => {
  return <View style={styles.spacer}>{children}</View>;
};

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },
});

export default Spacer;
