import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';
import { pie as d3pie, arc as d3arc } from 'd3-shape';
import { colors } from '../design/tokens/colors';
import {
  convertCarbsToCalories,
  convertFatToCalories,
  convertProteinToCalories,
} from '../utils';

const PIE_RADIUS = 90;

const MACRO_CONFIG = [
  { name: 'Carbs', color: colors.macro.carbs },
  { name: 'Protein', color: colors.macro.protein },
  { name: 'Fat', color: colors.macro.fat },
];

type Props = {
  carbs?: number;
  protein?: number;
  fat?: number;
  carbsUnit?: string;
  proteinUnit?: string;
  fatUnit?: string;
};

const MacroGraph = ({
  carbs = 0,
  protein = 0,
  fat = 0,
  carbsUnit = 'g',
  proteinUnit = 'g',
  fatUnit = 'g',
}: Props) => {
  const carbsCalories = convertCarbsToCalories(carbs, carbsUnit);
  const proteinCalories = convertProteinToCalories(protein, proteinUnit);
  const fatCalories = convertFatToCalories(fat, fatUnit);
  const totalCalories = carbsCalories + proteinCalories + fatCalories;

  const carbsPercentage = totalCalories > 0 ? carbsCalories / totalCalories : 0;
  const proteinPercentage = totalCalories > 0 ? proteinCalories / totalCalories : 0;
  const fatPercentage = totalCalories > 0 ? fatCalories / totalCalories : 0;

  const pieData = [
    { name: 'Carbs', percentage: carbsPercentage, color: colors.macro.carbs },
    { name: 'Protein', percentage: proteinPercentage, color: colors.macro.protein },
    { name: 'Fat', percentage: fatPercentage, color: colors.macro.fat },
  ];

  const pieGenerator = d3pie<{ name: string; percentage: number; color: string }>()
    .value((d) => d.percentage)
    .sort(null);

  const arcGenerator = d3arc<any>()
    .innerRadius(0)
    .outerRadius(PIE_RADIUS);

  const arcs = pieGenerator(pieData);

  const svgSize = PIE_RADIUS * 2 + 20;
  const center = svgSize / 2;

  return (
    <View style={styles.container}>
      <Svg width={svgSize} height={svgSize}>
        <G transform={`translate(${center}, ${center})`}>
          {totalCalories === 0 ? (
            <>
              <Circle r={PIE_RADIUS} fill={colors.surface.muted} />
              <SvgText
                x={0}
                y={5}
                textAnchor="middle"
                fill={colors.text.tertiary}
                fontSize={14}
              >
                No Data
              </SvgText>
            </>
          ) : (
            arcs.map((arc, index) => {
              const config = pieData[index];
              return (
                <Path
                  key={config.name}
                  d={arcGenerator(arc) || ''}
                  fill={config.color}
                />
              );
            })
          )}
        </G>
      </Svg>
      <View style={styles.legend}>
        {MACRO_CONFIG.map((config, index) => {
          const pct = pieData[index].percentage;
          const pctString = totalCalories > 0 ? `${Math.round(pct * 100)}%` : '0%';
          return (
            <View key={config.name} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: config.color }]} />
              <Text style={styles.legendText}>
                {config.name}: {pctString}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    color: colors.text.tertiary,
    fontSize: 13,
  },
});

export default MacroGraph;
