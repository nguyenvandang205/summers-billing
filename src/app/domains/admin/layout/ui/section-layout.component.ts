import { Component, inject, input } from '@angular/core';
import { MatFormField } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

export type SectionLink = {
  id: string;
  label: string;
  route: string;
};

@Component({
  selector: 'section-layout',
  imports: [
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    RouterLink,
    RouterLinkActive,
    MatFormField,
    MatSelect,
    MatOption,
  ],
  templateUrl: './section-layout.component.html',
})
export class SectionLayout {
  protected router = inject(Router);

  title = input.required<string>();
  description = input<string>();
  links = input.required<SectionLink[]>();
}
