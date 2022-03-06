import React from 'react';
import { View } from '../Themed';
import { StyleSheet, Dimensions } from 'react-native';
import { Group, Shape, Surface } from '@react-native-community/art';
// import { BarGraphData } from './types';
import D3Rectangle from './components/D3Rectangle';
import DaytimeGradient from './components/DaytimeGradient';
import TimeXAxis from './components/TimeXAxis';
import D3Circle from './components/D3Circle';
import { MealTimeData } from './types';


type Props = {
  data: MealTimeData;
};

const MealTimeGraph = ({ data }: Props) => {
  const screenWidth = Dimensions.get('screen').width;
  const startingXPos = 0.08 * screenWidth;
  const endingXPos = 0.92 * screenWidth;
  const width = 0.84 * screenWidth;
  const surfaceHeight = 250;
  const height = surfaceHeight - 25;
  
  // let barsWidth = width - 10;
  // let barsHeight = height / 3;

  return (
    <View style={styles.main}>
      <Surface width={screenWidth} height={surfaceHeight}>
        {/* graph background */}
        <DaytimeGradient
          startingXPos={startingXPos}
          startingYPos={0}
          endingXPos={endingXPos}
          height={height}
          width={width}
        />
        {/* bottom line */}
        <D3Rectangle
          startingXPos={0.08 * screenWidth}
          startingYPos={height - 2}
          height={2}
          width={width}
          color="#a0a0a0"
        />
        <D3Circle startingXPos={startingXPos} startingYPos={0} color="black" radius={15} />

        <TimeXAxis startingXPos={startingXPos} startingYPos={height} width={width} />
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingVertical: 20,
    marginHorizontal: 0,
  },
});

export default MealTimeGraph;