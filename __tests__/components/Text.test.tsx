/**
 * Text component test scaffold — RED state (Plan 07-01)
 *
 * Implementation contract for Plan 07-02 when creating design/components/Text.tsx:
 *   - The underlying RN Text element must have testID="ds-text"
 *   - Props:
 *       variant?: TypeScaleKey  (default: 'body')
 *       color?: string          (default: colors.text.primary = '#0f172a')
 *       style?: StyleProp<TextStyle>
 *       numberOfLines?: number
 *       children: React.ReactNode
 *   - Apply typeScale[variant] styles (fontFamily, fontSize, lineHeight) to the RN Text
 *   - Spread caller's style prop last so it can override defaults
 *   - Pass numberOfLines through to the underlying RN Text element
 *
 * Import path: always the barrel — '../../design/components'
 */

import React from 'react';
import { render } from '@testing-library/react-native';
// This import will fail until Plan 07-02 creates design/components/ barrel — expected RED behavior
import { Text } from '../../design/components';

// Token values asserted in tests (copied from design/tokens/colors.ts and typography.ts)
const PRIMARY_COLOR = '#0f172a';
const SECONDARY_COLOR = '#475569';

describe('Text', () => {
  it('renders children with default body variant', () => {
    const { getByText } = render(<Text>Hello</Text>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('applies correct fontFamily and fontSize for "display" variant', () => {
    const { getByTestId } = render(<Text variant="display">Display</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.fontFamily).toBe('Inter-Bold');
    expect(styles.fontSize).toBe(34);
  });

  it('applies correct fontFamily and fontSize for "heading" variant', () => {
    const { getByTestId } = render(<Text variant="heading">Heading</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.fontFamily).toBe('Inter-Bold');
    expect(styles.fontSize).toBe(28);
  });

  it('applies correct fontFamily and fontSize for "subheading" variant', () => {
    const { getByTestId } = render(<Text variant="subheading">Sub</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.fontFamily).toBe('Inter-SemiBold');
    expect(styles.fontSize).toBe(22);
  });

  it('applies correct fontFamily and fontSize for "body" variant', () => {
    const { getByTestId } = render(<Text variant="body">Body</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.fontFamily).toBe('Inter-Regular');
    expect(styles.fontSize).toBe(16);
  });

  it('applies correct fontFamily and fontSize for "bodyMedium" variant', () => {
    const { getByTestId } = render(<Text variant="bodyMedium">BodyMed</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.fontFamily).toBe('Inter-Medium');
    expect(styles.fontSize).toBe(16);
  });

  it('applies correct fontFamily and fontSize for "bodySmall" variant', () => {
    const { getByTestId } = render(<Text variant="bodySmall">SmallBody</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.fontFamily).toBe('Inter-Regular');
    expect(styles.fontSize).toBe(14);
  });

  it('applies correct fontFamily and fontSize for "caption" variant', () => {
    const { getByTestId } = render(<Text variant="caption">Caption</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.fontFamily).toBe('Inter-Regular');
    expect(styles.fontSize).toBe(12);
  });

  it('applies correct fontFamily and fontSize for "label" variant', () => {
    const { getByTestId } = render(<Text variant="label">Label</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.fontFamily).toBe('Inter-Medium');
    expect(styles.fontSize).toBe(12);
  });

  it('applies correct fontFamily and fontSize for "overline" variant', () => {
    const { getByTestId } = render(<Text variant="overline">OVERLINE</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.fontFamily).toBe('Inter-Medium');
    expect(styles.fontSize).toBe(10);
  });

  it('color prop defaults to colors.text.primary when not supplied', () => {
    const { getByTestId } = render(<Text>Default color</Text>);
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.color).toBe(PRIMARY_COLOR);
  });

  it('applies supplied color prop', () => {
    const { getByTestId } = render(
      <Text color={SECONDARY_COLOR}>Colored</Text>,
    );
    const node = getByTestId('ds-text');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.color).toBe(SECONDARY_COLOR);
  });

  it('style prop is spread last — caller can override textAlign', () => {
    const { getByTestId } = render(
      <Text style={{ textAlign: 'right' }}>Overridden</Text>,
    );
    const node = getByTestId('ds-text');
    // style may be an array; flatten to check that caller's textAlign wins
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.textAlign).toBe('right');
  });

  it('passes numberOfLines prop through to the underlying RN Text', () => {
    const { getByTestId } = render(<Text numberOfLines={2}>Truncated</Text>);
    const node = getByTestId('ds-text');
    expect(node.props.numberOfLines).toBe(2);
  });
});
