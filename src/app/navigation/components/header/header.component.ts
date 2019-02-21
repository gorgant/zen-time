import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors } from 'src/app/root-store';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  activeUrl$: Observable<string>;
  appUser$: Observable<AppUser>;

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.activeUrl$ = this.router.events.pipe(
      filter(event =>
        event instanceof NavigationEnd
      ),
      map(event =>
        this.router.url
      )
    );

    this.appUser$ = this.store$.select(
      UserStoreSelectors.selectAppUser
    );
  }

  onToggleSidenav() {
    this.uiService.dispatchSideNavClick();
  }

}
