import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionStatus = new BehaviorSubject<boolean>(true);

  constructor(@Inject(PLATFORM_ID) platform) {
    if (isPlatformBrowser(platform)) {
      fromEvent(window, 'offline')
        .subscribe(event => {
          this.connectionStatus.next(false);
        });
      fromEvent(window, 'online')
        .subscribe(event => {
          this.connectionStatus.next(true);
        });
    }
 }

  monitorConnectionStatus(): Observable<boolean> {
    return this.connectionStatus;
  }

  checkConnectionStatus(): void {
    if (navigator.onLine) {
      this.connectionStatus.next(true);
    }
  }
}
