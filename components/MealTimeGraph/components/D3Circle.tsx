import React from 'react';
import { Circle } from 'react-native-svg';

type Props = {
  startingXPos: number;
  startingYPos: number;
  color: string;
  radius: number;
};

const D3Circle = ({ startingXPos, startingYPos, color, radius }: Props) => {
  return <Circle cx={startingXPos} cy={startingYPos} r={radius} fill={color} />;
};

export default D3Circle;
