import React from 'react';
import { StyleSheet } from 'react-native';
import { scaleLinear } from 'd3-scale';
import { Surface, Shape, Group, Path, Text } from '@react-native-community/art';

const generateGridPoints = (amount) => {
  let points = [];
  Array(amount)
    .fill()
    .forEach((i, index) => {
      let pos = (100 / amount) * index;
      points.push(pos);
    });
  points.shift();
  points.push(100);

  return points;
};

const getScaleTicks = (index, gridPoints, width, height) => {
  let y = scaleLinear()
    .domain([0, 100])
    .range([0, height - 10]);
  let position = y(gridPoints[index]);
  return new Path().moveTo(0, position).line(width, 0);
};

const getScalePosition = (index, gridPoints, height) => {
  let y = scaleLinear()
    .domain([0, 100])
    .range([-10, height - 20]);
  return y(gridPoints[index]);
};

export default function yAxis({ width, height, isNap }) {
  let yValues = ['14', '12', '10', '8', '6', '4', '2', '0'];
  let gridPoints = generateGridPoints(yValues.length);

  return (
    <Surface style={styles.yAxis} width={width} height={height}>
      {gridPoints.map((point, index) => (
        <Group key={index} x={0} y={-20}>
          <Shape
            d={getScaleTicks(index, gridPoints, width, height)}
            fill="#121212"
            stroke="#121212"
            strokeWidth={1}
          />

          <Group x={10}>
            <Text
              fill="#717171"
              x={40}
              y={getScalePosition(index, gridPoints, height)}
              font={`14px Arial`}
              alignment="right"
            >
              {yValues[index]}
            </Text>
          </Group>
        </Group>
      ))}
    </Surface>
  );
}

const styles = StyleSheet.create({
  yAxis: {
    position: 'absolute',
  },
});
