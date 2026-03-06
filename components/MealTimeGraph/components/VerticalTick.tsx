import React from 'react';
import D3Rectangle from './D3Rectangle';

type Props = {
  startingXPos: number;
  startingYPos: number;
  color: string;
};

const VerticalTick = ({ startingXPos, startingYPos, color }: Props) => {
  return (
    <D3Rectangle
      startingXPos={startingXPos}
      startingYPos={startingYPos}
      width={2}
      height={5}
      color={color}
    />
  );
};

export default VerticalTick;
