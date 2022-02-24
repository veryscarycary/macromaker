import React from 'react';
// @ts-ignore
import { Shape, Path, Group } from '@react-native-community/art';
import { scaleBand, scaleLinear } from 'd3-scale';
import { BarGraphData } from '../types';

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
  hookDirection: string;
  x?: number;
  y?: number;
};

const HorizontalBarWithHook = ({
  index,
  width,
  data,
  height,
  color,
  thickness,
  x,
  y,
  hookDirection = 'bottom',
}: Props) => {
  const targetTotalCalories = data.reduce(
    (acc, curr) => acc + curr.targetAmount,
    0
  );
  const targetMacroCalories = data[index].targetAmount;
  let getXScaleOutput;
  let barLength;

  // set Y
  const yAxis = createY(height);

  // lays out the entire data index range
  yAxis.domain(
    data.map((d: BarGraphData, i: number) => {
      return i.toString();
    })
  );

  // necessary so we can keep all 3 graphs in same scale when we scale down
  const hasAnyMacroCalorieExceededTDEE = data.some(macro => macro.amount > targetTotalCalories);

  // set starting x position
  if (hasAnyMacroCalorieExceededTDEE) {
    const ratioData = data.map((data) => ({
      amount: data.amount,
      ratio: data.amount / targetTotalCalories,
    }));
    const highestRatio = Math.max(...ratioData.map(datum => datum.ratio));
    const highestMacroCalorieThatExceededTDEE = ratioData.find(datum => datum.ratio === highestRatio).amount;

    // fill container and scale our graph down
    getXScaleOutput = createX(highestMacroCalorieThatExceededTDEE, width);
    barLength = getXScaleOutput(targetMacroCalories);
  } else {
    getXScaleOutput = createX(targetTotalCalories, width);
    barLength = getXScaleOutput(targetMacroCalories);
  }

  // finds the position of THIS bar in that range
  const startingYPos = yAxis(index.toString());

  // set starting x position
  const startingXPos = barLength;

  // Draw path (x and y originate from the top-left corner)
  // start at top of bar, left, down, then right. Autocloses back at finish
  const d = new Path()
    .moveTo(startingXPos, startingYPos)
    .line(-barLength, 0)
    .line(0, thickness)
    .line(barLength, 0);

  if (hookDirection === 'top') {
    d.line(0, -thickness)
      .line(-thickness, -thickness)
      .line(0, thickness * 2);
  } else {
    d.line(thickness, thickness).line(0, -thickness * 2);
  }

  return (
    <Group x={x} y={y}>
      <Shape d={d} fill={color} />
    </Group>
  );
};

export default HorizontalBarWithHook;
