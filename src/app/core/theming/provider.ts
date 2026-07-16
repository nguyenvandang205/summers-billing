import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  Provider,
  provideAppInitializer,
} from '@angular/core';
import { ThemeConfig, DEFAULT_THEME_CONFIG } from './models/theming';
import { Theming } from './theming';
import { THEME_CONFIG } from './theme-config.token';

export { DEFAULT_THEME_CONFIG };
export { THEME_CONFIG } from './theme-config.token';

export const provideThemeConfig = (config: ThemeConfig): Provider => ({
  provide: THEME_CONFIG,
  useValue: config,
});

export const provideTheming = (config: ThemeConfig): EnvironmentProviders =>
  makeEnvironmentProviders([
    provideThemeConfig(config),
    provideAppInitializer(() => {
      inject(Theming);
    }),
  ]);
