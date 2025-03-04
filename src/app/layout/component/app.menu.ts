import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul>`
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(public authService: AuthService) {}

    ngOnInit() {
        this.authService.isAdmin$.subscribe(isAdmin => {
            this.model = [
                {
                    label: 'Inicio',
                    items: [{ label: 'Productos', icon: 'pi pi-fw pi-heart', routerLink: ["/admin/productos"] }]
                }
            ];
            
            if (isAdmin) {
                this.model.push({
                    label: 'Administrador',
                    items: [
                        { label: 'Categorías', icon: 'pi pi-fw pi-th-large', routerLink: ['/admin/categorias'] },
                        { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/admin/usuarios'] },
                    ]
                });
            }
        });
    }
}
