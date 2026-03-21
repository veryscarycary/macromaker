import React from 'react';
import { render } from '@testing-library/react-native';
import AddFoodScreen from '../../screens/AddFood/AddFoodScreen';

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-get-random-values', () => ({}));
jest.mock('uuid', () => ({ v4: jest.fn(() => 'mock-uuid') }));

jest.mock('../../screens/AddFood/components/MacroInput', () => () => null);
jest.mock('../../components/DismissKeyboardView', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children, style }: any) => <View style={style}>{children}</View>;
});

jest.mock('../../context/MealContext', () => ({
  storeMeal: jest.fn(),
  updateMeal: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  getParent: jest.fn(),
  pop: jest.fn(),
};

const mockRoute = {
  key: 'AddFoodScreen-key',
  name: 'AddFoodScreen',
  params: {},
};

describe('AddFoodScreen', () => {
  it('renders without crashing', () => {
    render(
      <AddFoodScreen
        navigation={mockNavigation as any}
        route={mockRoute as any}
      />
    );
  });
});
