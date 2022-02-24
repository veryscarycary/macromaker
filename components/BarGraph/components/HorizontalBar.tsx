import React from 'react';
import { BarGraphData } from '../types';
import D3HorizontalBar from './D3HorizontalBar';

type Props = {
  data: BarGraphData[];
  index: number;
  width: number;
  height: number;
  color: string;
  thickness: number;
};

const HorizontalBar = ({
  index,
  width,
  data,
  height,
  color,
  thickness,
}: Props) => {
  return (
    <D3HorizontalBar
      index={index}
      width={width}
      data={data}
      height={height}
      color={color}
      thickness={thickness}
      type="main"
    />
  );
};

export default HorizontalBar;
