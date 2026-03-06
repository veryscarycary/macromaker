import React from 'react';
import { G, Path } from 'react-native-svg';
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
  type?: string;
  hookDirection?: string;
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
  x = 0,
  y = 0,
  hookDirection = 'bottom',
}: Props) => {
  const targetTotalCalories = data.reduce((acc, curr) => acc + curr.targetAmount, 0);
  const targetMacroCalories = data[index].targetAmount;

  const yAxis = createY(height);
  yAxis.domain(data.map((_d, i) => i.toString()));

  const hasAnyMacroCalorieExceededTDEE = data.some(macro => macro.amount > targetTotalCalories);
  let getXScaleOutput;

  if (hasAnyMacroCalorieExceededTDEE) {
    const ratioData = data.map(d => ({ amount: d.amount, ratio: d.amount / targetTotalCalories }));
    const highestRatio = Math.max(...ratioData.map(d => d.ratio));
    const highest = ratioData.find(d => d.ratio === highestRatio)!.amount;
    getXScaleOutput = createX(highest, width);
  } else {
    getXScaleOutput = createX(targetTotalCalories, width);
  }

  const startingYPos = yAxis(index.toString());
  const barLength = getXScaleOutput(targetMacroCalories);
  const startingXPos = barLength;

  let dStr: string;
  if (hookDirection === 'top') {
    dStr = `M ${startingXPos} ${startingYPos} l ${-barLength} 0 l 0 ${thickness} l ${barLength} 0 l 0 ${-thickness} l ${-thickness} ${-thickness} l 0 ${thickness * 2} Z`;
  } else {
    dStr = `M ${startingXPos} ${startingYPos} l ${-barLength} 0 l 0 ${thickness} l ${barLength} 0 l ${thickness} ${thickness} l 0 ${-thickness * 2} Z`;
  }

  return (
    <G x={x} y={y}>
      <Path d={dStr} fill={color} />
    </G>
  );
};

export default HorizontalBarWithHook;
