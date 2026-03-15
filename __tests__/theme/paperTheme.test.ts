// __tests__/theme/paperTheme.test.ts
// Structural unit tests for PAPR-01 (color token wiring) and PAPR-02 (font variant coverage)
import fs from 'fs';
import path from 'path';

import { paperTheme } from '../../design/theme/paperTheme';

const THEME_FILE = path.resolve(__dirname, '../../design/theme/paperTheme.ts');

const MD3_TYPESCALE_KEYS = [
  'displayLarge',
  'displayMedium',
  'displaySmall',
  'headlineLarge',
  'headlineMedium',
  'headlineSmall',
  'titleLarge',
  'titleMedium',
  'titleSmall',
  'labelLarge',
  'labelMedium',
  'labelSmall',
  'bodyLarge',
  'bodyMedium',
  'bodySmall',
  'default',
] as const;

describe('PAPR-01: paperTheme color token wiring', () => {
  it('paperTheme.colors.primary equals #7078df', () => {
    expect(paperTheme.colors.primary).toBe('#7078df');
  });

  it('paperTheme.colors.onPrimary equals #ffffff', () => {
    expect(paperTheme.colors.onPrimary).toBe('#ffffff');
  });

  it('paperTheme.colors.secondary equals #475569', () => {
    expect(paperTheme.colors.secondary).toBe('#475569');
  });

  it('paperTheme.colors.surface equals #ffffff', () => {
    expect(paperTheme.colors.surface).toBe('#ffffff');
  });

  it('paperTheme.colors.background equals #ffffff', () => {
    expect(paperTheme.colors.background).toBe('#ffffff');
  });

  it('paperTheme.colors.onSurface equals #0f172a', () => {
    expect(paperTheme.colors.onSurface).toBe('#0f172a');
  });

  it('paperTheme.colors.onSurfaceVariant equals #475569', () => {
    expect(paperTheme.colors.onSurfaceVariant).toBe('#475569');
  });

  it('paperTheme.colors.outline equals #e2e8f0', () => {
    expect(paperTheme.colors.outline).toBe('#e2e8f0');
  });

  it('design/theme/paperTheme.ts exists on disk', () => {
    expect(fs.existsSync(THEME_FILE)).toBe(true);
  });

  it('design/theme/paperTheme.ts contains no raw hex literals', () => {
    const content = fs.readFileSync(THEME_FILE, 'utf8');
    const hexMatches = content.match(/#[0-9a-fA-F]{3,6}\b/g);
    expect(hexMatches).toBeNull();
  });
});

describe('PAPR-02: paperTheme font variant coverage', () => {
  it('all 15 MD3TypescaleKey variants plus default are present in paperTheme.fonts', () => {
    MD3_TYPESCALE_KEYS.forEach(key => {
      expect(paperTheme.fonts).toHaveProperty(key);
    });
  });

  it('every font variant has fontFamily starting with Inter-', () => {
    MD3_TYPESCALE_KEYS.forEach(key => {
      const variant = (paperTheme.fonts as Record<string, { fontFamily: string }>)[key];
      expect(variant.fontFamily).toMatch(/^Inter-/);
    });
  });

  it('every font variant has fontWeight undefined (not a string)', () => {
    MD3_TYPESCALE_KEYS.forEach(key => {
      const variant = (paperTheme.fonts as Record<string, { fontWeight?: unknown }>)[key];
      expect(variant.fontWeight).toBeUndefined();
    });
  });
});
