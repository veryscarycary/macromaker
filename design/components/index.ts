// design/components/index.ts
// Barrel re-export of all design system components.
// Screens and tests import from here — never from individual component files.

export { Text } from './Text';
export type { TextProps } from './Text';

export { NumericText } from './NumericText';
export type { NumericTextProps } from './NumericText';

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { MacroProgressBar } from './MacroProgressBar';
export type { MacroProgressBarProps } from './MacroProgressBar';
