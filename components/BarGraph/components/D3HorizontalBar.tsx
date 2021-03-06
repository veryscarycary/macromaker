import React from 'react';
// @ts-ignore
import { Shape, Path, Group } from '@react-native-community/art';
import { scaleBand, scaleLinear } from 'd3-scale';
import { BarGraphData } from '../types';
import { DAILY_RECOMMENDED_CALORIES } from '../../../constants';

const createX = (tdee: number, width: number) => {
  return scaleLinear().domain([0, tdee]).range([0, width]);
};

const createY = (height: number) => {
  return scaleBand().rangeRound([0, height]);
};

type Props = {
  data: BarGraphData[];
  index: number;
  width: number;
  height: number;
  color: string;
  thickness: number;
  type: string;
  x?: number;
  y?: number;
};

const D3HorizontalBar = ({
  index,
  width,
  data,
  height,
  color,
  thickness,
  type,
  x,
  y,
}: Props) => {
  const targetTotalCalories = data.reduce(
    (acc, curr) => acc + curr.targetAmount,
    0
  );
  const currentMacroCalories = data[index].amount;
  let getXScaleOutput;

  // set Y
  const yAxis = createY(height);

  // lays out the entire data index range
  yAxis.domain(
    data.map((d: BarGraphData, i: number) => {
      return i.toString();
    })
  );

  // set starting x position
  if (currentMacroCalories > targetTotalCalories) {
    getXScaleOutput = createX(currentMacroCalories, width);
  } else {
    getXScaleOutput = createX(targetTotalCalories, width);
  }

  // finds the position of THIS bar in that range
  const startingYPos = yAxis(index.toString());

  // set starting x position
  let barLength = getXScaleOutput(currentMacroCalories);
  const startingXPos = barLength;

  if (type === 'top') {
    barLength = thickness / 4;
  }

  // Draw path (x and y originate from the top-left corner)
  // start at top of bar, left, down, then right. Autocloses back at finish
  const d = new Path()
    .moveTo(startingXPos, startingYPos)
    .line(-barLength, 0)
    .line(0, thickness)
    .line(barLength, 0);

  return (
    <Group x={x} y={y}>
      <Shape d={d} fill={color} />
    </Group>
  );
};

export default D3HorizontalBar;
