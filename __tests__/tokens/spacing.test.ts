import { spacing } from '../../design/tokens/spacing';

describe('TOKS-03: Spacing tokens', () => {
  it('exports exactly 8 keys: xs, sm, md, lg, xl, 2xl, 3xl, 4xl', () => {
    const keys = Object.keys(spacing);
    expect(keys).toHaveLength(8);
    expect(keys).toContain('xs');
    expect(keys).toContain('sm');
    expect(keys).toContain('md');
    expect(keys).toContain('lg');
    expect(keys).toContain('xl');
    expect(keys).toContain('2xl');
    expect(keys).toContain('3xl');
    expect(keys).toContain('4xl');
  });

  it('values are 4, 8, 12, 16, 24, 32, 48, 64 in that order', () => {
    expect(Object.values(spacing)).toEqual([4, 8, 12, 16, 24, 32, 48, 64]);
  });

  it('all values are positive numbers', () => {
    for (const value of Object.values(spacing)) {
      expect(value).toBeGreaterThan(0);
    }
  });
});
