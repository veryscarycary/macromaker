import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import {
  convertCarbsToCalories,
  convertFatToCalories,
  convertProteinToCalories,
} from '../utils';

const dataConfig = [
  {
    name: 'Carbs',
    percentage: 0,
    color: '#2b4af5',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Protein',
    percentage: 0,
    color: '#bd2020',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Fat',
    percentage: 0,
    color: '#d7dc73',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

// Retrieve initial screen's width
const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

type Props = {
  carbs: number;
  protein: number;
  fat: number;
};

const MacroGraph = (
  {
    carbs = 0,
    protein = 0,
    fat = 0,
    carbsUnit = 'g',
    proteinUnit = 'g',
    fatUnit = 'g',
  },
  props: Props
) => {
  const carbsCalories = convertCarbsToCalories(carbs, carbsUnit);
  const proteinCalories = convertProteinToCalories(protein, proteinUnit);
  const fatCalories = convertFatToCalories(fat, fatUnit);
  const calories = carbsCalories + proteinCalories + fatCalories;
  const carbsPercentage = carbsCalories / calories || 0;
  const proteinPercentage = proteinCalories / calories || 0;
  const fatPercentage = fatCalories / calories || 0;

  const data = dataConfig.map((config) => {
    switch (config.name) {
      case 'Carbs':
        return { ...config, percentage: carbsPercentage };
      case 'Protein':
        return { ...config, percentage: proteinPercentage };
      case 'Fat':
        return { ...config, percentage: fatPercentage };
    }
  });

  return (
    <PieChart
      data={data}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      accessor={'percentage'}
      backgroundColor={'transparent'}
      paddingLeft={'0'}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  list: {
    flex: 1,
    width: '100%',
  },
});

export default MacroGraph;
