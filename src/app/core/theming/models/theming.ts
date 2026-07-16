import { TonalPalette } from '@/app/core/theming/palette';

export type Scheme = 'light' | 'dark' | 'system';
export type Colors = {
  primary: string;
  error: string;
};
export type ThemeConfig = Colors & Record<'scheme', Scheme>;

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  scheme: 'system',
  primary: '#1565C0',
  error: '#dc2626',
};

export type Theme = {
  primary: TonalPalette;
  error: TonalPalette;
};
