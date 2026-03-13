/**
 * BasicInfoScreen structural test scaffold — RED state (Plan 04-01)
 *
 * These tests verify structural presence of:
 *   - KeyboardAvoidingView (ONBR-03) — Plan 04-03 will add this
 *   - "lbs" suffix label for weight input (ONBR-04) — Plan 04-03 will add this
 *
 * RED until Plan 04-03 updates BasicInfoScreen.tsx.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import BasicInfoScreen from '../../screens/InfoModal/screens/BasicInfoScreen';

// Mock InfoContext
// Note: jest.mock factory cannot reference out-of-scope variables (including React),
// so we use require('react') inside the factory.
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
      tdee: 0,
      targetProteinPercentage: 0.3,
      targetCarbsPercentage: 0.5,
      targetFatPercentage: 0.2,
    },
    setInfoState: jest.fn(),
    setBasicInfoCalculations: jest.fn(),
  }),
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  getParent: jest.fn(),
};

describe('BasicInfoScreen', () => {
  it('renders a KeyboardAvoidingView', () => {
    const { UNSAFE_getByType } = render(
      <BasicInfoScreen navigation={mockNavigation as any} />
    );
    const { KeyboardAvoidingView } = require('react-native');
    expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeTruthy();
  });

  it('renders "lbs" suffix label for weight input', () => {
    const { getByText } = render(
      <BasicInfoScreen navigation={mockNavigation as any} />
    );
    expect(getByText('lbs')).toBeTruthy();
  });
});
