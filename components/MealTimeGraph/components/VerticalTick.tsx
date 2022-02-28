import React from 'react';
// @ts-ignore
import { Shape, Path, Group } from '@react-native-community/art';
import D3Rectangle from './D3Rectangle';

type Props = {
  startingXPos: number;
  startingYPos: number;
  color: string;
};

const VerticalTick = ({
  startingXPos,
  startingYPos,
  color,
}: Props) => {
  const width = 2;
  const height = 5;
  // Draw path (x and y originate from the top-left corner)
  // start at top of bar, left, down, then right. Autocloses back at finish
  const d = new Path()
    .moveTo(startingXPos, startingYPos)
    .line(width, 0)
    .line(0, height)
    .line(-width, 0);

  return (
    <D3Rectangle
      startingXPos={startingXPos}
      startingYPos={startingYPos}
      width={width}
      height={height}
      color={color}
    />
  );
};

export default VerticalTick;
