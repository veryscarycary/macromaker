import React from 'react';
import { Group, Shape, Path, Surface } from '@react-native-community/art';
import { scaleBand, scaleLinear } from 'd3-scale';

export default function Columns({ data, width, height, color }) {
  return (
    <Surface width={width} height={height}>
      {data.map((item, index) => {
        let config = {
          index: index,
          width: width,
          height: height,
          data: data,
          color: color,
          lineWidth: 18,
        };

        return (
          <Group key={index} x={60} y={-20}>
            <ConstructShape
              config={{ ...config, ...{ color: '#353535', type: 'main' } }}
            />
            <ConstructShape
              config={{
                ...config,
                ...{ color: color, type: 'top', lineHeight: 5 },
              }}
            />
          </Group>
        );
      })}
    </Surface>
  );
}

const createX = (width: number) => {
  return scaleBand().rangeRound([20, width - 75]);
};

const createY = (height: number) => {
  return scaleLinear().domain([0, 16]).range([0, height]);
};

function ConstructShape({
  config: { index, width, data, height, color, lineWidth, lineHeight, type },
}) {
  // set X
  let x = createX(width);
  x.domain(
    data.map((d) => {
      return d.column;
    })
  );
  let xPos = x(data[index].column);

  // set Y
  let y = createY(height);
  let barHeight = y(data[index].duration);

  // set starting position from x position
  let moveToY = type == 'top' ? height - barHeight : height;

  if (!lineHeight) {
    lineHeight = -barHeight;
  }

  // Draw path
  let d = new Path()
    .moveTo(xPos, moveToY)
    .line(lineWidth, 0)
    .line(0, lineHeight)
    .line(-lineWidth, 0);

  return <Shape d={d} fill={color} />;
}
