import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BillingPortalService } from '@/app/domains/admin/data/billing-portal';
import { PageShell } from '@/app/domains/admin/layout/ui/page-shell.component';

type PlanMetric = {
  title: string;
  icon: string;
  value: string | number;
  currency?: boolean;
  change: {
    value: string;
    period: string;
    up: boolean;
  };
};

@Component({
  selector: 'billing-plan',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    MatButton,
    MatCard,
    MatIcon,
    PageShell,
    RouterLink,
  ],
  templateUrl: './billing-plan.component.html',
})
export default class BillingPlan {
  private portal = inject(BillingPortalService);
  protected data = this.portal.getSubscription();

  protected metrics: PlanMetric[] = [
    {
      title: 'Monthly price',
      icon: 'wallet',
      value: this.data.price,
      currency: true,
      change: {
        value: '+$49',
        period: 'includes add-ons',
        up: true,
      },
    },
    {
      title: 'Properties',
      icon: 'building-2',
      value: this.data.usage[0].used,
      change: {
        value: '+2',
        period: 'since last month',
        up: true,
      },
    },
    {
      title: 'Users',
      icon: 'users',
      value: this.data.usage[1].used,
      change: {
        value: '+4',
        period: 'since last month',
        up: true,
      },
    },
    {
      title: 'Reservations',
      icon: 'calendar-check',
      value: this.data.usage[2].used,
      change: {
        value: '+12.4%',
        period: 'since last month',
        up: true,
      },
    },
  ];
}
