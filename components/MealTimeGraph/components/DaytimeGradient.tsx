import React from 'react';
import { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

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
          <Stop offset="0" stopColor="#002d8d" />
          <Stop offset="0.3" stopColor="white" />
          <Stop offset="0.7" stopColor="white" />
          <Stop offset="1" stopColor="#002d8d" />
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
