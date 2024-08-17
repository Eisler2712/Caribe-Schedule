import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="logo-container logo p-10">
        <img src="assets/images/logos/logo.svg" alt="logo" />
        <h1 class="p-12 font-medium col">Juegos Caribes</h1>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
