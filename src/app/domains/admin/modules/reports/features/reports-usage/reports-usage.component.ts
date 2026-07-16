import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { BillingPortalService } from '@/app/domains/admin/data/billing-portal';
import { PageShell } from '@/app/domains/admin/layout/ui/page-shell.component';

type UsageMetric = {
  title: string;
  icon: string;
  value: number;
  change: {
    value: string;
    period: string;
    up: boolean;
  };
};

const usageIcons: Record<string, string> = {
  Properties: 'building-2',
  Users: 'users',
  Reservations: 'calendar-check',
};

@Component({
  selector: 'reports-usage',
  imports: [DecimalPipe, MatCard, MatIcon, PageShell],
  templateUrl: './reports-usage.component.html',
})
export default class ReportsUsage {
  private portal = inject(BillingPortalService);
  protected data = this.portal.getReports();

  protected metrics: UsageMetric[] = this.data.usageTrend.map((item) => {
    const delta = item.current - item.previous;
    const up = delta >= 0;
    const pct =
      item.previous === 0
        ? 100
        : Math.round((Math.abs(delta) / item.previous) * 1000) / 10;

    return {
      title: item.label,
      icon: usageIcons[item.label] ?? 'chart-column',
      value: item.current,
      change: {
        value: `${up ? '+' : '-'}${pct}%`,
        period: `prev ${item.previous.toLocaleString('en-US')}`,
        up,
      },
    };
  });
}
