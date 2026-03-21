import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import DietTodayScreen from '../../screens/Diet/screens/Today/DietTodayScreen';
import { colors } from '../../design/tokens/colors';

const mockBarGraph = jest.fn(() => null);
const mockTotalCaloriesGraph = jest.fn(() => null);
const mockMealTimeGraph = jest.fn(() => null);

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    require('react').useEffect(callback, [callback]);
  },
}));

jest.mock('../../components/BarGraph', () => (props: unknown) =>
  mockBarGraph(props)
);
jest.mock('../../components/TotalCaloriesGraph', () => (props: unknown) =>
  mockTotalCaloriesGraph(props)
);
jest.mock('../../components/MealTimeGraph', () => (props: unknown) =>
  mockMealTimeGraph(props)
);
jest.mock(
  '../../components/MealTimeGraph/components/D3Rectangle',
  () => 'D3Rectangle'
);
jest.mock('../../components/MealTimeGraph/utils', () => ({
  getMealTimeMealsWithColor: jest.fn(() => []),
}));
jest.mock('../../context/MealContext', () => ({
  getAllMealData: jest.fn(() => Promise.resolve([])),
}));
jest.mock('../../utils', () => {
  const actual = jest.requireActual('../../utils');

  return {
    ...actual,
    getStoredData: jest.fn(() =>
      Promise.resolve({
        tdee: 2000,
        targetProteinPercentage: 0.3,
        targetCarbsPercentage: 0.4,
        targetFatPercentage: 0.3,
      })
    ),
    getTodaysDate: jest.fn(() => '03/20/2026'),
  };
});

describe('DietTodayScreen', () => {
  beforeEach(() => {
    mockBarGraph.mockClear();
    mockTotalCaloriesGraph.mockClear();
    mockMealTimeGraph.mockClear();
  });

  it('passes macro token colors into the graph data array', async () => {
    render(<DietTodayScreen navigation={{} as any} />);

    await waitFor(() => {
      expect(mockBarGraph).toHaveBeenCalled();
      expect(mockTotalCaloriesGraph).toHaveBeenCalled();
    });

    const [{ data }] = mockBarGraph.mock.calls[0];
    expect(data[0].color).toBe(colors.macro.carbs);
    expect(data[1].color).toBe(colors.macro.protein);
    expect(data[2].color).toBe(colors.macro.fat);

    const [{ data: totalCaloriesData }] = mockTotalCaloriesGraph.mock.calls[0];
    expect(totalCaloriesData[0].color).toBe(colors.macro.carbs);
    expect(totalCaloriesData[1].color).toBe(colors.macro.protein);
    expect(totalCaloriesData[2].color).toBe(colors.macro.fat);
  });
});
