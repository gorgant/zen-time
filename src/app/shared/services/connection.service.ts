import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, fromEvent, merge, empty, Subject, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { mapTo } from 'rxjs/operators';

// Courtesty of https://stackoverflow.com/questions/46915717/how-can-you-detect-network-connectivity-in-angular-2
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionMonitor: Observable<boolean>;
  private connectionStatus = new BehaviorSubject<boolean>(true);

  constructor(@Inject(PLATFORM_ID) platform) {
    // if (isPlatformBrowser(platform)) {
    //   console.log('Platform browser detected', window);
    //   const offline$ = fromEvent(window, 'offline')
    //     .pipe(
    //       mapTo(false)
    //     );
    //   const online$ = fromEvent(window, 'online')
    //     .pipe(
    //       mapTo(true)
    //     );
    //   this.connectionMonitor = merge(
    //     offline$, online$
    //   );
    // } else {
    //   console.log('Mapping connection monitor to empty');
    //   this.connectionMonitor = empty();
    // }
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
    // return this.connectionMonitor;
    return this.connectionStatus;
  }

  checkConnectionStatus(): void {
    if (navigator.onLine) {
      console.log('Device initialized as online');
      this.connectionStatus.next(true);
    }
  }
}
