import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { Component, computed, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { formatDistance, sub } from 'date-fns';

type NotificationFilter = 'all' | 'unread' | 'system';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: Date;
  read: boolean;
  type: 'system' | 'message' | 'invite' | 'billing';
  icon: string;
  avatar?: string;
  action?: 'view' | 'invite';
  link?: string;
};

@Component({
  selector: 'notifications',
  imports: [
    MatIconButton,
    MatIcon,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    RouterLink,
  ],
  host: {
    class: 'inline-flex',
  },
  templateUrl: './notifications.component.html',
})
export class Notifications {
  private now = new Date();

  protected open = signal(false);
  protected backdropClasses = ['cdk-overlay-dark-backdrop', 'notifications-backdrop'];
  protected overlayPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 8,
      offsetY: 8,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetX: 8,
      offsetY: -8,
    },
  ];
  protected filters: { value: NotificationFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'system', label: 'System' },
  ];
  protected currentFilter = signal<NotificationFilter>('all');

  protected notifications = signal<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Invoice paid',
      description: 'Invoice #INV-2048 for $128.00 was paid successfully.',
      time: sub(this.now, { minutes: 12 }),
      read: false,
      type: 'billing',
      icon: 'receipt',
      action: 'view',
      link: '/billing/invoices',
    },
    {
      id: 'n2',
      title: 'Usage nearing limit',
      description: 'API calls reached 86% of your monthly plan allowance.',
      time: sub(this.now, { hours: 2 }),
      read: false,
      type: 'system',
      icon: 'gauge',
      action: 'view',
      link: '/billing/usage',
    },
    {
      id: 'n3',
      title: 'Payment failed',
      description: 'We could not charge your card ending in 4242. Update payment method.',
      time: sub(this.now, { hours: 5 }),
      read: false,
      type: 'billing',
      icon: 'circle-alert',
      action: 'view',
      link: '/settings/payment',
    },
    {
      id: 'n4',
      title: 'Invitation to join team',
      description: "You've been invited to join the 'Billing Ops' workspace.",
      time: sub(this.now, { hours: 8 }),
      read: true,
      type: 'invite',
      icon: 'users',
      action: 'invite',
    },
    {
      id: 'n5',
      title: 'Plan renews soon',
      description: 'Your Pro plan renews on Jul 28. Review add-ons before renewal.',
      time: sub(this.now, { days: 1 }),
      read: true,
      type: 'system',
      icon: 'sparkles',
      action: 'view',
      link: '/billing/plan',
    },
    {
      id: 'n6',
      title: 'New login detected',
      description: 'A sign-in from Chrome on macOS was recorded 2 days ago.',
      time: sub(this.now, { days: 2 }),
      read: true,
      type: 'system',
      icon: 'shield',
      action: 'view',
      link: '/settings/security',
    },
  ]);

  protected filteredNotifications = computed(() => {
    const filter = this.currentFilter();
    const items = this.notifications();

    if (filter === 'unread') {
      return items.filter((item) => !item.read);
    }
    if (filter === 'system') {
      return items.filter((item) => item.type === 'system');
    }
    return items;
  });

  protected unreadCount = computed(
    () => this.notifications().filter((item) => !item.read).length
  );

  toggle(force: boolean | null = null) {
    this.open.update((value) => (force === null ? !value : force));
  }

  setFilter(filter: NotificationFilter) {
    this.currentFilter.set(filter);
  }

  markAllAsRead() {
    this.notifications.update((items) =>
      items.map((item) => ({ ...item, read: true }))
    );
  }

  markAsRead(id: string) {
    this.notifications.update((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }

  deleteNotification(id: string) {
    this.notifications.update((items) => items.filter((item) => item.id !== id));
  }

  acceptInvite(id: string) {
    this.markAsRead(id);
    this.deleteNotification(id);
  }

  declineInvite(id: string) {
    this.deleteNotification(id);
  }

  timeAgo(time: Date) {
    return formatDistance(time, this.now, { addSuffix: true });
  }
}
