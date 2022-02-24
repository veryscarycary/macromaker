import React from 'react';
import { View } from '../Themed';
import { StyleSheet, Dimensions } from 'react-native';
import { Group, Shape, Surface } from '@react-native-community/art';
// import { BarGraphData } from './types';
import D3Rectangle from './components/D3Rectangle';
import DaytimeGradient from './components/DaytimeGradient';


type Props = {
  width: number;
  height: number;
  thickness: number;
};

const MealTimeGraph = () => {
  const width = Dimensions.get('screen').width;
  const height = 225;

  // let barsWidth = width - 10;
  // let barsHeight = height / 3;

  return (
    <View style={styles.main}>
      <Surface width={width} height={height}>
        <DaytimeGradient
          startingXPos={0.08 * width}
          startingYPos={0}
          endingXPos={0.92 * width}
          height={height - 2}
          width={0.84 * width}
        />
        <D3Rectangle
          startingXPos={0.08 * width}
          startingYPos={height - 2}
          height={2}
          width={0.84 * width}
          color="#a0a0a0"
        />
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