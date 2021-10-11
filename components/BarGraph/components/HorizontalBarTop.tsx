import React from 'react';
import { BarGraphData } from '../types';
import D3Shape from './D3Shape';

type Props = {
  data: BarGraphData[];
  index: number;
  width: number;
  height: number;
  color: string;
  thickness: number;
};

const HorizontalBarTop = ({
  index,
  width,
  data,
  height,
  color,
  thickness,
}: Props) => {
  return (
    <D3Shape
      index={index}
      width={width}
      data={data}
      height={height}
      color={color}
      thickness={thickness}
      type="top"
    />
  );
};

export default HorizontalBarTop;
