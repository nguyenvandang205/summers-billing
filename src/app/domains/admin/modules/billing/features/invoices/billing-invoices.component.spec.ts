import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@/app/core/icons/provider';
import BillingInvoices from './billing-invoices.component';

describe('BillingInvoices search', () => {
  let fixture: ComponentFixture<BillingInvoices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingInvoices],
      providers: [provideRouter([]), provideIcons()],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingInvoices);
    await fixture.whenStable();
  });

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function invoiceNumbers(): string[] {
    return [...host().querySelectorAll('tbody tr')].flatMap((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 2) {
        return [];
      }
      const number = cells[0]?.textContent?.trim() ?? '';
      return number.startsWith('INV-') ? [number] : [];
    });
  }

  function displayedDates(): string[] {
    return [...host().querySelectorAll('tbody tr')].flatMap((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 2) {
        return [];
      }
      const date = cells[1]?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      return date ? [date] : [];
    });
  }

  function headerLabels(): string[] {
    return [...host().querySelectorAll('thead th')].map((cell) =>
      (cell.textContent ?? '').replace(/\s+/g, ' ').trim()
    );
  }

  function viewLinks(): HTMLAnchorElement[] {
    return [...host().querySelectorAll('tbody a')].filter(
      (anchor): anchor is HTMLAnchorElement =>
        (anchor.textContent ?? '').includes('View')
    );
  }

  function emptyCell(): HTMLTableCellElement | null {
    return host().querySelector('tbody td[colspan="5"]');
  }

  async function search(value: string): Promise<void> {
    const input = host().querySelector(
      'input[aria-label="Search invoices"]'
    ) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  }

  it('shows both invoices when the query is empty', () => {
    expect(
      host().querySelector('input[aria-label="Search invoices"]')
    ).not.toBeNull();
    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(host().textContent).toContain('Paid');
    expect(host().textContent).toContain('Pending');
    expect(host().textContent).not.toContain('No invoices match');
    expect(emptyCell()).toBeNull();
    expect(headerLabels()).toEqual([
      'Invoice',
      'Date',
      'Status',
      'Amount',
      'Action',
    ]);
    expect(viewLinks()).toHaveLength(2);
  });

  it('shows only INV-1001 when the query is inv-1001', async () => {
    await search('inv-1001');

    expect(invoiceNumbers()).toEqual(['INV-1001']);
    expect(host().textContent).not.toContain('INV-1002');
    expect(host().textContent).not.toContain('No invoices match');
    expect(headerLabels()).toEqual([
      'Invoice',
      'Date',
      'Status',
      'Amount',
      'Action',
    ]);
    expect(viewLinks()).toHaveLength(1);
    expect(viewLinks()[0]?.getAttribute('href')).toBe('#');
  });

  it('shows only INV-1002 when the query is PENDING', async () => {
    await search('PENDING');

    expect(invoiceNumbers()).toEqual(['INV-1002']);
    expect(host().textContent).not.toContain('INV-1001');
    expect(host().textContent).toContain('Pending');
    expect(host().textContent).not.toContain('No invoices match');
  });

  it('shows one empty cell and no invoice numbers for 299', async () => {
    await search('299');

    expect(invoiceNumbers()).toEqual([]);
    expect(host().textContent).not.toContain('INV-1001');
    expect(host().textContent).not.toContain('INV-1002');
    expect(host().querySelectorAll('tbody td[colspan="5"]')).toHaveLength(1);
    expect(emptyCell()?.textContent?.trim()).toBe('No invoices match');
    expect(headerLabels()).toEqual([
      'Invoice',
      'Date',
      'Status',
      'Amount',
      'Action',
    ]);
    expect(viewLinks()).toHaveLength(0);
  });

  it('shows both invoices again for a whitespace-only query', async () => {
    await search('299');
    await search('   ');

    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(host().textContent).not.toContain('No invoices match');
    expect(emptyCell()).toBeNull();
  });

  it('shows both invoices again when the query is cleared', async () => {
    await search('PENDING');
    await search('');

    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(host().textContent).not.toContain('No invoices match');
  });

  it('filters by a fragment of the displayed invoice date', async () => {
    const [firstDate, secondDate] = displayedDates();
    const [firstNumber, secondNumber] = invoiceNumbers();
    const token = firstDate
      .split(/\s+/)
      .find(
        (part) =>
          part.length > 1 && !secondDate.toLowerCase().includes(part.toLowerCase())
      );
    if (!token) {
      throw new Error(
        `No unique date token in "${firstDate}" compared with "${secondDate}"`
      );
    }

    await search(token.toLowerCase());

    expect(invoiceNumbers()).toEqual([firstNumber]);
    expect(host().textContent).not.toContain(secondNumber);
    expect(host().textContent).not.toContain('No invoices match');
  });

  it('does not match invoice amount 348', async () => {
    await search('348');

    expect(invoiceNumbers()).toEqual([]);
    expect(emptyCell()?.textContent?.trim()).toBe('No invoices match');
  });

  it('matches Paid when the query is padded with spaces', async () => {
    await search(' paid ');

    expect(invoiceNumbers()).toEqual(['INV-1001']);
    expect(host().textContent).not.toContain('INV-1002');
  });

  it('matches both invoices for the shared number fragment 100', async () => {
    await search('100');

    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(host().textContent).not.toContain('No invoices match');
  });
});
