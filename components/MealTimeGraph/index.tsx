import React from 'react';
import { View } from '../Themed';
import { StyleSheet, Dimensions } from 'react-native';
import { Group, Shape, Surface } from '@react-native-community/art';
// import { BarGraphData } from './types';
import D3Rectangle from './components/D3Rectangle';
import DaytimeGradient from './components/DaytimeGradient';
import TimeXAxis from './components/TimeXAxis';


type Props = {
  width: number;
  height: number;
  thickness: number;
};

const MealTimeGraph = () => {
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