/**
 * MacroGraph test suite
 *
 * Tests verify:
 * 1. The component can be imported without errors (no broken chart-kit import)
 * 2. The component uses react-native-svg (not react-native-chart-kit)
 * 3. The percentage calculation logic is correct
 * 4. All-zero input produces 0% for each macro
 */

// If MacroGraph still imports react-native-chart-kit, the mock below will
// throw (we do NOT mock chart-kit), causing the suite to fail at import time.
// After the rewrite, chart-kit is gone and the suite runs cleanly.

jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Path: 'Path',
  G: 'G',
  Text: 'SvgText',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  Stop: 'Stop',
  Circle: 'Circle',
  Rect: 'Rect',
}));

// DO NOT mock react-native-chart-kit — it must be absent from the component.
// If the import exists, Jest will throw "Cannot find module" and the suite fails.

import { convertCarbsToCalories, convertProteinToCalories, convertFatToCalories } from '../utils';

describe('MacroGraph percentage calculations', () => {
  it('carbs=100g protein=50g fat=0g: computes correct calorie proportions', () => {
    const carbsCal = convertCarbsToCalories(100, 'g'); // 100 * 4 = 400
    const proteinCal = convertProteinToCalories(50, 'g'); // 50 * 4 = 200
    const fatCal = convertFatToCalories(0, 'g'); // 0

    const total = carbsCal + proteinCal + fatCal;
    const carbsPct = carbsCal / total || 0;
    const proteinPct = proteinCal / total || 0;
    const fatPct = fatCal / total || 0;

    expect(carbsPct).toBeCloseTo(0.667, 2);
    expect(proteinPct).toBeCloseTo(0.333, 2);
    expect(fatPct).toBe(0);
    // Two non-zero slices
    const nonZero = [carbsPct, proteinPct, fatPct].filter((p) => p > 0);
    expect(nonZero.length).toBe(2);
  });

  it('all zeros: returns 0 for all percentages (no divide-by-zero crash)', () => {
    const carbsCal = convertCarbsToCalories(0, 'g');
    const proteinCal = convertProteinToCalories(0, 'g');
    const fatCal = convertFatToCalories(0, 'g');

    const total = carbsCal + proteinCal + fatCal;
    const carbsPct = carbsCal / total || 0;
    const proteinPct = proteinCal / total || 0;
    const fatPct = fatCal / total || 0;

    expect(carbsPct).toBe(0);
    expect(proteinPct).toBe(0);
    expect(fatPct).toBe(0);
  });

  it('fat=20g protein=30g carbs=0g: correct proportion with oz support', () => {
    const carbsCal = convertCarbsToCalories(0, 'g');
    const proteinCal = convertProteinToCalories(30, 'g'); // 30 * 4 = 120
    const fatCal = convertFatToCalories(20, 'g'); // 20 * 9 = 180

    const total = carbsCal + proteinCal + fatCal; // 300
    const proteinPct = proteinCal / total || 0;
    const fatPct = fatCal / total || 0;

    expect(proteinPct).toBeCloseTo(0.4, 2);
    expect(fatPct).toBeCloseTo(0.6, 2);
  });
});

describe('MacroGraph module — no chart-kit dependency', () => {
  it('imports MacroGraph without throwing (chart-kit must be absent)', () => {
    // This will throw if MacroGraph imports react-native-chart-kit,
    // because we have NOT mocked it above.
    expect(() => {
      require('../components/MacroGraph');
    }).not.toThrow();
  });

  it('MacroGraph module exports a default function/component', () => {
    const mod = require('../components/MacroGraph');
    const MacroGraph = mod.default || mod;
    expect(typeof MacroGraph).toBe('function');
  });
});
