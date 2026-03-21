import React from 'react';
import { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../../../design/tokens/colors';

type Props = {
  startingXPos: number;
  startingYPos: number;
  endingXPos: number;
  width: number;
  height: number;
};

const DaytimeGradient = ({ startingXPos, startingYPos, endingXPos, width, height }: Props) => {
  return (
    <>
      <Defs>
        <LinearGradient
          id="daytimeGrad"
          x1={startingXPos}
          y1="0"
          x2={endingXPos}
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor={colors.brand.primaryDark} />
          <Stop offset="0.3" stopColor={colors.surface.default} />
          <Stop offset="0.7" stopColor={colors.surface.default} />
          <Stop offset="1" stopColor={colors.brand.primaryDark} />
        </LinearGradient>
      </Defs>
      <Rect
        x={startingXPos}
        y={startingYPos}
        width={width}
        height={height}
        fill="url(#daytimeGrad)"
      />
    </>
  );
};

export default DaytimeGradient;
