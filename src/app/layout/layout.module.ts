import { NgModule } from '@angular/core';

// import { Component, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; //NavigationEnd, Router,
// import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './component/app.topbar';
import { AppSidebar } from './component/app.sidebar';
import { AppFooter } from './component/app.footer';
import { LayoutService } from './service/layout.service';
import { AppLayout } from './component/app.layout';
import { ToastModule } from 'primeng/toast';

    @NgModule({
    //   declarations: [
        
    //   ],
      imports: [
        CommonModule,
        RouterModule,
        AppLayout,
        AppTopbar,
        AppSidebar,
        AppFooter,
      ],
      exports: [
        AppLayout,
      ],
      providers: [
        LayoutService,
        ToastModule,
      ]
    })
    export class LayoutModule { }