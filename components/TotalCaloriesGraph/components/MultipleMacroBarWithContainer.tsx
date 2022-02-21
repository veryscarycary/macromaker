import React from 'react';
// @ts-ignore
import { Shape, Path, Group, Surface, Text } from '@react-native-community/art';
import { scaleBand, scaleLinear } from 'd3-scale';
import { BarGraphData } from '../../BarGraph/types';
import { DAILY_RECOMMENDED_CALORIES } from '../../../constants';

const createX = (calories: number, width: number) => {
  return scaleLinear().domain([0, calories]).range([0, width]);
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
  const startingXPos = 0;
  const startingYPos = 0;
  let targetCaloriesLabelXPos;
  let getScaleOutput;

  const targetCalories = Math.round(
    data.reduce((acc, curr) => acc + curr.targetAmount, 0)
  );
  const currentCalories = Math.round(
    data.reduce((acc, curr) => acc + curr.amount, 0)
  );

  if (currentCalories > targetCalories) {
    getScaleOutput = createX(currentCalories, barWidth);
    targetCaloriesLabelXPos = getScaleOutput(targetCalories);
  } else {
    getScaleOutput = createX(targetCalories, barWidth);
    targetCaloriesLabelXPos = barWidth + 10;
  }

  const startingXFirst = startingXPos;

  const firstLength = getScaleOutput(data[0].amount);
  const secondLength = getScaleOutput(data[1].amount);
  const thirdLength = getScaleOutput(data[2].amount);

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

  const targetCaloriesLine = new Path()
    .moveTo(targetCaloriesLabelXPos - 15, startingYPos - 2)
    .line(0, -thickness - 9);

  return (
    <Surface width={width} height={height}>
      <Group x={x} y={y + 10}>
        <Shape d={first} fill={color1} stroke="#000000" />
        <Shape d={second} fill={color2} stroke="#000000" />
        <Shape d={third} fill={color3} stroke="#000000" />
        <Shape d={container} stroke="#000000" strokeWidth={3} />
      </Group>

      <Group x={x} y={y + 45}>
        <Shape d={targetCaloriesLine} stroke="#ffb85b" strokeWidth={5} />
        <Text
          fill="#717171"
          x={targetCaloriesLabelXPos}
          y={0}
          font={`14px Arial`}
          alignment="right"
        >
          {targetCalories.toString()}
        </Text>
      </Group>

      {currentCalories > targetCalories && (
        <Group x={x} y={y + 45}>
          <Text
            fill="#db0000"
            x={barWidth + 10}
            y={0}
            font={`14px Arial`}
            alignment="right"
          >
            {currentCalories.toString()}
          </Text>
        </Group>
      )}
    </Surface>
  );
};

export default MultipleMacroBarWithContainer;
