import React from 'react';
import { render } from '@testing-library/react-native';
import WelcomeScreen from '../../screens/InfoModal/screens/WelcomeScreen';

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View>,
  };
});

jest.mock('react-native-vector-icons/Feather', () => 'Feather');

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  getParent: jest.fn(),
};

describe('WelcomeScreen', () => {
  it('renders without crashing', () => {
    render(<WelcomeScreen navigation={mockNavigation as any} />);
  });
});
