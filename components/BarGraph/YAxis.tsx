import React from 'react';
import { scaleBand } from 'd3-scale';
import Svg from 'react-native-svg';

const getValuePosition = (index: number, values: string[], width: number) => {
  const x = scaleBand().rangeRound([20, width - 75]);
  x.domain(values);
  return x(values[index]);
};

type Props = {
  width: number;
  height: number;
};

const YAxis = ({ width, height }: Props) => {
  return <Svg width={width} height={height} />;
};

export default YAxis;
