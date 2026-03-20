/**
 * NumericText component test scaffold — RED state (Plan 07-01)
 *
 * Implementation contract for Plan 07-02 when creating design/components/NumericText.tsx:
 *   - The underlying RN Text element must have testID="ds-numeric-text"
 *   - NumericText wraps (or extends) Text and always adds fontVariant: ['tabular-nums']
 *   - Props: same as Text (variant, color, style, numberOfLines, children)
 *   - fontVariant: ['tabular-nums'] must be present in the node's style regardless of variant
 *
 * Import path: always the barrel — '../../design/components'
 */

import React from 'react';
import { render } from '@testing-library/react-native';
// This import will fail until Plan 07-02 creates design/components/ barrel — expected RED behavior
import { NumericText } from '../../design/components';

const PRIMARY_COLOR = '#0f172a';
const SECONDARY_COLOR = '#475569';

describe('NumericText', () => {
  it('renders children', () => {
    const { getByText } = render(<NumericText>42</NumericText>);
    expect(getByText('42')).toBeTruthy();
  });

  it('always includes fontVariant tabular-nums in rendered style', () => {
    const { getByTestId } = render(<NumericText>123</NumericText>);
    const node = getByTestId('ds-numeric-text');
    // style may be an array — flatten and check fontVariant
    const flatStyle = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(flatStyle.fontVariant).toEqual(['tabular-nums']);
  });

  it('still includes fontVariant tabular-nums when a custom variant is set', () => {
    const { getByTestId } = render(
      <NumericText variant="display">9999</NumericText>,
    );
    const node = getByTestId('ds-numeric-text');
    const flatStyle = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(flatStyle.fontVariant).toEqual(['tabular-nums']);
  });

  it('variant prop applies typeScale fontFamily (heading → Inter-Bold)', () => {
    const { getByTestId } = render(
      <NumericText variant="heading">88</NumericText>,
    );
    const node = getByTestId('ds-numeric-text');
    const flatStyle = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(flatStyle.fontFamily).toBe('Inter-Bold');
    expect(flatStyle.fontSize).toBe(28);
  });

  it('color prop defaults to colors.text.primary when not supplied', () => {
    const { getByTestId } = render(<NumericText>0</NumericText>);
    const node = getByTestId('ds-numeric-text');
    const flatStyle = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(flatStyle.color).toBe(PRIMARY_COLOR);
  });

  it('color prop is applied when supplied', () => {
    const { getByTestId } = render(
      <NumericText color={SECONDARY_COLOR}>50</NumericText>,
    );
    const node = getByTestId('ds-numeric-text');
    const flatStyle = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(flatStyle.color).toBe(SECONDARY_COLOR);
  });
});
