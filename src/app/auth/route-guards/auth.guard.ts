import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors } from 'src/app/root-store';
import { take, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store$.select(
        AuthStoreSelectors.selectIsAuth
      ).pipe(
        take(1),
        map(authStatus => {
          if (!authStatus) {
            console.log('No user detected, routing to login');
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return false;
          }
          return true;
        })
    );
  }

  canLoad(route: Route, segments: UrlSegment[]):  Observable<boolean> {
    return this.store$.select(
      AuthStoreSelectors.selectIsAuth)
    .pipe(
      take(1),
      map(authStatus => {
        if (!authStatus) {
          console.log('No user detected, routing to login');
          const returnUrl = this.covertSegmentsToReturnUrl(segments);
          this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
          return false;
        }
        return true;
      })
    );
  }

  // Collect segments and convert to a return url string
  private covertSegmentsToReturnUrl(segments: UrlSegment[]) {
    const segmentArray = segments.map(segment => segment.path);
    const returnUrl = segmentArray.join('/');
    return returnUrl;
  }
}
