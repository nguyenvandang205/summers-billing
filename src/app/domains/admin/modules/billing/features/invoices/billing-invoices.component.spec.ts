import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@/app/core/icons/provider';
import BillingInvoices from './billing-invoices.component';

describe('BillingInvoices search result count and status chips', () => {
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

  function tableStatuses(): string[] {
    return [...host().querySelectorAll('tbody tr')].flatMap((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) {
        return [];
      }
      const status = cells[2]?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      return status ? [status] : [];
    });
  }

  function statusGroup(): HTMLElement {
    const group = host().querySelector(
      '[role="group"][aria-label="Invoice status"]'
    );
    expect(group).toBeInstanceOf(HTMLElement);
    return group as HTMLElement;
  }

  function statusChips(): HTMLButtonElement[] {
    return [...statusGroup().querySelectorAll(':scope > button')].filter(
      (button): button is HTMLButtonElement =>
        button instanceof HTMLButtonElement
    );
  }

  function chip(label: string): HTMLButtonElement {
    const button = statusChips().find(
      (item) => (item.textContent ?? '').trim() === label
    );
    expect(button).toBeTruthy();
    return button as HTMLButtonElement;
  }

  function pressedChipLabels(): string[] {
    return statusChips()
      .filter((button) => button.getAttribute('aria-pressed') === 'true')
      .map((button) => (button.textContent ?? '').trim());
  }

  function searchInput(): HTMLInputElement {
    const input = host().querySelector(
      'input[aria-label="Search invoices"]'
    ) as HTMLInputElement | null;
    expect(input).not.toBeNull();
    return input as HTMLInputElement;
  }

  function resultCountEl(): HTMLElement {
    const input = searchInput();
    const count = input.nextElementSibling;
    expect(count).toBeInstanceOf(HTMLElement);
    expect(count?.parentElement).toBe(input.parentElement);
    return count as HTMLElement;
  }

  function expectResultCount(expected: string): void {
    const input = searchInput();
    const count = resultCountEl();
    const row = input.parentElement;

    expect(row).not.toBeNull();
    expect(row?.className).toContain('mt-4');
    expect(row?.className).toContain('flex');
    expect(row?.className).toContain('items-center');
    expect(row?.className).toContain('gap-3');
    expect(input.className).toContain('min-w-0');
    expect(input.className).toContain('flex-1');
    expect(input.className).not.toContain('mt-4');
    expect(count.className).toContain('shrink-0');
    expect(count.className).toContain('whitespace-nowrap');
    expect(count.textContent).toBe(expected);
    expect(count.closest('table')).toBeNull();
    expect(count.closest('thead')).toBeNull();
    expect(count.closest('mat-card-header')).toBeNull();
    expect(count.closest('mat-menu')).toBeNull();
    expect(expected).toMatch(/^\d+ of \d+$/);
  }

  async function search(value: string): Promise<void> {
    const input = host().querySelector(
      'input[aria-label="Search invoices"]'
    ) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  }

  async function pressChip(label: string): Promise<void> {
    chip(label).click();
    await fixture.whenStable();
  }

  function expectChipState(label: string, selected: boolean): void {
    const button = chip(label);
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-pressed')).toBe(
      selected ? 'true' : 'false'
    );
    expect(button.className).toContain('rounded-full');
    if (selected) {
      expect(button.className).toContain('bg-primary-600');
      expect(button.className).toContain('text-white');
    } else {
      expect(button.className).toContain('bg-neutral-100');
      expect(button.className).not.toContain('bg-primary-600');
    }
  }

  function expectNoMatches(): void {
    expect(invoiceNumbers()).toEqual([]);
    expect(tableStatuses()).toEqual([]);
    expect(host().querySelectorAll('tbody td[colspan="5"]')).toHaveLength(1);
    expect(emptyCell()?.textContent?.trim()).toBe('No invoices match');
    expect(host().querySelectorAll('tbody tr')).toHaveLength(1);
    expect(viewLinks()).toHaveLength(0);
    expect(host().textContent).toContain('Paid');
    expect(host().textContent).toContain('Pending');
    expectResultCount('0 of 2');
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
    expectResultCount('2 of 2');
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
    expectResultCount('1 of 2');
  });

  it('shows only INV-1002 when the query is PENDING', async () => {
    await search('PENDING');

    expect(invoiceNumbers()).toEqual(['INV-1002']);
    expect(host().textContent).not.toContain('INV-1001');
    expect(host().textContent).toContain('Pending');
    expect(host().textContent).not.toContain('No invoices match');
    expectResultCount('1 of 2');
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
    expect(host().querySelectorAll('tbody tr')).toHaveLength(1);
    expectResultCount('0 of 2');
  });

  it('shows both invoices again for a whitespace-only query', async () => {
    await search('299');
    await search('   ');

    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(host().textContent).not.toContain('No invoices match');
    expect(emptyCell()).toBeNull();
    expectResultCount('2 of 2');
  });

  it('shows both invoices again when the query is cleared', async () => {
    await search('PENDING');
    await search('');

    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(host().textContent).not.toContain('No invoices match');
    expectResultCount('2 of 2');
  });

  it('filters by a fragment of the displayed invoice date', async () => {
    const [firstDate, secondDate] = displayedDates();
    const [firstNumber, secondNumber] = invoiceNumbers();
    const token = firstDate
      .split(/\s+/)
      .find(
        (part) =>
          part.length > 1 &&
          !secondDate.toLowerCase().includes(part.toLowerCase())
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
    expectResultCount('1 of 2');
  });

  it('does not match invoice amount 348', async () => {
    await search('348');

    expect(invoiceNumbers()).toEqual([]);
    expect(emptyCell()?.textContent?.trim()).toBe('No invoices match');
    expect(host().querySelectorAll('tbody tr')).toHaveLength(1);
    expectResultCount('0 of 2');
  });

  it('matches Paid when the query is padded with spaces', async () => {
    await search(' paid ');

    expect(invoiceNumbers()).toEqual(['INV-1001']);
    expect(host().textContent).not.toContain('INV-1002');
    expectResultCount('1 of 2');
  });

  it('matches both invoices for the shared number fragment 100', async () => {
    await search('100');

    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(host().textContent).not.toContain('No invoices match');
    expectResultCount('2 of 2');
  });

  it('opens with All pressed and both statuses in the table body', () => {
    const group = statusGroup();
    const searchRow = searchInput().parentElement;
    const header = host().querySelector('mat-card-header');

    expect(group.className).toContain('flex');
    expect(group.className).toContain('flex-wrap');
    expect(group.className).toContain('items-center');
    expect(group.className).toContain('gap-1.5');
    expect(header).not.toBeNull();
    expect(group.closest('mat-card-header')).toBeNull();
    expect(group.previousElementSibling).toBe(header);
    expect(searchRow).not.toBeNull();
    expect(searchRow?.previousElementSibling).toBe(group);
    expect(searchRow?.contains(group)).toBe(false);
    expect(group.contains(searchInput())).toBe(false);
    expect(group.parentElement).toBe(searchRow?.parentElement);
    expect(statusChips()).toHaveLength(3);
    expect(
      statusChips().map((button) => (button.textContent ?? '').trim())
    ).toEqual(['All', 'Paid', 'Pending']);
    expect(
      statusChips().some((button) =>
        (button.textContent ?? '').includes('Failed')
      )
    ).toBe(false);
    expect(pressedChipLabels()).toEqual(['All']);
    expectChipState('All', true);
    expectChipState('Paid', false);
    expectChipState('Pending', false);
    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(tableStatuses()).toEqual(['Paid', 'Pending']);
    expect(emptyCell()).toBeNull();
    expect(host().textContent).not.toContain('No invoices match');
    expect(headerLabels()).toEqual([
      'Invoice',
      'Date',
      'Status',
      'Amount',
      'Action',
    ]);
    expect(viewLinks()).toHaveLength(2);
    expect(host().querySelector('mat-card-header mat-menu')).not.toBeNull();
    expectResultCount('2 of 2');
  });

  it('filters the table body to Paid and keeps the total at 2', async () => {
    await pressChip('Paid');

    expect(searchInput().value).toBe('');
    expect(pressedChipLabels()).toEqual(['Paid']);
    expectChipState('Paid', true);
    expectChipState('All', false);
    expectChipState('Pending', false);
    expect(invoiceNumbers()).toEqual(['INV-1001']);
    expect(tableStatuses()).toEqual(['Paid']);
    expect(host().textContent).toContain('Pending');
    expect(viewLinks()).toHaveLength(1);
    expect(viewLinks()[0]?.getAttribute('href')).toBe('#');
    expect(emptyCell()).toBeNull();
    expectResultCount('1 of 2');
  });

  it('filters the table body to Pending when that chip is pressed', async () => {
    await pressChip('Pending');

    expect(pressedChipLabels()).toEqual(['Pending']);
    expectChipState('Pending', true);
    expectChipState('All', false);
    expect(invoiceNumbers()).toEqual(['INV-1002']);
    expect(tableStatuses()).toEqual(['Pending']);
    expect(host().textContent).toContain('Paid');
    expect(viewLinks()).toHaveLength(1);
    expect(viewLinks()[0]?.getAttribute('href')).toBe('#');
    expectResultCount('1 of 2');
  });

  it('restores both invoices when All is pressed again', async () => {
    await pressChip('Paid');
    await pressChip('All');

    expect(pressedChipLabels()).toEqual(['All']);
    expectChipState('All', true);
    expectChipState('Paid', false);
    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(tableStatuses()).toEqual(['Paid', 'Pending']);
    expect(emptyCell()).toBeNull();
    expectResultCount('2 of 2');
  });

  it('keeps the current chip selected when it is pressed again', async () => {
    await pressChip('Paid');
    await pressChip('Paid');

    expect(pressedChipLabels()).toEqual(['Paid']);
    expect(invoiceNumbers()).toEqual(['INV-1001']);
    expect(tableStatuses()).toEqual(['Paid']);
    expectResultCount('1 of 2');

    await pressChip('Pending');
    await pressChip('Pending');

    expect(pressedChipLabels()).toEqual(['Pending']);
    expect(invoiceNumbers()).toEqual(['INV-1002']);
    expect(tableStatuses()).toEqual(['Pending']);
    expectResultCount('1 of 2');
  });

  it('keeps All selected for the existing search queries', async () => {
    for (const value of [
      'inv-1001',
      'PENDING',
      '100',
      ' paid ',
      '299',
      '348',
      '   ',
      '',
    ]) {
      await search(value);
      expect(pressedChipLabels()).toEqual(['All']);
      expect(searchInput().value).toBe(value);
    }
  });

  it('intersects Paid with query 100 and Pending with query 100', async () => {
    await search('100');
    await pressChip('Paid');

    expect(searchInput().value).toBe('100');
    expect(pressedChipLabels()).toEqual(['Paid']);
    expect(invoiceNumbers()).toEqual(['INV-1001']);
    expect(tableStatuses()).toEqual(['Paid']);
    expectResultCount('1 of 2');

    await pressChip('Pending');

    expect(searchInput().value).toBe('100');
    expect(pressedChipLabels()).toEqual(['Pending']);
    expect(invoiceNumbers()).toEqual(['INV-1002']);
    expect(tableStatuses()).toEqual(['Pending']);
    expectResultCount('1 of 2');

    await pressChip('All');

    expect(searchInput().value).toBe('100');
    expect(pressedChipLabels()).toEqual(['All']);
    expect(invoiceNumbers()).toEqual(['INV-1001', 'INV-1002']);
    expect(tableStatuses()).toEqual(['Paid', 'Pending']);
    expectResultCount('2 of 2');
  });

  it('shows no matches when Paid is combined with PENDING', async () => {
    await pressChip('Paid');
    await search('PENDING');

    expect(searchInput().value).toBe('PENDING');
    expect(pressedChipLabels()).toEqual(['Paid']);
    expect(headerLabels()).toEqual([
      'Invoice',
      'Date',
      'Status',
      'Amount',
      'Action',
    ]);
    expectNoMatches();
  });

  it('shows no matches when Pending is combined with a padded paid query', async () => {
    await search(' paid ');
    await pressChip('Pending');

    expect(searchInput().value).toBe(' paid ');
    expect(pressedChipLabels()).toEqual(['Pending']);
    expectNoMatches();
  });

  it('does not clear the search box or return to All while typing', async () => {
    await search('100');
    await pressChip('Paid');
    expect(searchInput().value).toBe('100');

    await search('1002');

    expect(searchInput().value).toBe('1002');
    expect(pressedChipLabels()).toEqual(['Paid']);
    expectChipState('All', false);
    expectNoMatches();
  });

  it('does not match amounts when a status chip is selected', async () => {
    await pressChip('Paid');
    await search('299');

    expect(pressedChipLabels()).toEqual(['Paid']);
    expectNoMatches();

    await pressChip('Pending');
    await search('348');

    expect(searchInput().value).toBe('348');
    expect(pressedChipLabels()).toEqual(['Pending']);
    expectNoMatches();
  });

  it('treats a whitespace query as no keyword and still applies the chip', async () => {
    await pressChip('Pending');
    await search('   ');

    expect(searchInput().value).toBe('   ');
    expect(pressedChipLabels()).toEqual(['Pending']);
    expect(invoiceNumbers()).toEqual(['INV-1002']);
    expect(tableStatuses()).toEqual(['Pending']);
    expect(emptyCell()).toBeNull();
    expectResultCount('1 of 2');

    await search('');

    expect(pressedChipLabels()).toEqual(['Pending']);
    expect(invoiceNumbers()).toEqual(['INV-1002']);
    expect(tableStatuses()).toEqual(['Pending']);
    expectResultCount('1 of 2');
  });
});
