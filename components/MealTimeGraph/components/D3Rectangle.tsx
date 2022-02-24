import React from 'react';
// @ts-ignore
import { Shape, Path, Group } from '@react-native-community/art';

type Props = {
  startingXPos: number;
  startingYPos: number;
  length: number;
  height: number;
  color: string;
};

const D3Rectangle = ({
  startingXPos,
  startingYPos,
  length,
  height,
  color,
}: Props) => {
  // Draw path (x and y originate from the top-left corner)
  // start at top of bar, left, down, then right. Autocloses back at finish
  const d = new Path()
    .moveTo(startingXPos, startingYPos)
    .line(length, 0)
    .line(0, height)
    .line(-length, 0);

  return (
    <Group x={0} y={0}>
      <Shape d={d} fill={color} />
    </Group>
  );
};

export default D3Rectangle;
