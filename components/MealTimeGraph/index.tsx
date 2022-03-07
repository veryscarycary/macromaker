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
import CaloriesYAxis from './components/CaloriesYAxis';
import { getCircleRadius } from './utils';

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
        <TimeXAxis
          startingXPos={startingXPos}
          startingYPos={height}
          width={width}
        />
        <CaloriesYAxis
          startingXPos={startingXPos}
          startingYPos={0}
          height={height}
          tdee={data.tdee}
        />

        {data.meals.map((meal, i) => {
          debugger;
          const date = new Date(meal.date);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const hoursFraction = hours + minutes / 60;
          const dayFraction = hoursFraction / 24;
          // climbing calorie total throughout the day
          const caloriesAdditive = data.meals.reduce(
            (acc, curr, j) => (j > i ? acc : curr.calories + acc),
            0
          );
          const caloriesAdditiveFraction = caloriesAdditive / data.tdee;
          const xPos = startingXPos + width * dayFraction;
          // height starts from the top of the screen, not bottom, so we need to flip it
          const yPos = height - height * caloriesAdditiveFraction;
          const radius = getCircleRadius(meal.calories, data.tdee);

          return (
            <D3Circle
              startingXPos={xPos}
              startingYPos={yPos}
              color={meal.color}
              radius={radius}
            />
          );
        })}
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
