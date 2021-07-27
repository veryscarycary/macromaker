import React from 'react';
import { View, StyleSheet } from 'react-native';

const Spacer = () => {
  return <View style={styles.spacer}></View>;
};

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },
});

export default Spacer;
