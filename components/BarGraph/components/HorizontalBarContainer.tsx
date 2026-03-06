import React from 'react';
import { G, Rect } from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  fill: string;
  stroke: string;
  x?: number;
  y?: number;
  borderRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomRightRadius?: number;
  bottomLeftRadius?: number;
};

const HorizontalBarContainer = ({
  fill,
  stroke,
  x = 0,
  y = 0,
  borderRadius = 0,
  width,
  height,
}: Props) => {
  return (
    <G x={x} y={y}>
      <Rect
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        rx={borderRadius}
        ry={borderRadius}
      />
    </G>
  );
};

export default HorizontalBarContainer;
