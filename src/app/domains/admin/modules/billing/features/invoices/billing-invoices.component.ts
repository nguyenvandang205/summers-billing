import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { BillingPortalService } from '@/app/domains/admin/data/billing-portal';
import { PageShell } from '@/app/domains/admin/layout/ui/page-shell.component';

@Component({
  selector: 'billing-invoices',
  imports: [
    CurrencyPipe,
    MatCard,
    MatCardHeader,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    PageShell,
    RouterLink,
  ],
  templateUrl: './billing-invoices.component.html',
})
export default class BillingInvoices {
  private portal = inject(BillingPortalService);
  protected data = this.portal.getBilling();

  statusClass(status: string) {
    if (status === 'Paid') {
      return 'bg-primary-500 text-white';
    }
    if (status === 'Failed') {
      return 'bg-red-500 text-white';
    }
    return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';
  }
}
