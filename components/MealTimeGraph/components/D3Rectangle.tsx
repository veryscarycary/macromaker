import React from 'react';
// @ts-ignore
import { Shape, Path, Group } from '@react-native-community/art';

type Props = {
  startingXPos: number;
  startingYPos: number;
  width: number;
  height: number;
  color: string;
};

const D3Rectangle = ({
  startingXPos,
  startingYPos,
  width,
  height,
  color,
}: Props) => {
  // Draw path (x and y originate from the top-left corner)
  // start at top of bar, left, down, then right. Autocloses back at finish
  const d = new Path()
    .moveTo(startingXPos, startingYPos)
    .line(width, 0)
    .line(0, height)
    .line(-width, 0);

  return (
    <Group x={0} y={0}>
      <Shape d={d} fill={color} />
    </Group>
  );
};

export default D3Rectangle;
