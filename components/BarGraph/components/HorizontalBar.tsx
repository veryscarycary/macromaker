import React from 'react';
import { BarGraphData } from '../types';
import D3Rectangle from './D3Rectangle';

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
    <D3Rectangle
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
