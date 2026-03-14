import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');

describe('FONT-01: Inter TTF files exist', () => {
  const weights = ['Regular', 'Medium', 'SemiBold', 'Bold'];
  weights.forEach(weight => {
    it(`Inter-${weight}.ttf exists in assets/fonts/`, () => {
      const filePath = path.join(ROOT, 'assets', 'fonts', `Inter-${weight}.ttf`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
    it(`Inter-${weight}.ttf is a plausible static TTF (> 200KB)`, () => {
      const filePath = path.join(ROOT, 'assets', 'fonts', `Inter-${weight}.ttf`);
      if (fs.existsSync(filePath)) {
        const sizeBytes = fs.statSync(filePath).size;
        // Static Inter TTF weights are 300-500KB; variable font would be 2MB+
        expect(sizeBytes).toBeGreaterThan(200_000);
        expect(sizeBytes).toBeLessThan(800_000);
      }
    });
  });
});

describe('FONT-02: react-native.config.js is configured', () => {
  it('react-native.config.js exists at project root', () => {
    const configPath = path.join(ROOT, 'react-native.config.js');
    expect(fs.existsSync(configPath)).toBe(true);
  });

  it('react-native.config.js contains assets/fonts path', () => {
    const configPath = path.join(ROOT, 'react-native.config.js');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      expect(content).toContain('./assets/fonts');
    }
  });

  it('react-native.config.js has vector-icons ios:null guard', () => {
    const configPath = path.join(ROOT, 'react-native.config.js');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      expect(content).toContain('react-native-vector-icons');
      expect(content).toContain('ios: null');
    }
  });
});

describe('FONT-04: Info.plist UIAppFonts intact after font linking', () => {
  const infoPlistPath = path.join(ROOT, 'ios', 'macromaker', 'Info.plist');
  const expectedFonts = [
    'Ionicons.ttf',
    'Feather.ttf',
    'FontAwesome.ttf',
    'Inter-Regular.ttf',
    'Inter-Medium.ttf',
    'Inter-SemiBold.ttf',
    'Inter-Bold.ttf',
  ];

  it('Info.plist exists', () => {
    expect(fs.existsSync(infoPlistPath)).toBe(true);
  });

  expectedFonts.forEach(font => {
    it(`Info.plist UIAppFonts contains ${font}`, () => {
      const content = fs.readFileSync(infoPlistPath, 'utf8');
      expect(content).toContain(`<string>${font}</string>`);
    });
  });
});
