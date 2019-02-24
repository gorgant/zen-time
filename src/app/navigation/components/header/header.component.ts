import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/shared/models/app-user.model';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors } from 'src/app/root-store';
import { UiService } from 'src/app/shared/services/ui.service';
import { AppRouts } from 'src/app/shared/models/app-routes.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  activeUrl$: Observable<string>;
  appUser$: Observable<AppUser>;

  appRoutes = AppRouts;
  timerDetailsPage: string;

  timerId: string;

  searchActive: boolean;
  @ViewChild('search') search: ElementRef;

  @ViewChild('matButton') matButton;

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>,
    private uiService: UiService,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {

    // Used in template to determine which header content to show
    this.activeUrl$ = this.router.events.pipe(
      filter(event =>
        event instanceof NavigationEnd
      ),
      map(event => {
        return this.router.url;
      }),
      // Clear search contents if navigating away
      tap(event => {
        if (this.searchActive) {
          this.closeSearch();
        }
        this.timerDetailsPage = this.testForTimerDetails(
          this.router.url
        );
      })
    );

    this.appUser$ = this.store$.select(
      UserStoreSelectors.selectAppUser
    );

  }

  // Open/close side nav
  onToggleSidenav() {
    this.uiService.dispatchSideNavClick();
    // Clears sticky focus bug on menu icon
    this.matButton._elementRef.nativeElement.blur();
  }

  // Determing whether or not to show search bar
  onToggleSearch() {
    if (!this.searchActive) {
      this.openSearch();
    } else {
      this.closeSearch();
    }
  }

  // Send search bar entry to display component
  transmitSearchContents(searchContents: string) {
    this.uiService.transmitSearchContents(searchContents);
  }

  onEditTimer() {
    this.matButton._elementRef.nativeElement.blur();
    this.uiService.dispatchEditTimerClick();
  }

  private openSearch() {
    // Set value before focusing on div
    this.searchActive = true;
    // Because the div is initially hidden, this timeout is required to allow time for it to be revealed before focusing
    setTimeout(() => {
      const onElement = this.renderer.selectRootElement(this.search.nativeElement);
      onElement.focus();
    });
  }

  private closeSearch() {
    // Clear search contents
    this.renderer.setProperty(this.search.nativeElement, 'value', '');
    // Set value after div is cleared
    this.searchActive = false;
    // Transmit empty search to search tool
    this.uiService.transmitSearchContents('');
  }

  private testForTimerDetails(url: string): string {
    if (
      this.router.url.includes(this.appRoutes.ACTIVE_TIMERS) &&
      this.router.url.length > this.appRoutes.ACTIVE_TIMERS.length
    ) {
      return this.appRoutes.ACTIVE_TIMER_DETAILS;
    } else if (
      this.router.url.includes(this.appRoutes.COMPLETED_TIMERS) &&
      this.router.url.length > this.appRoutes.COMPLETED_TIMERS.length
    ) {
      return this.appRoutes.COMPLETED_TIMER_DETAILS;
    }
    return null;
  }



}
