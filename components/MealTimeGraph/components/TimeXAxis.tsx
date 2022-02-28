import React from 'react';
// @ts-ignore
import { Shape, Path, Group, Text } from '@react-native-community/art';
import VerticalTick from './VerticalTick';

type Props = {
  startingXPos: number;
  startingYPos: number;
  width: number;
};

const TimeXAxis = ({ startingXPos, startingYPos, width }: Props) => {
  const intervals = [3, 6, 9, 12, 3, 6, 9];
  const widthBetweenTicks = width / (intervals.length + 1);
  let didPass12 = false;

  const getAmPm = (time: number) => {
    if (time >= 12)
      didPass12 = true;

    return didPass12 ? 'pm' : 'am';
  };

  return (
    <>
      <Group x={startingXPos + widthBetweenTicks} y={startingYPos}>
        {intervals.map((interval, i) => (
          <>
            <VerticalTick
              startingXPos={widthBetweenTicks * i}
              startingYPos={-5}
              color="#717171"
            />
            <Text
              fill="#717171"
              x={widthBetweenTicks * i}
              y={0}
              font={`14px Arial`}
              alignment="center"
            >
              {`${interval}${getAmPm(interval)}`}
            </Text>
          </>
        ))}
      </Group>
    </>
  );
};

export default TimeXAxis;
