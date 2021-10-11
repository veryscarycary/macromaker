import React from 'react';
import { Surface, Group, Text } from '@react-native-community/art';

import { scaleBand } from 'd3-scale';
import moment from 'moment';

const generateValues = () => {
  const data = [];

};

const getValuePosition = (index, values, width) => {
  let x = scaleBand().rangeRound([20, width - 75]);
  x.domain(
    values.map((d) => {
      return d;
    })
  );
  return x(values[index]);
};

type Props = {
  width: number;
  height: number;
};

const YAxis = ({ width, height }: Props) => {
  let axisValues = generateValues();

  return (
    <Surface width={width} height={height}>
      {/* <Group x={69}>
        {axisValues.days.map((item, index) => (
          <Text
            key={index}
            fill="#fff"
            x={getValuePosition(index, axisValues.days, width)}
            y={0}
            font={`12px Arial`}
            alignment="center"
            opacity={index === 6 ? 1 : 0.6}
          >
            {item}
          </Text>
        ))}

        {axisValues.nums.map((item, index) => (
          <Text
            key={index}
            fill="#fff"
            x={getValuePosition(index, axisValues.nums, width)}
            y={15}
            font={`12px Arial`}
            alignment="center"
            opacity={index === 6 ? 1 : 0.6}
          >
            {item}
          </Text>
        ))}
      </Group> */}
    </Surface>
  );
}

export default YAxis;
