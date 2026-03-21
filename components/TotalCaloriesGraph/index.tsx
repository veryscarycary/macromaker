import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';

import MultipleMacroBarWithContainer from './components/MultipleMacroBarWithContainer';
import { BarGraphData } from '../BarGraph/types';
import { Text } from '../../design/components';
import { colors } from '../../design/tokens/colors';
import { fontFamilies } from '../../design/tokens/typography';

type Props = {
  data: BarGraphData[];
};

const TotalCaloriesGraph = ({ data }: Props) => {
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;
  let barWidth = width * 0.8;

  return (
    <View style={styles.main}>
      {/* <YAxis height={yAxisHeight} width={width} /> */}
      <Text style={styles.totalCalories}>Total Calories</Text>

      <MultipleMacroBarWithContainer
        data={data}
        width={width}
        height={height}
        barWidth={barWidth * 0.9}
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
    fontFamily: fontFamilies.regular,
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    color: colors.text.secondary,
    padding: 18,
  },
});

export default TotalCaloriesGraph;
