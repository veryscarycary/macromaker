import React from 'react';
import { StyleSheet } from 'react-native';
import { scaleLinear } from 'd3-scale';
import Svg, { G, Path, Text } from 'react-native-svg';
import { colors } from '../../design/tokens/colors';

const generateGridPoints = (amount: number) => {
  let points: number[] = [];
  Array(amount)
    .fill(null)
    .forEach((_i, index) => {
      let pos = (100 / amount) * index;
      points.push(pos);
    });
  points.shift();
  points.push(100);
  return points;
};

const getScaleTicks = (index: number, gridPoints: number[], width: number, height: number) => {
  const y = scaleLinear().domain([0, 100]).range([0, height - 10]);
  const position = y(gridPoints[index]);
  return `M 0 ${position} l ${width} 0`;
};

const getScalePosition = (index: number, gridPoints: number[], height: number) => {
  const y = scaleLinear().domain([0, 100]).range([-10, height - 20]);
  return y(gridPoints[index]);
};

type Props = {
  width: number;
  height: number;
  isNap?: boolean;
};

const XAxis = ({ width, height }: Props) => {
  const yValues = ['14', '12', '10', '8', '6', '4', '2', '0'];
  const gridPoints = generateGridPoints(yValues.length);

  return (
    <Svg style={styles.xAxis} width={width} height={height}>
      {gridPoints.map((point, index) => (
        <G key={index} x={0} y={-20}>
          <Path
            d={getScaleTicks(index, gridPoints, width, height)}
            fill={colors.text.primary}
            stroke={colors.text.primary}
            strokeWidth={1}
          />
          <G x={10}>
            <Text
              fill={colors.text.secondary}
              x={40}
              y={getScalePosition(index, gridPoints, height)}
              fontSize={14}
              fontFamily="Arial"
              textAnchor="end"
            >
              {yValues[index]}
            </Text>
          </G>
        </G>
      ))}
    </Svg>
  );
};

const styles = StyleSheet.create({
  xAxis: {
    position: 'absolute',
  },
});

export default XAxis;
