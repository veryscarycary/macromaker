import React from 'react';
// @ts-ignore
import { Shape, Path, Group, Surface, Text } from '@react-native-community/art';
import { scaleBand, scaleLinear } from 'd3-scale';
import { BarGraphData } from '../../BarGraph/types';
import { DAILY_RECOMMENDED_CALORIES } from '../../../constants';

const createX = (width: number) => {
  return scaleLinear()
    .domain([0, DAILY_RECOMMENDED_CALORIES * 0.8])
    .range([0, width]);
};

const createY = (height: number) => {
  return scaleBand().rangeRound([0, height]);
};

type Props = {
  data: BarGraphData[];
  width: number;
  height: number;
  barWidth: number;
  color1: string;
  color2: string;
  color3: string;
  thickness: number;
  x?: number;
  y?: number;
};

const MultipleMacroBarWithContainer = ({
  width,
  height,
  barWidth,
  data,
  color1,
  color2,
  color3,
  thickness,
  x,
  y,
}: Props) => {
  const targetCalories = data.reduce((acc, curr) => acc + curr.targetAmount, 0);
  const currentCalories = data.reduce((acc, curr) => acc + curr.amount, 0);
  const startingXPos = 0;
  const startingYPos = 0;

  const ratioCalToTargetCal = currentCalories / targetCalories;

  const currentCaloriesLength = ratioCalToTargetCal * barWidth;

  const firstPercentage = data[0].amount / currentCalories;
  const secondPercentage = data[1].amount / currentCalories;
  const thirdPercentage = data[2].amount / currentCalories;

  const startingXFirst = startingXPos;
  const firstLength = currentCaloriesLength * firstPercentage;
  const secondLength = currentCaloriesLength * secondPercentage;
  const thirdLength = currentCaloriesLength * thirdPercentage;

  // Draw path (x and y originate from the top-left corner)
  // start at top of bar, left, down, then right. Autocloses back at finish
  const container = new Path()
    .moveTo(startingXPos, startingYPos)
    .line(barWidth, 0)
    .line(0, thickness)
    .line(-barWidth, 0)
    .line(0, -thickness);

  const first = new Path()
    .moveTo(startingXFirst, startingYPos)
    .line(firstLength, 0)
    .line(0, thickness)
    .line(-firstLength, 0)
    .line(0, -thickness);

  const second = new Path()
    .moveTo(firstLength, startingYPos)
    .line(secondLength, 0)
    .line(0, thickness)
    .line(-secondLength, 0)
    .line(0, -thickness);

  const third = new Path()
    .moveTo(firstLength + secondLength, startingYPos)
    .line(thirdLength, 0)
    .line(0, thickness)
    .line(-thirdLength, 0)
    .line(0, -thickness);

  return (
    <Surface width={width} height={height}>
      <Group x={x} y={y}>
        <Shape d={first} fill={color1} stroke="#000000" />
        <Shape d={second} fill={color2} stroke="#000000" />
        <Shape d={third} fill={color3} stroke="#000000" />
        <Shape d={container} stroke="#000000" strokeWidth={3} />
      </Group>

      <Group x={x} y={y + 35}>
        <Text
          fill="#717171"
          x={barWidth + 10}
          y={0}
          font={`14px Arial`}
          alignment="right"
        >
          {targetCalories.toString()}
        </Text>
      </Group>
    </Surface>
  );
};

export default MultipleMacroBarWithContainer;
