import { InjectionToken } from '@angular/core';
import { ThemeConfig } from './models/theming';

export const THEME_CONFIG = new InjectionToken<ThemeConfig>('THEME_CONFIG');
