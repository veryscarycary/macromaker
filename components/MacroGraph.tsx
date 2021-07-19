import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const data = [
  {
    name: 'Carbs',
    something: 50,
    color: '#2b4af5',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Protein',
    something: 30,
    color: '#bd2020',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Fat',
    something: 20,
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

const MacroGraph = () => {
  return (
    <PieChart
      data={data}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      accessor={'something'}
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
