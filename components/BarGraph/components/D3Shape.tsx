import React from 'react';
// @ts-ignore
import { Group, Shape, Path, Surface } from '@react-native-community/art';
import { scaleBand, scaleLinear } from 'd3-scale';
import { BarGraphData } from '../types';

const createX = (width: number) => {
  return scaleLinear().domain([0, 16]).range([0, width]);
};

const createY = (height: number) => {
  return scaleBand().rangeRound([20, height - 75]);
};

type Props = {
  data: BarGraphData[];
  index: number;
  width: number;
  height: number;
  color: string;
  thickness: number;
  type: string;
};

const D3Shape = ({ index, width, data, height, color, thickness, type }: Props) => {
  // set Y
  const y = createY(height);

  // lays out the entire data index range
  y.domain(
    data.map((d: BarGraphData) => {
      return d.columnId.toString();
    })
  );

  // finds the position of THIS bar in that range
  const startingYPos = y(data[index].columnId.toString());

  // set X
  const x = createX(width);

  // set starting x position
  let barLength = x(data[index].amount);
  const startingXPos = barLength;

  if (type === 'top') {
    barLength = 23; 
  }

  // Draw path (x and y originate from the top-left corner)
  // start at top of bar, left, down, then right. Autocloses back at finish
  const d = new Path()
    .moveTo(startingXPos, startingYPos)
    .line(-barLength, 0)
    .line(0, thickness)
    .line(barLength, 0);

  return <Shape d={d} fill={color} />;
};

export default D3Shape;