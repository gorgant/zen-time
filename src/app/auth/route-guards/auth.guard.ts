import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors, UserStoreSelectors, AuthStoreActions } from 'src/app/root-store';
import { take, switchMap, catchError, } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>,
    private uiService: UiService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|Observable<boolean> {

    return this.store$.select(AuthStoreSelectors.selectIsAuth)
      .pipe(
        take(1),
        switchMap(isAuth => {
          // If user is authenticated, wait for user data to load into store, then open up route guard
          if (isAuth) {
            // Inspired by https://stackoverflow.com/a/46386082/6572208
            return new Observable<boolean>((observer) => {
              this.store$.select(UserStoreSelectors.selectUserLoaded)
                .subscribe(userLoaded => {
                  if (userLoaded) {
                    observer.next(true);
                    observer.complete();
                  }
                });
            });
          } else {
          // If user not authenticated, route to login
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return of(false);
          }
        }),
        catchError(error => {
          this.store$.dispatch(new AuthStoreActions.LoadErrorDetected({error}));
          this.uiService.showSnackBar(error, null, 5000);
          return of(error);
        })
      );
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {

    return this.store$.select(AuthStoreSelectors.selectIsAuth)
      .pipe(
        take(1),
        switchMap(isAuth => {
          // If user is authenticated, wait for user data to load into store, then open up route guard
          if (isAuth) {
            // Inspired by https://stackoverflow.com/a/46386082/6572208
            return new Observable<boolean>((observer) => {
              this.store$.select(UserStoreSelectors.selectUserLoaded)
                .subscribe(userLoaded => {
                  if (userLoaded) {
                    observer.next(true);
                    observer.complete();
                  }
                });
            });
          } else {
          // If user not authenticated, route to login
            const returnUrl = this.covertSegmentsToReturnUrl(segments);
            this.router.navigate(['/login'], { queryParams: { returnUrl: returnUrl }});
            return of(false);
          }
        }),
        catchError(error => {
          this.store$.dispatch(new AuthStoreActions.LoadErrorDetected({error}));
          this.uiService.showSnackBar(error, null, 5000);
          return of(error);
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
