import { fontFamilies, typeScale } from '../../design/tokens/typography';

describe('TOKS-02: Typography tokens', () => {
  describe('fontFamilies', () => {
    it('exports keys: regular, medium, semiBold, bold', () => {
      expect(fontFamilies).toHaveProperty('regular');
      expect(fontFamilies).toHaveProperty('medium');
      expect(fontFamilies).toHaveProperty('semiBold');
      expect(fontFamilies).toHaveProperty('bold');
    });

    it('each fontFamily value is a non-empty string', () => {
      expect(typeof fontFamilies.regular).toBe('string');
      expect(fontFamilies.regular.length).toBeGreaterThan(0);
      expect(typeof fontFamilies.medium).toBe('string');
      expect(fontFamilies.medium.length).toBeGreaterThan(0);
      expect(typeof fontFamilies.semiBold).toBe('string');
      expect(fontFamilies.semiBold.length).toBeGreaterThan(0);
      expect(typeof fontFamilies.bold).toBe('string');
      expect(fontFamilies.bold.length).toBeGreaterThan(0);
    });
  });

  describe('typeScale', () => {
    it('exports exactly 9 keys: display, heading, subheading, body, bodyMedium, bodySmall, caption, label, overline', () => {
      const keys = Object.keys(typeScale);
      expect(keys).toHaveLength(9);
      expect(keys).toContain('display');
      expect(keys).toContain('heading');
      expect(keys).toContain('subheading');
      expect(keys).toContain('body');
      expect(keys).toContain('bodyMedium');
      expect(keys).toContain('bodySmall');
      expect(keys).toContain('caption');
      expect(keys).toContain('label');
      expect(keys).toContain('overline');
    });

    it('each typeScale entry has fontFamily (string), fontSize (positive number), lineHeight (positive number)', () => {
      for (const [key, entry] of Object.entries(typeScale)) {
        expect(typeof entry.fontFamily).toBe('string');
        expect(entry.fontSize).toBeGreaterThan(0);
        expect(entry.lineHeight).toBeGreaterThan(0);
      }
    });

    it('typeScale.overline has textTransform equal to uppercase', () => {
      expect(typeScale.overline.textTransform).toBe('uppercase');
    });

    it('typeScale.overline has letterSpacing that is a positive number', () => {
      expect(typeScale.overline.letterSpacing).toBeGreaterThan(0);
    });
  });
});
