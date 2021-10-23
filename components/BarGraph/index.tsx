import React from 'react';
import { View } from '../Themed';
import { StyleSheet, Dimensions } from 'react-native';

import HorizontalBars from './HorizontalBars';
import XAxis from './XAxis';
import YAxis from './YAxis';
import { BarGraphData } from './types';


const BarGraph = () => {
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;
  let xAxisHeight = 325;
  let yAxisHeight = 30;
  let barsWidth = width - 10;
  let barsHeight = height/3;

  const data: BarGraphData[] = [
    { label: 'Carbs', amount: 400, targetAmount: 900, color: '#1854bd' },
    { label: 'Protein', amount: 800, targetAmount: 900, color: '#982f2f' },
    { label: 'Fat', amount: 450, targetAmount: 900, color: '#b59b46' },
  ];

  return (
    <View style={styles.main}>
      {/* <YAxis height={yAxisHeight} width={width} /> */}

      <HorizontalBars
        data={data}
        width={barsWidth}
        height={barsHeight}
        thickness={22}
      />

      {/* <XAxis width={width - 10} height={xAxisHeight} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingVertical: 25,
    marginHorizontal: 0,
  },
});

export default BarGraph;