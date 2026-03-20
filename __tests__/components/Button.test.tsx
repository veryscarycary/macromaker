/**
 * Button component test scaffold — RED state (Plan 07-01)
 *
 * Implementation contract for Plan 07-02 when creating design/components/Button.tsx:
 *   - The outer TouchableOpacity must have testID="ds-button"
 *   - Props:
 *       variant: 'primary' | 'secondary' | 'ghost'
 *       label: string
 *       onPress: () => void
 *       disabled?: boolean  (default: false)
 *   - Render label text inside the TouchableOpacity
 *   - When disabled={true}: apply opacity 0.4 to the TouchableOpacity (check testID="ds-button" style)
 *   - When disabled={true}: do NOT call onPress on press event
 *
 * Import path: always the barrel — '../../design/components'
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
// This import will fail until Plan 07-02 creates design/components/ barrel — expected RED behavior
import { Button } from '../../design/components';

describe('Button', () => {
  it('renders label text for primary variant', () => {
    const { getByText } = render(
      <Button variant="primary" label="Save" onPress={() => {}} />,
    );
    expect(getByText('Save')).toBeTruthy();
  });

  it('renders label text for secondary variant', () => {
    const { getByText } = render(
      <Button variant="secondary" label="Cancel" onPress={() => {}} />,
    );
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('renders label text for ghost variant', () => {
    const { getByText } = render(
      <Button variant="ghost" label="Skip" onPress={() => {}} />,
    );
    expect(getByText('Skip')).toBeTruthy();
  });

  it('calls onPress when pressed and not disabled', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
      <Button variant="primary" label="Go" onPress={handler} />,
    );
    fireEvent.press(getByTestId('ds-button'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onPress when disabled={true}', () => {
    const handler = jest.fn();
    const { getByTestId } = render(
      <Button variant="primary" label="Go" onPress={handler} disabled />,
    );
    fireEvent.press(getByTestId('ds-button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('disabled prop applies opacity 0.4 to outer TouchableOpacity', () => {
    const { getByTestId } = render(
      <Button variant="primary" label="Go" onPress={() => {}} disabled />,
    );
    const node = getByTestId('ds-button');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.opacity).toBe(0.4);
  });
});
