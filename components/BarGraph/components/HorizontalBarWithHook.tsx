import React from 'react';
import { BarGraphData } from '../types';
import D3RectangleHook from './D3RectangleHook';

type Props = {
  data: BarGraphData[];
  index: number;
  width: number;
  height: number;
  color: string;
  thickness: number;
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
  hookDirection,
  x,
  y,
}: Props) => {
  return (
    <D3RectangleHook
      index={index}
      width={width}
      data={data}
      height={height}
      color={color}
      thickness={thickness}
      hookDirection={hookDirection}
      x={x}
      y={y}
    />
  );
};

export default HorizontalBarWithHook;
