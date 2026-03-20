/**
 * Card component test scaffold — RED state (Plan 07-01)
 *
 * Implementation contract for Plan 07-02 when creating design/components/Card.tsx:
 *   - The outer View must have testID="ds-card"
 *   - Props:
 *       children: React.ReactNode
 *       bordered?: boolean  (default: false)
 *   - backgroundColor must be colors.surface.default ('#ffffff') in style
 *   - bordered={false} (default): no borderWidth or borderColor in style
 *   - bordered={true}: style includes borderWidth: 1 and borderColor: colors.surface.border ('#e2e8f0')
 *
 * Import path: always the barrel — '../../design/components'
 */

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
// This import will fail until Plan 07-02 creates design/components/ barrel — expected RED behavior
import { Card } from '../../design/components';

// Token values asserted in tests (from design/tokens/colors.ts)
const SURFACE_DEFAULT = '#ffffff';
const SURFACE_BORDER = '#e2e8f0';

describe('Card', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Card>
        <Text>child content</Text>
      </Card>,
    );
    expect(getByText('child content')).toBeTruthy();
  });

  it('has backgroundColor of colors.surface.default in style', () => {
    const { getByTestId } = render(
      <Card>
        <Text>child</Text>
      </Card>,
    );
    const node = getByTestId('ds-card');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.backgroundColor).toBe(SURFACE_DEFAULT);
  });

  it('bordered={false} (default): no borderWidth or borderColor in style', () => {
    const { getByTestId } = render(
      <Card>
        <Text>child</Text>
      </Card>,
    );
    const node = getByTestId('ds-card');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.borderWidth).toBeUndefined();
    expect(styles.borderColor).toBeUndefined();
  });

  it('bordered={true}: style includes borderWidth 1 and borderColor surface.border', () => {
    const { getByTestId } = render(
      <Card bordered>
        <Text>child</Text>
      </Card>,
    );
    const node = getByTestId('ds-card');
    const styles = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(styles.borderWidth).toBe(1);
    expect(styles.borderColor).toBe(SURFACE_BORDER);
  });
});
