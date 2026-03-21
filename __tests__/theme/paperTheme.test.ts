// __tests__/theme/paperTheme.test.ts
// Structural unit tests for PAPR-01 (color token wiring) and PAPR-02 (font variant coverage)
import fs from 'fs';
import path from 'path';

import { colors } from '../../design/tokens/colors';
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
  it('paperTheme.colors.primary equals colors.brand.primary', () => {
    expect(paperTheme.colors.primary).toBe(colors.brand.primary);
  });

  it('paperTheme.colors.onPrimary equals colors.text.inverse', () => {
    expect(paperTheme.colors.onPrimary).toBe(colors.text.inverse);
  });

  it('paperTheme.colors.secondary equals colors.accent.teal', () => {
    expect(paperTheme.colors.secondary).toBe(colors.accent.teal);
  });

  it('paperTheme.colors.surface equals colors.surface.default', () => {
    expect(paperTheme.colors.surface).toBe(colors.surface.default);
  });

  it('paperTheme.colors.background equals colors.surface.default', () => {
    expect(paperTheme.colors.background).toBe(colors.surface.default);
  });

  it('paperTheme.colors.onSurface equals colors.text.primary', () => {
    expect(paperTheme.colors.onSurface).toBe(colors.text.primary);
  });

  it('paperTheme.colors.onSurfaceVariant equals colors.text.secondary', () => {
    expect(paperTheme.colors.onSurfaceVariant).toBe(colors.text.secondary);
  });

  it('paperTheme.colors.outline equals colors.surface.border', () => {
    expect(paperTheme.colors.outline).toBe(colors.surface.border);
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
