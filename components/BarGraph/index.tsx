import React from 'react';
import { View } from '../Themed';
import { StyleSheet, Dimensions } from 'react-native';

import HorizontalBars from './HorizontalBars';
import XAxis from './XAxis';
import YAxis from './YAxis';
import { BarGraphData } from './types';

type Props = {
  color: string;
};

const BarGraph = ({ color }: Props) => {
  let width = Dimensions.get('screen').width;
  let xAxisHeight = 325;
  let yAxisHeight = 30;
  let barsWidth = width;

  const data: BarGraphData[] = [
    { columnId: 0, amount: 4 },
    { columnId: 1, amount: 7 },
    { columnId: 2, amount: 6 },
  ];

  return (
    <View style={styles.main}>
      {/* <YAxis height={yAxisHeight} width={width} /> */}

      <HorizontalBars
        data={data}
        width={width - 10}
        height={barsWidth}
        color={color}
        thickness={22}
      />

      {/* <XAxis width={width - 10} height={xAxisHeight} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginVertical: 25,
    marginHorizontal: 0,
  },
});

export default BarGraph;