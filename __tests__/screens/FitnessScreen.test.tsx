import React from 'react';
import { render } from '@testing-library/react-native';
import FitnessScreen from '../../screens/FitnessScreen';

describe('FitnessScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<FitnessScreen />);
    expect(getByText('Fitness')).toBeTruthy();
  });
});
