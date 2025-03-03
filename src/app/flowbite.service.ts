import { Injectable, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Injectable({
  providedIn: 'root',
})
export class FlowbiteService {
  private flowbiteInitialized = false;
  private observer: MutationObserver | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private ngZone: NgZone
  ) {}

  loadFlowbite(): void {
    if (isPlatformBrowser(this.platformId) && !this.flowbiteInitialized) {
      this.ngZone.runOutsideAngular(() => {
        initFlowbite();
        this.flowbiteInitialized = true;
        this.setupMutationObserver();
      });
    }
  }

  private setupMutationObserver(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new MutationObserver(() => {
        this.reinitializeFlowbite();
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  reinitializeFlowbite(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        initFlowbite();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}