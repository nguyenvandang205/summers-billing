import { IsActiveMatchOptions } from '@angular/router';

export type NavigationItem = {
  id: string;
  label: string;
  description?: string;
  route?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  expanded?: boolean;
  activeOptions?: { exact: boolean } | IsActiveMatchOptions;
};

export const NAVIGATION: NavigationItem[] = [
  {
    id: 'portal',
    label: 'Billing Portal',
    description: 'Subscription & payments',
    children: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'layout-dashboard',
        route: '/dashboard',
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: 'credit-card',
        children: [
          { id: 'billing/plan', label: 'Plan', route: '/billing/plan' },
          {
            id: 'billing/addons',
            label: 'Add-ons',
            route: '/billing/addons',
          },
          { id: 'billing/usage', label: 'Usage', route: '/billing/usage' },
          {
            id: 'billing/invoices',
            label: 'Invoices',
            route: '/billing/invoices',
          },
        ],
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: 'chart-area',
        children: [
          {
            id: 'reports/spending',
            label: 'Spending',
            route: '/reports/spending',
          },
          {
            id: 'reports/usage',
            label: 'Usage',
            route: '/reports/usage',
          },
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'settings',
        children: [
          {
            id: 'settings/notifications',
            label: 'Notifications',
            route: '/settings/notifications',
          },
          {
            id: 'settings/security',
            label: 'Security',
            route: '/settings/security',
          },
          {
            id: 'settings/payment',
            label: 'Payment',
            route: '/settings/payment',
          },
        ],
      },
    ],
  },
];
