import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        InventApp by
        <a href="https://www.linkedin.com/in/estefany-rizo-51935621a/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Estefany Rizo</a>
    </div>`
})
export class AppFooter {}
