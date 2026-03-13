/**
 * StepIndicator test scaffold — RED state (Plan 04-01)
 *
 * Implementation contract for Plan 04-02 when creating
 * screens/InfoModal/components/StepIndicator.tsx:
 *   - Each dot View must have testID="step-dot"
 *   - Each dot View must have accessibilityLabel={i < currentStep ? 'filled' : 'empty'}
 *   - Props: totalSteps: number, currentStep: number (1-indexed)
 */

import React from 'react';
import { render } from '@testing-library/react-native';
// This import will fail until Plan 04-02 creates the component — expected RED behavior
import StepIndicator from '../../screens/InfoModal/components/StepIndicator';

describe('StepIndicator', () => {
  it('renders totalSteps number of dots', () => {
    const { getAllByTestId } = render(
      <StepIndicator totalSteps={3} currentStep={1} />
    );
    expect(getAllByTestId('step-dot')).toHaveLength(3);
  });

  it('marks correct number of dots as filled for step 1 of 3', () => {
    const { getAllByTestId } = render(
      <StepIndicator totalSteps={3} currentStep={1} />
    );
    const dots = getAllByTestId('step-dot');
    expect(dots).toHaveLength(3);
    // dot 0 filled (index 0 < currentStep 1), dots 1 and 2 empty
    expect(dots[0].props.testID).toBe('step-dot');
    // Verify via accessibilityLabel set in component
    expect(dots[0].props.accessibilityLabel).toBe('filled');
    expect(dots[1].props.accessibilityLabel).toBe('empty');
    expect(dots[2].props.accessibilityLabel).toBe('empty');
  });

  it('marks all 3 dots filled for step 3 of 3', () => {
    const { getAllByTestId } = render(
      <StepIndicator totalSteps={3} currentStep={3} />
    );
    const dots = getAllByTestId('step-dot');
    dots.forEach(dot => {
      expect(dot.props.accessibilityLabel).toBe('filled');
    });
  });
});
