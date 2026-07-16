import { Component, OnDestroy, signal, viewChild, ElementRef } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { PageShell } from '@/app/domains/admin/layout/ui/page-shell.component';

const DEFAULT_AVATAR = '/assets/images/logo/logo.svg';
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/jpg']);

const defaultModel = {
  name: 'Administrator',
  email: 'admin@hmpmaster.com',
  website: 'https://hmpmaster.com',
  address1: '2211 North First Street',
  address2: 'Suite 400',
  postalCode: '95131',
  state: 'california',
  country: 'usa',
  language: 'en-us',
  timezone: 'utc',
  dateFormat: 'mdy',
  timeFormat: '12h',
};

@Component({
  selector: 'account-settings',
  imports: [
    MatButton,
    MatIconButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    FormField,
    MatDivider,
    MatError,
    PageShell,
  ],
  templateUrl: './account-settings.component.html',
})
export default class AccountSettings implements OnDestroy {
  private fileInput = viewChild<ElementRef<HTMLInputElement>>('avatarInput');
  private objectUrl: string | null = null;

  protected model = signal({ ...defaultModel });
  protected form = form(this.model, (schema) => {
    required(schema.name, { message: 'Name is required' });
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Invalid email address' });
  });

  protected editingEmail = signal(false);
  protected avatarUrl = signal(DEFAULT_AVATAR);
  protected avatarError = signal<string | null>(null);
  protected hasCustomAvatar = signal(false);

  ngOnDestroy() {
    this.revokeObjectUrl();
  }

  openAvatarPicker() {
    this.avatarError.set(null);
    this.fileInput()?.nativeElement.click();
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.has(file.type)) {
      this.avatarError.set('Only JPG or PNG images are allowed.');
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      this.avatarError.set('Image must be under 5MB.');
      return;
    }

    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.avatarUrl.set(this.objectUrl);
    this.hasCustomAvatar.set(true);
    this.avatarError.set(null);
  }

  removeAvatar() {
    this.revokeObjectUrl();
    this.avatarUrl.set(DEFAULT_AVATAR);
    this.hasCustomAvatar.set(false);
    this.avatarError.set(null);
  }

  save(event: Event) {
    event.preventDefault();
    this.editingEmail.set(false);
  }

  reset() {
    this.model.set({ ...defaultModel });
    this.editingEmail.set(false);
    this.removeAvatar();
  }

  private revokeObjectUrl() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
