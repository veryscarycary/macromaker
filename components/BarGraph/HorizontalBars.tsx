import React from 'react';
import Svg, { G, Text } from 'react-native-svg';
import { BarGraphData } from './types';
import HorizontalBar from './components/HorizontalBar';
import HorizontalBarTop from './components/HorizontalBarTop';
import HorizontalBarContainer from './components/HorizontalBarContainer';
import HorizontalBarWithHook from './components/HorizontalBarWithHook';

type Props = {
  data: BarGraphData[];
  width: number;
  height: number;
  thickness: number;
};

const Bars = ({ data, width, height, thickness }: Props) => {
  return (
    <Svg width={width} height={height}>
      {data.map((item: BarGraphData, index: number) => (
        <G key={index} x={width * 0.1} y={25}>
          <HorizontalBarContainer
            width={width * 0.88}
            height={height / 3.3}
            fill="#d7d7d7"
            stroke="#a0a0a0"
            borderRadius={10}
            x={-10}
            y={-22 + (height / data.length) * index}
          />

          <HorizontalBarWithHook
            data={data}
            index={index}
            width={width * 0.83}
            height={height}
            thickness={4}
            color="#fa8e00"
            hookDirection="bottom"
            y={-10}
          />

          <HorizontalBar
            data={data}
            index={index}
            width={width * 0.83}
            height={height}
            thickness={thickness}
            color={item.color}
          />

          <HorizontalBarTop
            data={data}
            index={index}
            width={width * 0.84}
            height={height}
            thickness={thickness}
            color="#FFC77D"
          />

          <G x={width * 0.1} y={0}>
            <Text
              fontFamily="Helvetica, Arial"
              fontSize={20}
              fontWeight="bold"
              fontStyle="italic"
              fill="#939393"
              textAnchor="start"
              x={-40}
              y={40 + (height / data.length) * index}
            >
              {item.label}
            </Text>
          </G>
        </G>
      ))}
    </Svg>
  );
};

export default Bars;
