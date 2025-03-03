import { Component, AfterViewInit } from '@angular/core';
import { FlowbiteService } from './flowbite.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  buttons: string[] = ['Button 1', 'Button 2'];

  constructor(private flowbiteService: FlowbiteService) {}

  ngAfterViewInit(): void {
    this.flowbiteService.loadFlowbite();
  }

  agregarModal(): void {
    // Agrega un modal dinámico al DOM
    this.flowbiteService.reinitializeFlowbite(); // Re-inicializa Flowbite
  }
}