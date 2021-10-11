import React from 'react';
// @ts-ignore
import { Group, Surface } from '@react-native-community/art';
import { BarGraphData } from './types';
import HorizontalBar from './components/HorizontalBar';
import HorizontalBarTop from './components/HorizontalBarTop';
import HorizontalBarContainer from './components/HorizontalBarContainer';
import Rect from '../Rect';

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
          <Group key={index} x={width * 0.1} y={40}>
            {/* <HorizontalBarContainer label="hi" /> */}

            <Rect
              width={width}
              height={height / 3.3}
              fill="#cccccc"
              stroke="#000000"
              borderRadius={10}
              x={-10}
              // temporary fix until we make Rectangle non-absolute positioning
              y={-25 + (height/data.length) * index}
            />

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
};

export default Bars;
