import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  ADDON_CATEGORIES,
  AddonModule,
} from '@/app/domains/admin/data/addon-modules';
import { BillingPortalService } from '@/app/domains/admin/data/billing-portal';
import { PageShell } from '@/app/domains/admin/layout/ui/page-shell.component';

@Component({
  selector: 'billing-addons',
  imports: [CurrencyPipe, MatCard, MatIcon, PageShell],
  templateUrl: './billing-addons.component.html',
})
export default class BillingAddons {
  private portal = inject(BillingPortalService);
  protected categories = ADDON_CATEGORIES;
  protected addons = signal<AddonModule[]>(
    this.portal.getSubscription().addons
  );

  protected addonsByCategory = computed(() => {
    const grouped: Record<string, AddonModule[]> = {};

    for (const addon of this.addons()) {
      grouped[addon.categoryId] ??= [];
      grouped[addon.categoryId].push(addon);
    }

    return grouped;
  });

  protected activeCount = computed(
    () => this.addons().filter((addon) => addon.active).length
  );

  protected monthlyAddonCost = computed(() =>
    this.addons()
      .filter((addon) => addon.active)
      .reduce((total, addon) => total + addon.price, 0)
  );

  toggleAddon(id: string) {
    this.addons.update((items) =>
      items.map((addon) =>
        addon.id === id ? { ...addon, active: !addon.active } : addon
      )
    );
  }
}
