import React from 'react';
import { Rect } from 'react-native-svg';

type Props = {
  startingXPos: number;
  startingYPos: number;
  width: number;
  height: number;
  color: string;
};

const D3Rectangle = ({ startingXPos, startingYPos, width, height, color }: Props) => {
  return <Rect x={startingXPos} y={startingYPos} width={width} height={height} fill={color} />;
};

export default D3Rectangle;
