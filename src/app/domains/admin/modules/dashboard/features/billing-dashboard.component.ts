import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { Theming } from '@/app/core/theming';
import { BillingPortalService } from '@/app/domains/admin/data/billing-portal';

@Component({
  selector: 'billing-dashboard',
  imports: [
    ChartComponent,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    RouterLink,
  ],
  templateUrl: './billing-dashboard.component.html',
})
export default class BillingDashboard {
  private portal = inject(BillingPortalService);
  private theming = inject(Theming);

  protected data = this.portal.getDashboard();

  protected readonly billingChartYears = this.data.billingOverview.chart.years;

  protected activeBillingYear = signal(
    this.billingChartYears[this.billingChartYears.length - 1],
  );

  protected billingChartSeries = computed<ApexAxisChartSeries>(() => {
    const yearData =
      this.data.billingOverview.chart.byYear[this.activeBillingYear()];
    return [
      { name: 'Charges', data: yearData.charges },
      { name: 'Payments', data: yearData.payments },
    ];
  });

  private formatUsd = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  protected billingChartFill = computed<ApexFill>(() => {
    const isDark = this.theming.isDark();
    const fadeTo = isDark ? '#18181b' : '#ffffff';

    return {
      type: 'gradient',
      gradient: {
        shade: isDark ? 'dark' : 'light',
        type: 'vertical',
        shadeIntensity: isDark ? 0.55 : 0.4,
        gradientToColors: [fadeTo, fadeTo],
        inverseColors: false,
        opacityFrom: isDark ? 0.55 : 0.85,
        opacityTo: isDark ? 0.08 : 0.55,
        stops: [0, 100],
      },
    };
  });

  protected billingChart: {
    chart: ApexChart;
    colors: string[];
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    legend: ApexLegend;
    markers: ApexMarkers;
    states: ApexStates;
    stroke: ApexStroke;
    tooltip: Signal<ApexTooltip>;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
  } = {
    chart: {
      animations: { enabled: false },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: 288,
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['var(--color-cyan-500)', 'var(--color-rose-500)'],
    dataLabels: { enabled: false },
    grid: {
      borderColor:
        'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
      padding: { top: 0, right: 16, bottom: 0, left: 8 },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: { size: 4, shape: 'circle' },
      itemMargin: { horizontal: 10 },
      labels: {
        colors: 'var(--color-neutral-500)',
      },
    },
    markers: {
      size: 0,
      hover: { size: 5 },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
      y: {
        formatter: (value: number) => this.formatUsd(value),
      },
    })),
    xaxis: {
      categories: this.data.billingOverview.chart.months,
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
      tickAmount: 5,
      labels: {
        style: { colors: 'var(--color-neutral-500)' },
        formatter: (value: number) => this.formatUsd(value),
      },
    },
  };

  protected costChart: {
    chart: ApexChart;
    colors: string[];
    fill: ApexFill;
    labels: string[];
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive[];
    series: ApexNonAxisChartSeries;
    stroke: ApexStroke;
    tooltip: Signal<ApexTooltip>;
    yaxis: ApexYAxis;
  } = {
    chart: {
      animations: { enabled: true },
      background: 'transparent',
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'polarArea',
      toolbar: { show: false },
    },
    colors: [
      'var(--color-cyan-500)',
      'var(--color-rose-500)',
      'var(--color-amber-500)',
      'var(--color-violet-500)',
      'var(--color-emerald-500)',
    ],
    fill: {
      opacity: 0.8,
    },
    labels: this.data.costDistribution.chart.labels,
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '12px',
      labels: {
        colors: 'var(--color-neutral-500)',
      },
      markers: { size: 4, shape: 'circle' },
      itemMargin: { horizontal: 8 },
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 1,
          strokeColor:
            'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
        },
        spokes: {
          strokeWidth: 1,
          connectorColors:
            'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    series: this.data.costDistribution.chart.series,
    stroke: {
      colors: ['#fff'],
      width: 2,
    },
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
      y: {
        formatter: (value: string | number) => `${value}%`,
      },
    })),
    yaxis: {
      show: false,
    },
  };

  setBillingYear(year: number) {
    this.activeBillingYear.set(year);
  }

  upcomingLink(title: string) {
    if (title.includes('Invoice')) {
      return '/billing/invoices';
    }
    if (title.includes('Payment')) {
      return '/settings/payment';
    }
    if (title.includes('Usage')) {
      return '/billing/usage';
    }
    return '/billing/plan';
  }
}
