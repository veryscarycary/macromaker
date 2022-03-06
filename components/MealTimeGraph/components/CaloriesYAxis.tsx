import React from 'react';
// @ts-ignore
import { Shape, Path, Group, Text } from '@react-native-community/art';
import VerticalTick from './VerticalTick';

type Props = {
  startingXPos: number;
  startingYPos: number;
  height: number;
  tdee: number;
  interval?: number;
};

const CaloriesYAxis = ({ startingXPos, startingYPos, height, tdee, interval = 500 }: Props) => {
  const tdeeToNearest500 = Math.round(tdee / interval) * interval;
  const numIntervals = tdeeToNearest500 / interval;
  const heightBetweenTicks = height / (numIntervals);

  return (
    <>
      <Group x={startingXPos} y={startingYPos}>
        {Array.from(Array(numIntervals)).map((_, i) => (
          <>
            <Text
              fill="#717171"
              x={0}
              y={height - (heightBetweenTicks * (i + 1))}
              font={`12px Arial`}
              alignment="right"
            >
              {`${(i + 1) * interval}`}
            </Text>
          </>
        ))}
      </Group>
    </>
  );
};

export default CaloriesYAxis;
