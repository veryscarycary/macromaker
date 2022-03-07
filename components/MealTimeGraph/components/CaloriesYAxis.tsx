import React from 'react';
// @ts-ignore
import { Shape, Path, Group, Text } from '@react-native-community/art';
import VerticalTick from './VerticalTick';
import { getYPos } from '../utils';

type Props = {
  startingXPos: number;
  startingYPos: number;
  height: number;
  tdee: number;
  interval?: number;
};

const CaloriesYAxis = ({ startingXPos, startingYPos, height, tdee, interval = 500 }: Props) => {
  const centerTextOffset = 7;
  const tdeeToNearest500 = Math.round(tdee / interval) * interval;
  const numIntervals = tdeeToNearest500 / interval;

  return (
    <>
      <Group x={startingXPos} y={startingYPos}>
        {Array.from(Array(numIntervals)).map((_, i) => (
          <>
            <Text
              fill="#717171"
              x={0}
              y={height - getYPos(interval * (i + 1), tdee, height) - centerTextOffset}
              font={`12px Arial`}
              alignment="right"
            >
              {`${interval * (i + 1)}`}
            </Text>
          </>
        ))}
      </Group>
    </>
  );
};

export default CaloriesYAxis;
