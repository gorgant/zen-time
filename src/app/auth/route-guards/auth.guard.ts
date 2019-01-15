import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors } from 'src/app/root-store';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store$.select(
        AuthStoreSelectors.selectIsAuth
      ).pipe(
        take(1),
        tap(authStatus => {
          if (!authStatus) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
          }
        })
    );
  }

  canLoad(route: Route, segments: UrlSegment[]) {
    return this.store$.select(
      AuthStoreSelectors.selectIsAuth)
    .pipe(
      take(1),
      tap(authStatus => {
        if (!authStatus) {
          console.log('Not authenticated, routing to login');
          const returnUrl = this.covertSegmentsToReturnUrl(segments);
          this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
        }
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
