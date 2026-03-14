import { radius } from '../../design/tokens/radius';

describe('TOKS-04: Radius tokens', () => {
  it('exports exactly 4 keys: xs, sm, md, lg', () => {
    const keys = Object.keys(radius);
    expect(keys).toHaveLength(4);
    expect(keys).toContain('xs');
    expect(keys).toContain('sm');
    expect(keys).toContain('md');
    expect(keys).toContain('lg');
  });

  it('all values are positive numbers', () => {
    for (const value of Object.values(radius)) {
      expect(value).toBeGreaterThan(0);
    }
  });

  it('values follow ascending order (xs < sm < md < lg)', () => {
    const { xs, sm, md, lg } = radius;
    expect(xs).toBeLessThan(sm);
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
  });
});
