import { Injectable } from '@angular/core';
import { add, format, sub } from 'date-fns';
import {
  ADDON_CATEGORIES,
  ADDON_MODULES,
  AddonModule,
} from './addon-modules';

export type Addon = AddonModule;

export type Invoice = {
  id: string;
  number: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed';
  amount: number;
  invoiceUrl?: string;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
};

export type UsageMetric = {
  label: string;
  used: number;
  limit: number;
  unit: string;
};

export type UsagePeriod = '1d' | '7d' | '30d' | 'mtd' | 'last-month';

export type UsageEvent = {
  id: string;
  date: Date;
  type: 'Included' | 'On-demand';
  module: string;
  quantity: number;
  quantityLabel: string;
  cost: number | null;
  costLabel: string;
};

export type MonthlySpending = {
  month: string;
  amount: number;
};

@Injectable({ providedIn: 'root' })
export class BillingPortalService {
  private now = new Date();

  readonly stripePortalUrl = 'https://billing.stripe.com/p/login/test';

  getDashboard() {
    return {
      currentPlan: 'Professional',
      nextBillingDate: format(add(this.now, { days: 16 }), 'd MMM yyyy'),
      amountDue: 299,
      paymentStatus: 'Active' as const,
      activeAddons: ADDON_MODULES.filter((m) => m.active).map((m) => m.name),
      monthlySpending: 610,
      propertiesUsed: 12,
      propertiesLimit: 20,
      usersUsed: 28,
      usersLimit: 50,
      summary: [
        {
          title: 'Active Add-ons',
          icon: 'package',
          value: 2,
          change: {
            value: 1,
            unit: '',
            period: 'since last month',
            up: false,
          },
        },
        {
          title: 'Properties',
          icon: 'building-2',
          value: 12,
          change: {
            value: 2,
            unit: '',
            period: 'since last month',
            up: false,
          },
        },
        {
          title: 'Amount Due',
          icon: 'wallet',
          value: 299,
          change: {
            value: 49,
            unit: '',
            period: 'includes add-ons',
            up: false,
          },
        },
        {
          title: 'Monthly Spend',
          icon: 'chart-area',
          value: 610,
          change: {
            value: 30,
            unit: '',
            period: 'vs last month',
            up: false,
          },
        },
      ],
      billingOverview: {
        overview: [
          { label: 'Paid', value: 18 },
          { label: 'Pending', value: 2 },
          { label: 'Failed', value: 1 },
          { label: 'Refunded', value: 3 },
          { label: 'Draft', value: 4 },
          { label: 'Total', value: 28 },
        ],
        chart: this.buildBillingOverviewChart(),
      },
      costDistribution: {
        chart: {
          labels: ['Subscription', 'Add-ons', 'Usage', 'Taxes', 'Credits'],
          series: [49.0, 28.4, 12.5, 8.1, 2.0],
        },
      },
      upcoming: [
        {
          title: 'Subscription renewal',
          date: add(this.now, { days: 16 }),
          time: '12:00 AM',
          location: 'Professional plan',
        },
        {
          title: 'Invoice INV-1002 due',
          date: add(this.now, { days: 3 }),
          time: '11:59 PM',
        },
        {
          title: 'POS add-on billing',
          date: add(this.now, { days: 16 }),
          time: '12:00 AM',
          location: 'Monthly cycle',
        },
        {
          title: 'Usage report available',
          date: add(this.now, { days: 7 }),
          time: '09:00 AM',
        },
        {
          title: 'Payment method review',
          date: add(this.now, { days: 30 }),
          time: '10:00 AM',
          location: 'Visa ending 4242',
        },
      ],
    };
  }

  getSubscription() {
    return {
      plan: 'Professional',
      price: 299,
      interval: 'month',
      description:
        'Full PMS suite for hotels and resorts with core modules included.',
      renewalDate: format(add(this.now, { days: 16 }), 'd MMM yyyy'),
      addonCategories: ADDON_CATEGORIES,
      addons: ADDON_MODULES.map((module) => ({ ...module })),
      usage: [
        { label: 'Properties', used: 12, limit: 20, unit: 'properties' },
        { label: 'Users', used: 28, limit: 50, unit: 'users' },
        { label: 'Reservations', used: 1840, limit: 5000, unit: 'reservations' },
      ] satisfies UsageMetric[],
    };
  }

  getBilling() {
    return {
      paymentMethods: [
        {
          id: 'pm_1',
          brand: 'Visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2028,
          isDefault: true,
        },
      ],
      credits: 50,
      invoices: [
        {
          id: 'inv-1',
          number: 'INV-1001',
          date: format(sub(this.now, { months: 1 }), 'd MMM yyyy'),
          status: 'Paid',
          amount: 299,
          invoiceUrl: '#',
        },
        {
          id: 'inv-2',
          number: 'INV-1002',
          date: format(this.now, 'd MMM yyyy'),
          status: 'Pending',
          amount: 348,
          invoiceUrl: '#',
        },
      ] satisfies Invoice[],
      transactions: [
        {
          id: 'txn-1',
          date: format(sub(this.now, { months: 1 }), 'd MMM yyyy'),
          description: 'Subscription renewal — Professional',
          amount: 299,
          status: 'Succeeded',
        },
        {
          id: 'txn-2',
          date: format(sub(this.now, { months: 1, days: 5 }), 'd MMM yyyy'),
          description: 'Add-on — POS',
          amount: 49,
          status: 'Succeeded',
        },
      ] satisfies Transaction[],
    };
  }

  getReports() {
    return {
      monthlySpending: [
        { month: 'Jan', amount: 500 },
        { month: 'Feb', amount: 620 },
        { month: 'Mar', amount: 610 },
        { month: 'Apr', amount: 580 },
        { month: 'May', amount: 640 },
        { month: 'Jun', amount: 610 },
      ] satisfies MonthlySpending[],
      usageTrend: [
        { label: 'Properties', current: 12, previous: 10 },
        { label: 'Users', current: 28, previous: 24 },
        { label: 'Reservations', current: 1840, previous: 1620 },
      ],
      forecast: {
        nextMonth: 640,
        annualEstimate: 7320,
      },
    };
  }

  getUsage(period: UsagePeriod = '7d') {
    const planLimits = this.getSubscription().usage;
    const { days, label, categories, cumulative, events } =
      this.buildUsagePeriod(period);

    const totalSpend = cumulative[cumulative.length - 1] ?? 0;
    const onDemand = events
      .filter((event) => event.type === 'On-demand')
      .reduce((sum, event) => sum + (event.cost ?? 0), 0);

    return {
      periodLabel: label,
      summary: {
        totalSpend,
        included: totalSpend - onDemand,
        onDemand,
      },
      planLimits,
      chart: {
        categories,
        series: [{ name: 'Included', data: cumulative }],
      },
      events,
      days,
    };
  }

  private buildUsagePeriod(period: UsagePeriod) {
    const dayCount =
      period === '1d'
        ? 1
        : period === '7d'
          ? 7
          : period === '30d'
            ? 30
            : period === 'mtd'
              ? this.now.getDate()
              : 30;

    const end = this.now;
    const start = sub(end, { days: dayCount - 1 });
    const label = `${format(start, 'MMM dd')} – ${format(end, 'MMM dd')}`;

    const dailyIncrements = this.usageIncrements(dayCount);
    const cumulative: number[] = [];
    let running = 0;

    for (const increment of dailyIncrements) {
      running = Math.round((running + increment) * 100) / 100;
      cumulative.push(running);
    }

    const categories = Array.from({ length: dayCount }, (_, index) => {
      const date = sub(end, { days: dayCount - 1 - index });
      return format(date, 'MMM d');
    });

    const events = this.buildUsageEvents(period);

    return { days: dayCount, label, categories, cumulative, events };
  }

  private usageIncrements(dayCount: number) {
    const pattern = [3.8, 5.2, 4.1, 6.4, 3.9, 4.8, 2.85];
    return Array.from({ length: dayCount }, (_, index) => {
      const base = pattern[index % pattern.length];
      const wave = Math.sin(index * 0.9) * 0.6;
      return Math.max(0.5, Math.round((base + wave) * 100) / 100);
    });
  }

  private buildUsageEvents(period: UsagePeriod): UsageEvent[] {
    const modules = ['PMS Core', 'Reservations', 'POS', 'Housekeeping', 'Reports'];
    const count = period === '1d' ? 6 : period === '7d' ? 12 : 18;

    return Array.from({ length: count }, (_, index) => {
      const daysAgo = index % (period === '1d' ? 1 : period === '7d' ? 7 : 14);
      const date = sub(this.now, {
        days: daysAgo,
        hours: (index * 3) % 12,
        minutes: (index * 17) % 60,
      });
      const quantity = 120_000 + index * 86_400 + (index % 3) * 280_000;
      const isOnDemand = index === 2 && period !== '1d';

      return {
        id: `usage-${period}-${index}`,
        date,
        type: isOnDemand ? 'On-demand' : 'Included',
        module: modules[index % modules.length],
        quantity,
        quantityLabel: this.formatCompact(quantity),
        cost: isOnDemand ? 4.5 : null,
        costLabel: isOnDemand ? '$4.50' : 'Included',
      } satisfies UsageEvent;
    });
  }

  private formatCompact(value: number) {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return `${value}`;
  }

  /** Monthly Charges vs Payments for full calendar years (Jan–Dec). */
  private buildBillingOverviewChart() {
    const years = [this.now.getFullYear() - 1, this.now.getFullYear()];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const chargesByYear: Record<number, number[]> = {
      [years[0]]: [
        1980, 11120, 2840, 16450, 5210, 43680, 1920, 13390, 3480, 23810, 1750,
        23240,
      ],
      [years[1]]: [
        12120, 25560, 580, 3420, 46410, 14280, 31290, 13710, 450, 24090, 4080,
        42240,
      ],
    };
    const paymentsByYear: Record<number, number[]> = {
      [years[0]]: [
        2680, 31890, 2910, 22680, 2840, 18520, 12750, 1710, 39380, 1640, 2820,
        8910,
      ],
      [years[1]]: [
        2180, 18920, 35420, 11200, 1680, 37450, 16850, 2100, 38540, 1920, 14280,
        15620,
      ],
    };

    return {
      years,
      months,
      byYear: Object.fromEntries(
        years.map((year) => [
          year,
          {
            charges: chargesByYear[year],
            payments: paymentsByYear[year],
          },
        ]),
      ) as Record<number, { charges: number[]; payments: number[] }>,
    };
  }
}
