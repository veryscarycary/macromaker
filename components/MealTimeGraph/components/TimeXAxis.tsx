import React from 'react';
import { G, Text } from 'react-native-svg';
import VerticalTick from './VerticalTick';
import { colors } from '../../../design/tokens/colors';

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
    if (time >= 12) didPass12 = true;
    return didPass12 ? 'pm' : 'am';
  };

  return (
    <G x={startingXPos + widthBetweenTicks} y={startingYPos}>
      {intervals.map((interval, i) => (
        <G key={i}>
          <VerticalTick
            startingXPos={widthBetweenTicks * i}
            startingYPos={-5}
            color={colors.text.secondary}
          />
          <Text
            fill={colors.text.secondary}
            x={widthBetweenTicks * i}
            y={14}
            fontSize={14}
            fontFamily="Arial"
            textAnchor="middle"
          >
            {`${interval}${getAmPm(interval)}`}
          </Text>
        </G>
      ))}
    </G>
  );
};

export default TimeXAxis;
