import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 54 40" style="enable-background:new 0 0 54 40;" xml:space="preserve">
<style type="text/css">
	.st0{fill-rule:evenodd;clip-rule:evenodd;fill:#A855F7;}
</style>
<path class="st0" d="M33,2.3c-4.1-1-8.4-1-12.5,0c-6,1.4-10.6,6-12,12c-1,4.1-1,8.4,0,12.5c1.4,6,6,10.6,12,12c4.1,1,8.4,1,12.5,0
	c6-1.4,10.6-6,12-12c1-4.1,1-8.4,0-12.5C43.6,8.4,38.9,3.7,33,2.3z M17.7,14.8c0.4-0.5,1.2-0.6,1.7-0.2l4.2,3.5c1.6,1.3,1.6,3.7,0,5
	l-4.2,3.5c-0.5,0.4-1.3,0.4-1.7-0.2c-0.4-0.5-0.4-1.3,0.2-1.7l4.2-3.5c0.4-0.3,0.4-0.9,0-1.2l-4.2-3.5
	C17.4,16.1,17.3,15.3,17.7,14.8z M27.7,24.4c-0.7,0-1.2,0.5-1.2,1.2s0.5,1.2,1.2,1.2h7.1c0.7,0,1.2-0.5,1.2-1.2s-0.5-1.2-1.2-1.2
	H27.7z"/>
</svg>

                <span>InventApp</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <div class="relative">
                    <app-configurator />
                </div>
            </div>
            <div class="layout-topbar-actions">
                <div class="relative">
                <a (click)="logout()"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem">Cerrar sesión</a>
                </div>
        </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService, public authService: AuthService, private router: Router) { }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
    }

}
