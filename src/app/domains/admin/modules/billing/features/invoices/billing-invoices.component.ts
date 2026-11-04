import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { BillingPortalService } from '@/app/domains/admin/data/billing-portal';
import { PageShell } from '@/app/domains/admin/layout/ui/page-shell.component';

type InvoiceStatusFilter = 'all' | 'Paid' | 'Pending';

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
  protected query = signal('');
  protected statusFilter = signal<InvoiceStatusFilter>('all');
  protected statusFilters: { value: InvoiceStatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
  ];
  protected visibleInvoices = computed(() => {
    const term = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    if (status === 'all' && !term) {
      return this.data.invoices;
    }
    return this.data.invoices.filter((invoice) => {
      if (status !== 'all' && invoice.status !== status) {
        return false;
      }
      if (!term) {
        return true;
      }
      return [invoice.number, invoice.date, invoice.status].some((value) =>
        value.toLowerCase().includes(term)
      );
    });
  });
  protected resultCount = computed(
    () => `${this.visibleInvoices().length} of ${this.data.invoices.length}`
  );

  protected onQueryInput(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected setStatusFilter(filter: InvoiceStatusFilter) {
    this.statusFilter.set(filter);
  }

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
