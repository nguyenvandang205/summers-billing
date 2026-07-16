import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { BillingPortalService } from '@/app/domains/admin/data/billing-portal';
import { PageShell } from '@/app/domains/admin/layout/ui/page-shell.component';

type SpendingRow = {
  id: string;
  date: string;
  status: 'Paid' | 'Pending';
  amount: number;
  change: number | null;
};

const monthIndex: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

@Component({
  selector: 'reports-spending',
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
  templateUrl: './reports-spending.component.html',
})
export default class ReportsSpending {
  private portal = inject(BillingPortalService);
  protected data = this.portal.getReports();

  protected rows: SpendingRow[] = this.buildRows(30);

  private buildRows(count: number): SpendingRow[] {
    const seed = this.data.monthlySpending;
    const months = Object.keys(monthIndex);
    const items: { month: string; year: number; amount: number }[] = [];

    // Seed from portal data, then pad with earlier months for UI scroll demo.
    for (let i = 0; i < count; i++) {
      const offset = count - 1 - i;
      const seedRow = seed[seed.length - 1 - (offset % seed.length)];
      const totalMonth = 5 + seed.length - 1 - offset; // Jun 2025 backwards
      const year = 2025 + Math.floor(totalMonth / 12);
      const month = ((totalMonth % 12) + 12) % 12;
      const wave = ((i * 37) % 90) - 40;
      const amount = Math.max(
        320,
        (seedRow?.amount ?? 580) + wave + (i % 3) * 15,
      );

      items.push({
        month: months[month],
        year,
        amount,
      });
    }

    // Newest first.
    return [...items].reverse().map((row, index, arr) => {
      const older = arr[index + 1];
      const date = new Date(
        row.year,
        monthIndex[row.month] ?? 0,
        28 - (index % 5),
        20 + (index % 4),
        (index * 7) % 60,
      );

      return {
        id: String(784720 - index * 17),
        date: date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        status: index === 0 ? 'Pending' : 'Paid',
        amount: row.amount,
        change: older ? row.amount - older.amount : null,
      };
    });
  }

  statusClass(status: SpendingRow['status']) {
    return status === 'Paid'
      ? 'bg-primary-500 text-white'
      : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200';
  }
}
