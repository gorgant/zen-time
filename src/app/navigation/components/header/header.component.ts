import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
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

  searchActive: boolean;
  @ViewChild('search') search: ElementRef;

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>,
    private uiService: UiService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {

    // Used in template to determine which header content to show
    this.activeUrl$ = this.router.events.pipe(
      filter(event =>
        event instanceof NavigationEnd
      ),
      map(event =>
        this.router.url
      ),
      // Clear search contents if navigating away
      tap(event => {
        if (this.searchActive) {
          this.closeSearch();
        }
      })
    );

    this.appUser$ = this.store$.select(
      UserStoreSelectors.selectAppUser
    );
  }

  onToggleSidenav() {
    this.uiService.dispatchSideNavClick();
  }

  onToggleSearch() {
    if (!this.searchActive) {
      this.openSearch();
    } else {
      this.closeSearch();
    }
  }

  openSearch() {
    // Set value before focusing on div
    this.searchActive = true;
    // Because the div is initially hidden, this timeout is required to allow time for it to be revealed before focusing
    setTimeout(() => {
      const onElement = this.renderer.selectRootElement(this.search.nativeElement);
      onElement.focus();
    });
  }

  closeSearch() {
    // Clear search contents
    this.renderer.setProperty(this.search.nativeElement, 'value', '');
    // Set value after div is cleared
    this.searchActive = false;
    // Transmit empty search to search tool
    this.uiService.transmitSearchContents('');
  }

  transmitSearchContents(searchContents: string) {
    console.log('Search contents', searchContents);
    this.uiService.transmitSearchContents(searchContents);
  }

}
