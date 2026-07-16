import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { PageShell } from '@/app/domains/admin/layout/ui/page-shell.component';

const defaults = {
  productNews: true,
  securityEmail: true,
  weeklySummary: false,
  systemMobile: true,
  securityMobile: true,
  billingMobile: true,
  invitations: true,
  mentions: false,
  reminders: false,
};

@Component({
  selector: 'notifications-settings',
  imports: [
    FormsModule,
    MatButton,
    MatDivider,
    MatSlideToggle,
    FormField,
    PageShell,
  ],
  templateUrl: './notifications-settings.component.html',
})
export default class NotificationsSettings {
  protected model = signal({ ...defaults });
  protected form = form(this.model);

  save(event: Event) {
    event.preventDefault();
  }

  reset() {
    this.model.set({ ...defaults });
  }
}
