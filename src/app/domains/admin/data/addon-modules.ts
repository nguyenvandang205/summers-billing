export type AddonCategory = {
  id: string;
  label: string;
  description: string;
};

export type AddonModule = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  active: boolean;
  features: string[];
};

export const ADDON_CATEGORIES: AddonCategory[] = [
  {
    id: 'operations',
    label: 'Operations',
    description: 'Front office and daily property operations.',
  },
  {
    id: 'staff',
    label: 'Staff & POS',
    description: 'Team workflows and point-of-sale outlets.',
  },
  {
    id: 'commercial',
    label: 'Commercial',
    description: 'Sales, marketing, and direct booking tools.',
  },
  {
    id: 'finance',
    label: 'Finance',
    description: 'Accounting, reporting, and ledger modules.',
  },
  {
    id: 'management',
    label: 'Management',
    description: 'Planning, assets, and vendor management.',
  },
];

export const ADDON_MODULES: AddonModule[] = [
  {
    id: 'front-desk',
    categoryId: 'operations',
    name: 'Front Desk',
    description:
      'Reservations, calendar, guest folio, rooms register, and front office tools.',
    icon: 'door-open',
    price: 79,
    active: true,
    features: [
      'Dashboard',
      'Reservations',
      'Calendar',
      'Guest Folio',
      'Activity Scheduler',
      'Rooms Register',
      'Website Notification Settings',
    ],
  },
  {
    id: 'staff-ops',
    categoryId: 'staff',
    name: 'Staff Ops',
    description:
      'Staff notice board, housekeeping, maintenance, and HR scheduling.',
    icon: 'users',
    price: 59,
    active: true,
    features: [
      'Staff Notice Board',
      'Housekeeping',
      'Maintenance',
      'HR Roster',
      'HR Scheduler',
    ],
  },
  {
    id: 'pos-center',
    categoryId: 'staff',
    name: 'POS Center',
    description:
      'Restaurant POS, front desk POS, activities, and outlet management.',
    icon: 'shopping-cart',
    price: 99,
    active: true,
    features: [
      'Restaurant POS',
      'Front Desk POS',
      'Front Desk Activities',
      'Excursions & Transfers',
      'Outlet Manager',
    ],
  },
  {
    id: 'sales-marketing',
    categoryId: 'commercial',
    name: 'Sales & Marketing',
    description:
      'Sales outreach, agent and guest databases, promotions, and marketing assets.',
    icon: 'megaphone',
    price: 69,
    active: false,
    features: [
      'Sales Outreach',
      'Sales Calendar',
      'Agents Database',
      'Guests Database',
      'Promotions',
      'Marketing Resources',
    ],
  },
  {
    id: 'direct-organizer',
    categoryId: 'commercial',
    name: 'Direct Organizer',
    description:
      'Booking engine settings, customization, special offers, and contact resources.',
    icon: 'globe',
    price: 49,
    active: false,
    features: [
      'Booking Engine Settings',
      'Booking Engine Customize',
      'Special Offers',
      'Information Resources',
      'Contact Us Settings',
    ],
  },
  {
    id: 'ota-optimizer',
    categoryId: 'commercial',
    name: 'OTA Optimizer',
    description: 'Optimize rates and availability across OTA channels.',
    icon: 'chart-line',
    price: 79,
    active: false,
    features: ['OTA Calendar', 'Channel optimization'],
  },
  {
    id: 'finance-reporting',
    categoryId: 'finance',
    name: 'Finance & Reporting',
    description:
      'Payment registers, journals, forecast wizard, and business reports.',
    icon: 'file-chart-column',
    price: 89,
    active: false,
    features: [
      'Payment Register',
      'Expense Journal',
      'Service Charge Register',
      'Financing Journal',
      'Forecast Wizard',
      'Sales Reports',
      'Business Reports',
      'Other Reports',
    ],
  },
  {
    id: 'city-ledger',
    categoryId: 'finance',
    name: 'City Ledger',
    description:
      'A/R register, unit owners, residents folio, and invoice generator.',
    icon: 'building-2',
    price: 49,
    active: false,
    features: [
      'A/R Register',
      'Unit Owners Folio',
      'Unit Owners Ops Report',
      'Residents Folio',
      'Invoice Generator',
    ],
  },
  {
    id: 'manager',
    categoryId: 'management',
    name: 'Manager',
    description:
      'Events, tasks, business planning, fixed assets, and vendor management.',
    icon: 'briefcase',
    price: 59,
    active: false,
    features: [
      'Events Calendar',
      'Task Manager',
      'Business Planner',
      'Fixed Assets Database',
      'Asset Owners',
      'Suppliers',
      'Vendors',
    ],
  },
];
