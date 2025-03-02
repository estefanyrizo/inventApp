import { Component } from '@angular/core';
import { FlowbiteService } from './flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pruebaTecnica';
  constructor() {}

}
