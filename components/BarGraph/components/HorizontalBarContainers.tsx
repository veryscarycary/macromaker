import React from 'react';
import { StyleSheet } from 'react-native';
import HorizontalBarContainer from './HorizontalBarContainer';

import { Text, View } from './Themed';

const HorizontalBarContainers = ({
  label,
}: {
  label: string;
}) => {

  return (
    <View style={styles.container}>
      <HorizontalBarContainer label="Carbs" />
      <HorizontalBarContainer label="Protein" />
      <HorizontalBarContainer label="Fat" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 40,
    backgroundColor: '#bbb',
  },
});

export default HorizontalBarContainers;
