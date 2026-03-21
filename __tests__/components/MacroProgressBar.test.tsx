/**
 * MacroProgressBar component test scaffold — RED state (Plan 07-01)
 *
 * Implementation contract for Plan 07-02 when creating design/components/MacroProgressBar.tsx:
 *
 * Required testIDs:
 *   testID="macro-bar-container"        on outer row View
 *   testID="macro-segment-carbs"        on carbs segment container View
 *   testID="macro-segment-protein"      on protein segment container View
 *   testID="macro-segment-fat"          on fat segment container View
 *   testID="macro-fill-carbs"           on carbs inner fill View
 *   testID="macro-fill-protein"         on protein inner fill View
 *   testID="macro-fill-fat"             on fat inner fill View
 *
 * Props interface:
 *   carbsTarget: number
 *   proteinTarget: number
 *   fatTarget: number
 *   carbsLogged: number
 *   proteinLogged: number
 *   fatLogged: number
 *
 * Zero-target guard: when all three targets are 0, fall back to equal thirds (33.33% each segment width)
 * Overflow cap: when logged > target for a macro, use colors.status.error ('#ef4444') as fill backgroundColor
 * Normal fill: use macro token color (carbs='#60a5fa', protein='#a78bfa', fat='#fbbf24')
 * No hardcoded hex literals allowed in source file — import all colors from design/tokens
 *
 * Import path: always the barrel — '../../design/components'
 */

import fs from 'fs';
import path from 'path';
import React from 'react';
import { render } from '@testing-library/react-native';
import { colors } from '../../design/tokens/colors';
// This import will fail until Plan 07-02 creates design/components/ barrel — expected RED behavior
import { MacroProgressBar } from '../../design/components';

const CARBS_COLOR = colors.macro.carbs;
const ERROR_COLOR = colors.status.error;

describe('MacroProgressBar', () => {
  it('renders without crash when all targets are 0 (zero-target guard, equal thirds fallback)', () => {
    expect(() =>
      render(
        <MacroProgressBar
          carbsTarget={0}
          proteinTarget={0}
          fatTarget={0}
          carbsLogged={0}
          proteinLogged={0}
          fatLogged={0}
        />,
      ),
    ).not.toThrow();
  });

  it('renders without crash with valid targets and logged values', () => {
    expect(() =>
      render(
        <MacroProgressBar
          carbsTarget={130}
          proteinTarget={120}
          fatTarget={60}
          carbsLogged={65}
          proteinLogged={120}
          fatLogged={80}
        />,
      ),
    ).not.toThrow();
  });

  it('fill view for carbs within target uses colors.macro.carbs as backgroundColor', () => {
    const { getByTestId } = render(
      <MacroProgressBar
        carbsTarget={130}
        proteinTarget={120}
        fatTarget={60}
        carbsLogged={65}
        proteinLogged={60}
        fatLogged={30}
      />,
    );
    const fillNode = getByTestId('macro-fill-carbs');
    const styles = Array.isArray(fillNode.props.style)
      ? Object.assign({}, ...fillNode.props.style.filter(Boolean))
      : fillNode.props.style;
    expect(styles.backgroundColor).toBe(CARBS_COLOR);
  });

  it('fill view for macro with logged > target uses colors.status.error as backgroundColor (overflow)', () => {
    // fatLogged=100 > fatTarget=60 — overflow
    const { getByTestId } = render(
      <MacroProgressBar
        carbsTarget={130}
        proteinTarget={120}
        fatTarget={60}
        carbsLogged={65}
        proteinLogged={60}
        fatLogged={100}
      />,
    );
    const fillNode = getByTestId('macro-fill-fat');
    const styles = Array.isArray(fillNode.props.style)
      ? Object.assign({}, ...fillNode.props.style.filter(Boolean))
      : fillNode.props.style;
    expect(styles.backgroundColor).toBe(ERROR_COLOR);
  });

  it('has no hardcoded hex literals in MacroProgressBar source file', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '../../design/components/MacroProgressBar.tsx'),
      'utf-8',
    );
    expect(src).not.toMatch(/#[0-9a-fA-F]{3,6}/);
  });
});
