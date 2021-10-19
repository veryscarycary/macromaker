import React from 'react';
import { View } from '../Themed';
import { StyleSheet, Dimensions } from 'react-native';

import XAxis from './XAxis';
import YAxis from './YAxis';
import MultipleMacroBarWithContainer from './components/MultipleMacroBarWithContainer';
import { BarGraphData } from '../BarGraph/types';

const TotalCaloriesGraph = () => {
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;
  let xAxisHeight = 325;
  let yAxisHeight = 30;
  let barWidth = width - 10;
  let barHeight = height / 5;

  const data: BarGraphData[] = [
    { label: 'Carbs', amount: 400, targetAmount: 900, color: '#1854bd' },
    { label: 'Protein', amount: 800, targetAmount: 900, color: '#982f2f' },
    { label: 'Fat', amount: 450, targetAmount: 900, color: '#b59b46' },
  ];

  return (
    <View style={styles.main}>
      {/* <YAxis height={yAxisHeight} width={width} /> */}

      <MultipleMacroBarWithContainer
        data={data}
        width={barWidth * .9}
        height={barHeight}
        thickness={22}
        color1={data[0].color}
        color2={data[1].color}
        color3={data[2].color}
        x={45}
      />

      {/* <XAxis width={width - 10} height={xAxisHeight} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginVertical: 25,
    marginHorizontal: 0,
  },
});

export default TotalCaloriesGraph;
