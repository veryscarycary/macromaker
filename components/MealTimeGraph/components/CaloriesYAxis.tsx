import React from 'react';
import { G, Text } from 'react-native-svg';
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
    <G x={startingXPos} y={startingYPos}>
      {Array.from(Array(numIntervals)).map((_, i) => (
        <Text
          key={i}
          fill="#717171"
          x={0}
          y={height - getYPos(interval * (i + 1), tdee, height) - centerTextOffset}
          fontSize={12}
          fontFamily="Arial"
          textAnchor="end"
        >
          {`${interval * (i + 1)}`}
        </Text>
      ))}
    </G>
  );
};

export default CaloriesYAxis;
