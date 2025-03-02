import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Injectable({
  providedIn: 'root'
})
export class FlowbiteService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  loadFlowbite(callback?: (flowbite: any) => void): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
      if (callback) {
        callback(initFlowbite);
      }
    }
  }
}
