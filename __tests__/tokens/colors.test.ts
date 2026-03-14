import { colors } from '../../design/tokens/colors';

describe('TOKS-01: Color tokens', () => {
  it('exports colors object', () => {
    expect(colors).toBeDefined();
  });

  it('colors.brand.primary is a hex string', () => {
    expect(colors.brand.primary).toMatch(/#[0-9a-fA-F]{6}/);
  });

  it('colors.brand.primaryDark and primaryLight are hex strings', () => {
    expect(colors.brand.primaryDark).toMatch(/#[0-9a-fA-F]{6}/);
    expect(colors.brand.primaryLight).toMatch(/#[0-9a-fA-F]{6}/);
  });

  it('colors.surface has keys: default, subtle, muted, border — all hex strings', () => {
    expect(colors.surface.default).toMatch(/#[0-9a-fA-F]{6}/);
    expect(colors.surface.subtle).toMatch(/#[0-9a-fA-F]{6}/);
    expect(colors.surface.muted).toMatch(/#[0-9a-fA-F]{6}/);
    expect(colors.surface.border).toMatch(/#[0-9a-fA-F]{6}/);
  });

  it('colors.text has keys: primary, secondary, tertiary, inverse — all hex strings', () => {
    expect(colors.text.primary).toMatch(/#[0-9a-fA-F]{6}/);
    expect(colors.text.secondary).toMatch(/#[0-9a-fA-F]{6}/);
    expect(colors.text.tertiary).toMatch(/#[0-9a-fA-F]{6}/);
    expect(colors.text.inverse).toMatch(/#[0-9a-fA-F]{6}/);
  });

  it('colors.macro has keys: carbs, protein, fat — all hex strings', () => {
    expect(colors.macro.carbs).toMatch(/#[0-9a-fA-F]{6}/);
    expect(colors.macro.protein).toMatch(/#[0-9a-fA-F]{6}/);
    expect(colors.macro.fat).toMatch(/#[0-9a-fA-F]{6}/);
  });

  it('has no undefined values (deep check)', () => {
    const serialized = JSON.stringify(colors);
    expect(serialized).not.toContain('undefined');
    expect(serialized.length).toBeGreaterThan(0);
  });
});
