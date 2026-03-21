import React from 'react';
import { render } from '@testing-library/react-native';
import MoreInfoScreen from '../../screens/InfoModal/screens/MoreInfoScreen';

jest.mock('@react-navigation/native', () => ({
  CommonActions: {
    reset: jest.fn((payload) => payload),
  },
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View>,
  };
});

jest.mock('../../assets/images/yoga-girl.png', () => 1);

jest.mock('../../context/InfoContext', () => ({
  Context: require('react').createContext({
    state: {
      name: '',
      age: 30,
      weight: 150,
      heightFeet: 5,
      heightInches: 10,
      gender: 'male',
      activityLevel: 2,
      bmi: 0,
      bmr: 0,
      tdee: 2000,
      targetProteinPercentage: 0.3,
      targetCarbsPercentage: 0.5,
      targetFatPercentage: 0.2,
    },
    setInfoState: jest.fn(),
  }),
  getInfoWithCalculatedMetrics: jest.fn((state) => ({
    ...state,
    bmi: state.bmi || 21.5,
    bmr: state.bmr || 1700,
    tdee: state.tdee || 2000,
  })),
  storeBasicInfo: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../components/DismissKeyboardView', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children, style }: any) => <View style={style}>{children}</View>;
});

jest.mock('../../components/PercentageSlider', () => () => null);

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  getParent: jest.fn(() => ({ dispatch: jest.fn() })),
};

describe('MoreInfoScreen', () => {
  it('renders without crashing', () => {
    render(<MoreInfoScreen navigation={mockNavigation as any} />);
  });
});
