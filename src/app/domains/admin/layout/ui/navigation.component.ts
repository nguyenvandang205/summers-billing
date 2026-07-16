import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import {
  isActive,
  IsActiveMatchOptions,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs';
import {
  NAVIGATION,
  NavigationItem,
} from '@/app/domains/admin/layout/data/navigation';

@Component({
  selector: 'navigation',
  imports: [
    MatIcon,
    NgTemplateOutlet,
    RouterLinkActive,
    Tree,
    TreeItem,
    TreeItemGroup,
    RouterLink,
    CdkMonitorFocus,
  ],
  templateUrl: './navigation.component.html',
})
export class Navigation {
  private router = inject(Router);

  protected navigation = signal<NavigationItem[]>(
    this.expandActivePath(this.cloneNav(NAVIGATION))
  );

  private navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    )
  );

  constructor() {
    effect(() => {
      if (!this.navigationEnd()) {
        return;
      }

      this.navigation.update((items) => {
        this.expandActivePath(items);
        return [...items];
      });
    });
  }

  onExpandedChange(node: NavigationItem, expanded: boolean) {
    if (node.expanded === expanded) {
      return;
    }

    node.expanded = expanded;
    this.navigation.update((items) => [...items]);
  }

  hasActiveChild(node: NavigationItem): boolean {
    return this.findActiveChild(node) !== null;
  }

  private findActiveChild(node: NavigationItem): NavigationItem | null {
    if (!node.children?.length) {
      return null;
    }

    for (const child of node.children) {
      if (child.children?.length) {
        const nested = this.findActiveChild(child);
        if (nested) {
          return nested;
        }
      } else if (child.route && this.isLeafActive(child)) {
        return child;
      }
    }

    return null;
  }

  private isLeafActive(node: NavigationItem): boolean {
    if (!node.route) {
      return false;
    }

    return isActive(node.route, this.router, this.exactMatchOptions())();
  }

  private expandActivePath(items: NavigationItem[]): NavigationItem[] {
    for (const item of items) {
      if (item.children?.length) {
        this.expandActivePath(item.children);

        if (this.hasActiveChild(item)) {
          item.expanded = true;
        }
      }
    }

    return items;
  }

  private cloneNav(items: NavigationItem[]): NavigationItem[] {
    return items.map((item) => ({
      ...item,
      children: item.children ? this.cloneNav(item.children) : undefined,
    }));
  }

  private exactMatchOptions(): IsActiveMatchOptions {
    return {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    };
  }
}
