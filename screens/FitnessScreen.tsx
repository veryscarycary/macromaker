import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../design/components';

export default function FitnessScreen() {
  return (
    <View style={styles.container}>
      <Text variant="heading">Fitness</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
