import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { Theming } from '@/app/core/theming';
import {
  BillingPortalService,
  UsagePeriod,
} from '@/app/domains/admin/data/billing-portal';

type UsageMetricGroup = 'module' | 'type';
type UsageMetricView = 'spend' | 'events';

@Component({
  selector: 'billing-usage',
  imports: [
    ChartComponent,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    MatButton,
    MatCard,
    MatCardHeader,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './billing-usage.component.html',
})
export default class BillingUsage {
  private portal = inject(BillingPortalService);
  private theming = inject(Theming);

  protected readonly periods: { id: UsagePeriod; label: string }[] = [
    { id: '1d', label: '1d' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: 'mtd', label: 'MTD' },
    { id: 'last-month', label: 'Last month' },
  ];

  protected activePeriod = signal<UsagePeriod>('7d');
  protected groupBy = signal<UsageMetricGroup>('module');
  protected metric = signal<UsageMetricView>('spend');

  protected data = computed(() =>
    this.portal.getUsage(this.activePeriod()),
  );

  protected usageChartSeries = computed<ApexAxisChartSeries>(() => [
    {
      name: 'Included',
      data: this.data().chart.series[0].data,
    },
  ]);

  protected usageChartCategories = computed(
    () => this.data().chart.categories,
  );

  protected usageChartXaxis = computed(() => ({
    ...this.usageChart.xaxis,
    categories: this.usageChartCategories(),
  }));

  private formatUsd = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);

  protected usageChart: {
    chart: ApexChart;
    colors: string[];
    dataLabels: ApexDataLabels;
    fill: ApexFill;
    grid: ApexGrid;
    legend: ApexLegend;
    markers: ApexMarkers;
    stroke: ApexStroke;
    tooltip: Signal<ApexTooltip>;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
  } = {
    chart: {
      animations: { enabled: false },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: 280,
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#22984F'],
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.35,
        gradientToColors: ['#0f1117'],
        inverseColors: false,
        opacityFrom: 0.75,
        opacityTo: 0.08,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor:
        'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
      padding: { top: 8, right: 16, bottom: 0, left: 8 },
      strokeDashArray: 4,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: { size: 4, shape: 'circle' },
      labels: { colors: 'var(--color-neutral-500)' },
    },
    markers: { size: 0, hover: { size: 4 } },
    stroke: { curve: 'smooth', width: 2 },
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
      y: {
        formatter: (value: number) => this.formatUsd(value),
      },
    })),
    xaxis: {
      axisBorder: {
        color: 'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
      },
      axisTicks: {
        color: 'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
      },
      labels: {
        style: { colors: 'var(--color-neutral-500)' },
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        style: { colors: 'var(--color-neutral-500)' },
        formatter: (value: number) => this.formatUsd(value),
      },
    },
  };

  setPeriod(period: UsagePeriod) {
    this.activePeriod.set(period);
  }

  setGroupBy(group: UsageMetricGroup) {
    this.groupBy.set(group);
  }

  setMetric(metric: UsageMetricView) {
    this.metric.set(metric);
  }

  usagePercent(used: number, limit: number) {
    return Math.min(100, Math.round((used / limit) * 100));
  }

  typeClass(type: string) {
    return type === 'Included'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
  }

  exportCsv() {
    const rows = [
      ['Date (UTC)', 'Type', 'Module', 'Quantity', 'Cost'],
      ...this.data().events.map((event) => [
        event.date.toISOString(),
        event.type,
        event.module,
        event.quantityLabel,
        event.costLabel,
      ]),
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usage-${this.activePeriod()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
