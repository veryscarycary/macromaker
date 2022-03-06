import React from 'react';
// @ts-ignore
import { Shape, Path, Group } from '@react-native-community/art';

type Props = {
  startingXPos: number;
  startingYPos: number;
  // width: number;
  // height: number;
  color: string;
  radius: number;
};

const D3Circle = ({
  startingXPos,
  startingYPos,
  // width,
  // height,
  color,
  radius,
}: Props) => {
  // circle "startingXPos/startingYPos" is radius centerpoint
  const d = new Path()
    .moveTo(startingXPos, startingYPos - radius)
    .arc(0, radius * 2, radius)
    .arc(0, radius * -2, radius)

  return (
    <Group x={0} y={0}>
      <Shape d={d} fill={color} />
    </Group>
  );
};

export default D3Circle;
