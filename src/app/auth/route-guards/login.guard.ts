import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors } from 'src/app/root-store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>
  ) { }

  // Prevents user from getting to login screen if already logged in
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store$.select(
        AuthStoreSelectors.selectIsAuth
      ).pipe(
        take(1),
        map(authStatus => {
          if (authStatus) {
            if (state.url === '/login') {
              // This prevents an infinite loop if coming directly from clean login path
              this.router.navigate(['/timers/active']);
            } else {
              // Otherwise pull the return url and route to that
              const returnUrl = route.queryParamMap.get('returnUrl') || '/';
              this.router.navigate([returnUrl]);
            }
            return false;
          }
          return true;
        })
    );
  }
}
