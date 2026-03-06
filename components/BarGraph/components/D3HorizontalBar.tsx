import React from 'react';
import { G, Rect } from 'react-native-svg';
import { scaleBand, scaleLinear } from 'd3-scale';
import { BarGraphData } from '../types';

const createX = (tdee: number, width: number) =>
  scaleLinear().domain([0, tdee]).range([0, width]);

const createY = (height: number) =>
  scaleBand().rangeRound([0, height]);

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
  x = 0,
  y = 0,
}: Props) => {
  const targetTotalCalories = data.reduce((acc, curr) => acc + curr.targetAmount, 0);
  const currentMacroCalories = data[index].amount;

  const yAxis = createY(height);
  yAxis.domain(data.map((_d, i) => i.toString()));

  let getXScaleOutput;
  if (currentMacroCalories > targetTotalCalories) {
    getXScaleOutput = createX(currentMacroCalories, width);
  } else {
    getXScaleOutput = createX(targetTotalCalories, width);
  }

  const startingYPos = yAxis(index.toString());
  let barLength = getXScaleOutput(currentMacroCalories);
  const startingXPos = barLength;

  if (type === 'top') {
    barLength = thickness / 4;
  }

  return (
    <G x={x} y={y}>
      <Rect
        x={startingXPos - barLength}
        y={startingYPos}
        width={barLength}
        height={thickness}
        fill={color}
      />
    </G>
  );
};

export default D3HorizontalBar;
