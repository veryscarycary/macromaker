import React from 'react';
import { Text, View } from '../Themed';
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
  let barWidth = width * 0.80;

  const data: BarGraphData[] = [
    { label: 'Carbs', amount: 400, targetAmount: 900, color: '#1854bd' },
    { label: 'Protein', amount: 800, targetAmount: 900, color: '#982f2f' },
    { label: 'Fat', amount: 450, targetAmount: 900, color: '#b59b46' },
  ];

  return (
    <View style={styles.main}>
      {/* <YAxis height={yAxisHeight} width={width} /> */}
      <Text style={styles.totalCalories}>Total Calories</Text>

      <MultipleMacroBarWithContainer
        data={data}
        width={width}
        height={height}
        barWidth={barWidth * .9}
        thickness={28}
        color1={data[0].color}
        color2={data[1].color}
        color3={data[2].color}
        x={55}
        y={3}
      />

      {/* <XAxis width={width - 10} height={xAxisHeight} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginTop: 10,
    marginHorizontal: 0,
  },
  totalCalories: {
    fontFamily: 'helvetica',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#6a6a6a',
    padding: 18
  },
});

export default TotalCaloriesGraph;
