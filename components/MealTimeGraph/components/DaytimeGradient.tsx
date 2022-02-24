import React from 'react';
// @ts-ignore
import {
  Shape,
  Path,
  Group,
  LinearGradient,
} from '@react-native-community/art';

type Props = {
  startingXPos: number;
  startingYPos: number;
  endingXPos: number;
  width: number;
  height: number;
};

const DaytimeGradient = ({
  startingXPos,
  startingYPos,
  endingXPos,
  width,
  height,
}: Props) => {
  // Draw path (x and y originate from the top-left corner)
  // start at top of bar, left, down, then right. Autocloses back at finish
  const d = new Path()
    .moveTo(startingXPos, startingYPos)
    .line(width, 0)
    .line(0, height)
    .line(-width, 0);

  const colors = ['blue', 'white', 'blue'];
  const linearGradient = new LinearGradient(
    {
      '0': '#002d8d',
      '.3': 'white',
      '.7': 'white',
      '1': '#002d8d',
    },
    startingXPos,
    startingYPos,
    endingXPos,
    0,
  );

  return (
    <Group x={0} y={0}>
      <Shape d={d} fill={linearGradient} />
    </Group>
  );
};

export default DaytimeGradient;
