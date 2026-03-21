import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop, Line, Text as SvgText, Circle } from 'react-native-svg';
import { area, curveMonotoneX, line } from 'd3-shape';
import { MealTimeData } from './types';
import { colors } from '../../design/tokens/colors';

type Props = {
  data: MealTimeData;
};

const MealTimeGraph = ({ data }: Props) => {
  const screenWidth = Dimensions.get('screen').width;
  const chartWidth = screenWidth - 72;
  const chartHeight = 188;
  const paddingTop = 16;
  const paddingRight = 12;
  const paddingBottom = 32;
  const paddingLeft = 12;
  const width = chartWidth - paddingLeft - paddingRight;
  const height = chartHeight - paddingTop - paddingBottom;
  const maxCalories = Math.max(Math.round(data.tdee), 1);
  const sortedMeals = [...data.meals].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const points = [{ x: 0, y: 0 }, ...sortedMeals.reduce<{ x: number; y: number }[]>((acc, meal) => {
    const previousCalories = acc[acc.length - 1]?.y ?? 0;
    const date = new Date(meal.date);
    const hoursFraction = date.getHours() + date.getMinutes() / 60;
    acc.push({
      x: (hoursFraction / 24) * width,
      y: Math.min(previousCalories + meal.calories, maxCalories),
    });
    return acc;
  }, [])];

  const xTicks = [
    { label: '6a', value: 6 },
    { label: '12p', value: 12 },
    { label: '6p', value: 18 },
    { label: '11p', value: 23 },
  ];
  const yTicks = [0, Math.round(maxCalories / 2), maxCalories];

  const toY = (value: number) => height - (value / maxCalories) * height;
  const toX = (hours: number) => (hours / 24) * width;

  const linePath = line<{ x: number; y: number }>()
    .x((point) => paddingLeft + point.x)
    .y((point) => paddingTop + toY(point.y))
    .curve(curveMonotoneX)(points);

  const areaPath = area<{ x: number; y: number }>()
    .x((point) => paddingLeft + point.x)
    .y0(paddingTop + height)
    .y1((point) => paddingTop + toY(point.y))
    .curve(curveMonotoneX)(points);

  return (
    <View style={styles.main}>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id="mealTimeArea" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.accent.aqua} stopOpacity="0.28" />
            <Stop offset="1" stopColor={colors.accent.aqua} stopOpacity="0.04" />
          </LinearGradient>
        </Defs>

        {yTicks.map((tick, index) => (
          <React.Fragment key={tick}>
            <Line
              x1={paddingLeft}
              x2={paddingLeft + width}
              y1={paddingTop + toY(tick)}
              y2={paddingTop + toY(tick)}
              stroke={index === yTicks.length - 1 ? colors.neutral[300] : colors.neutral[200]}
              strokeDasharray={index === 0 ? '0' : '4 6'}
              strokeWidth={1}
            />
            <SvgText
              x={paddingLeft + width}
              y={paddingTop + toY(tick) - 6}
              fill={colors.text.tertiary}
              fontSize={11}
              fontFamily="Arial"
              textAnchor="end"
            >
              {tick}
            </SvgText>
          </React.Fragment>
        ))}

        {xTicks.map((tick) => (
          <SvgText
            key={tick.label}
            x={paddingLeft + toX(tick.value)}
            y={chartHeight - 8}
            fill={colors.text.tertiary}
            fontSize={11}
            fontFamily="Arial"
            textAnchor="middle"
          >
            {tick.label}
          </SvgText>
        ))}

        {areaPath ? <Path d={areaPath} fill="url(#mealTimeArea)" /> : null}
        {linePath ? (
          <Path
            d={linePath}
            fill="none"
            stroke={colors.accent.teal}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}

        {points.slice(1).map((point, index) => (
          <Circle
            key={`${point.x}-${point.y}-${index}`}
            cx={paddingLeft + point.x}
            cy={paddingTop + toY(point.y)}
            r={4}
            fill={sortedMeals[index]?.color ?? colors.accent.rose}
            stroke={colors.surface.default}
            strokeWidth={2}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
  },
});

export default MealTimeGraph;
