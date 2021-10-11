import React from 'react';
// @ts-ignore
import { Group, Surface } from '@react-native-community/art';
import { BarGraphData } from './types';
import HorizontalBar from './components/HorizontalBar';
import HorizontalBarTop from './components/HorizontalBarTop';

type Props = {
  data: BarGraphData[];
  width: number;
  height: number;
  thickness: number;
};

const Bars = ({ data, width, height, thickness }: Props) => {
  return (
    <Surface width={width} height={height}>
      {data.map((item: BarGraphData, index: number) => {
        return (
          <Group key={index} x={60} y={-20}>
            <HorizontalBar
              data={data}
              index={index}
              width={width}
              height={height}
              thickness={thickness}
              color="#353535"
            />

            <HorizontalBarTop
              data={data}
              index={index}
              width={width}
              height={height}
              thickness={thickness}
              color="#FFC77D"
            />
          </Group>
        );
      })}
    </Surface>
  );
}

export default Bars;