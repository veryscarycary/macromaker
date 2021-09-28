import React from 'react';
import { View } from '../Themed';
import { StyleSheet, Dimensions } from 'react-native';

import Columns from './Columns';
import XAxis from './XAxis';
import YAxis from './YAxis';

export default function BarGraph({ color }) {
  let width = Dimensions.get('screen').width;
  let yAxisHeight = 325;
  let xAxisHeight = 30;
  let barsHeight = 315;

  const data = [
    { duration: 4, column: 0 },
    { duration: 7, column: 1 },
    { duration: 6, column: 2 },
    { duration: 7, column: 3 },
    { duration: 8, column: 4 },
    { duration: 5, column: 5 },
    { duration: 8, column: 6 },
  ];

  return (
    <View style={styles.main}>
      <YAxis height={yAxisHeight} width={width} />

      <Columns
        data={data}
        width={width - 10}
        height={barsHeight}
        color={color}
      />

      <XAxis width={width - 10} height={xAxisHeight} />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginVertical: 25,
    marginHorizontal: 0,
  },
});
