import { Component, input } from '@angular/core';

@Component({
  selector: 'page-shell',
  host: {
    class: 'flex min-h-0 flex-auto flex-col',
  },
  templateUrl: './page-shell.component.html',
})
export class PageShell {
  title = input.required<string>();
  description = input<string>();
}
