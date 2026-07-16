import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  required,
  validate,
} from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/input';
import valid from 'card-validator';
import { BillingPortalService } from '@/app/domains/admin/data/billing-portal';
import { PageShell } from '@/app/domains/admin/layout/ui/page-shell.component';

@Component({
  selector: 'settings-payment',
  templateUrl: './settings-payment.component.html',
  imports: [
    CurrencyPipe,
    FormField,
    MatButton,
    MatCard,
    MatCheckbox,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatInput,
    MatLabel,
    MatPrefix,
    MatSuffix,
    PageShell,
  ],
})
export default class SettingsPayment {
  protected portal = inject(BillingPortalService);
  protected data = this.portal.getBilling();

  protected showAddCard = signal(false);

  protected addCardModel = signal({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardHolder: '',
    saveCard: true,
  });

  protected addCardForm = form(this.addCardModel, (schema) => {
    required(schema.cardNumber, { message: 'Card number is required' });
    required(schema.expiry, { message: 'Expiry date is required' });
    required(schema.cvc, { message: 'Security code is required' });
    required(schema.cardHolder, { message: 'Cardholder name is required' });

    validate(schema.cardNumber, ({ value }) => {
      const digits = value().replace(/\D/g, '');
      if (!digits) {
        return null;
      }
      if (!valid.number(digits).isValid) {
        return {
          kind: 'invalidCard',
          message: 'Enter a valid card number',
        };
      }
      return null;
    });

    validate(schema.expiry, ({ value }) => {
      const raw = value().trim();
      if (!raw) {
        return null;
      }
      if (!valid.expirationDate(raw).isValid) {
        return {
          kind: 'invalidExpiry',
          message: 'Enter a valid expiry (MM / YY)',
        };
      }
      return null;
    });

    validate(schema.cvc, ({ value, valueOf }) => {
      const cvc = value().replace(/\D/g, '');
      if (!cvc) {
        return null;
      }
      const card = valid.number(valueOf(schema.cardNumber).replace(/\D/g, '')).card;
      const size = card?.code.size ?? 3;
      if (!valid.cvv(cvc, size).isValid) {
        return {
          kind: 'invalidCvc',
          message: `Enter a valid ${card?.code.name ?? 'CVV'}`,
        };
      }
      return null;
    });
  });

  protected detectedCard = computed(() => {
    const digits = this.addCardModel().cardNumber.replace(/\D/g, '');
    if (!digits) {
      return null;
    }
    return valid.number(digits).card;
  });

  protected cvcLabel = computed(
    () => this.detectedCard()?.code.name ?? 'CVV',
  );

  openAddCard() {
    this.showAddCard.set(true);
  }

  cancelAddCard() {
    this.showAddCard.set(false);
    this.addCardModel.set({
      cardNumber: '',
      expiry: '',
      cvc: '',
      cardHolder: '',
      saveCard: true,
    });
  }

  onCardNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const selection = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = input.value
      .slice(0, selection)
      .replace(/\D/g, '').length;

    const digits = input.value.replace(/\D/g, '').slice(0, 19);
    const gaps = valid.number(digits).card?.gaps ?? [4, 8, 12];
    let formatted = '';

    for (let i = 0; i < digits.length; i++) {
      if (gaps.includes(i) && i !== 0) {
        formatted += ' ';
      }
      formatted += digits[i];
    }

    this.addCardModel.update((model) => ({
      ...model,
      cardNumber: formatted,
    }));
    input.value = formatted;

    // Keep cursor after the same digit count (ABA-style spaced groups).
    let caret = 0;
    let seen = 0;
    while (caret < formatted.length && seen < digitsBeforeCaret) {
      if (/\d/.test(formatted[caret])) {
        seen++;
      }
      caret++;
    }
    input.setSelectionRange(caret, caret);
  }

  onExpiryInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const inputType = (event as InputEvent).inputType ?? '';
    const prev = this.addCardModel().expiry;
    const prevDigits = prev.replace(/\D/g, '');
    const caretAfter = input.selectionStart ?? 0;

    let digits = input.value.replace(/\D/g, '').slice(0, 4);
    let digitsBeforeCaret = input.value
      .slice(0, caretAfter)
      .replace(/\D/g, '').length;

    // Backspace/delete landed on " / " — remove the digit beside it so
    // remaining digits shift (e.g. 11 / 24 → delete 2nd "1" → 12 / 4).
    if (
      (inputType === 'deleteContentBackward' ||
        inputType === 'deleteContentForward') &&
      digits.length === prevDigits.length &&
      prevDigits.length > 0
    ) {
      const oldCaret =
        inputType === 'deleteContentBackward' ? caretAfter + 1 : caretAfter;
      const removeAt = Math.max(
        0,
        prev.slice(0, oldCaret).replace(/\D/g, '').length -
          (inputType === 'deleteContentBackward' ? 1 : 0),
      );
      digits = (
        prevDigits.slice(0, removeAt) + prevDigits.slice(removeAt + 1)
      ).slice(0, 4);
      digitsBeforeCaret = removeAt;
    }

    const formatted =
      digits.length >= 2
        ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
        : digits;

    this.addCardModel.update((model) => ({
      ...model,
      expiry: formatted,
    }));
    input.value = formatted;

    let caret = 0;
    let seen = 0;
    while (caret < formatted.length && seen < digitsBeforeCaret) {
      if (/\d/.test(formatted[caret])) {
        seen++;
      }
      caret++;
    }
    // Keep caret after " / " when sitting between month and year.
    if (
      digitsBeforeCaret === 2 &&
      digits.length >= 2 &&
      formatted.startsWith(`${digits.slice(0, 2)} / `)
    ) {
      caret = `${digits.slice(0, 2)} / `.length;
    }
    input.setSelectionRange(caret, caret);
  }

  onCvcInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const size = this.detectedCard()?.code.size ?? 4;
    const digits = input.value.replace(/\D/g, '').slice(0, size);

    this.addCardModel.update((model) => ({
      ...model,
      cvc: digits,
    }));
    input.value = digits;
  }

  addCard(event: Event) {
    event.preventDefault();

    const model = this.addCardModel();
    const digits = model.cardNumber.replace(/\D/g, '');
    const card = valid.number(digits).card;
    const expiry = valid.expirationDate(model.expiry);

    if (
      !valid.number(digits).isValid ||
      !expiry.isValid ||
      !valid.cvv(model.cvc, card?.code.size ?? 3).isValid ||
      !model.cardHolder.trim()
    ) {
      return;
    }

    // Demo only — wire to Stripe/payment API later.
    console.info('Add card payload', {
      brand: card?.niceType,
      last4: digits.slice(-4),
      expMonth: Number(expiry.month),
      expYear: Number(`20${expiry.year}`),
      cardHolder: model.cardHolder.trim(),
      saveCard: model.saveCard,
    });

    this.cancelAddCard();
  }
}
