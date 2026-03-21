import React from 'react';
import Svg, { G, Rect, Line, Text } from 'react-native-svg';
import { scaleLinear } from 'd3-scale';
import { BarGraphData } from '../../BarGraph/types';
import { colors } from '../../../design/tokens/colors';

const createX = (calories: number, width: number) =>
  scaleLinear().domain([0, calories]).range([0, width]);

type Props = {
  data: BarGraphData[];
  width: number;
  height: number;
  barWidth: number;
  color1: string;
  color2: string;
  color3: string;
  thickness: number;
  x?: number;
  y?: number;
};

const MultipleMacroBarWithContainer = ({
  width,
  height,
  barWidth,
  data,
  color1,
  color2,
  color3,
  thickness,
  x = 0,
  y = 0,
}: Props) => {
  let targetCaloriesLabelXPos: number;
  let getScaleOutput = createX(1, barWidth);

  const targetCalories = Math.round(data.reduce((acc, curr) => acc + curr.targetAmount, 0));
  const currentCalories = Math.round(data.reduce((acc, curr) => acc + curr.amount, 0));
  const hasScaleRange = targetCalories > 0 || currentCalories > 0;
  const scaleMax = targetCalories > 0 ? targetCalories : currentCalories;

  if (!hasScaleRange) {
    targetCaloriesLabelXPos = 10;
  } else {
    getScaleOutput = createX(scaleMax, barWidth);
    targetCaloriesLabelXPos = barWidth + 10;
  }

  const firstLength = Math.min(getScaleOutput(data[0].amount), barWidth);
  const secondLength = Math.min(getScaleOutput(data[1].amount), barWidth - firstLength);
  const thirdLength = Math.min(
    getScaleOutput(data[2].amount),
    barWidth - firstLength - secondLength
  );
  const targetLineX = targetCaloriesLabelXPos - 15;

  return (
    <Svg width={width} height={height}>
      <G x={x} y={y + 10}>
        {/* Container outline */}
        <Rect
          x={0}
          y={0}
          width={barWidth}
          height={thickness}
          stroke={colors.text.primary}
          strokeWidth={3}
          fill="none"
        />
        {/* Macro bars */}
        <Rect
          x={0}
          y={0}
          width={firstLength}
          height={thickness}
          fill={color1}
          stroke={colors.text.primary}
        />
        <Rect
          x={firstLength}
          y={0}
          width={secondLength}
          height={thickness}
          fill={color2}
          stroke={colors.text.primary}
        />
        <Rect
          x={firstLength + secondLength}
          y={0}
          width={thirdLength}
          height={thickness}
          fill={color3}
          stroke={colors.text.primary}
        />
      </G>

      <G x={x} y={y + 45}>
        {hasScaleRange && (
          <Line
            x1={targetLineX}
            y1={-2}
            x2={targetLineX}
            y2={-thickness - 9}
            stroke={colors.macro.fat}
            strokeWidth={5}
          />
        )}
        <Text
          fill={colors.text.secondary}
          x={targetCaloriesLabelXPos}
          y={0}
          fontSize={14}
          fontFamily="Arial"
          textAnchor="end"
        >
          {targetCalories.toString()}
        </Text>
        {currentCalories > targetCalories && targetCalories > 0 && (
          <Text
            fill={colors.status.error}
            x={barWidth + 10}
            y={0}
            fontSize={14}
            fontFamily="Arial"
            textAnchor="end"
          >
            {currentCalories.toString()}
          </Text>
        )}
      </G>
    </Svg>
  );
};

export default MultipleMacroBarWithContainer;
