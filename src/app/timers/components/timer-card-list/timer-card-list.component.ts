import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { Timer } from '../../models/timer.model';

@Component({
  selector: 'app-timer-card-list',
  templateUrl: './timer-card-list.component.html',
  styleUrls: ['./timer-card-list.component.scss']
})
export class TimerCardListComponent implements OnInit {

  @Input() doneList: boolean;
  @Input() timers: Timer[];
  @Input() loading: boolean;
  @Input() error: any;

  @ViewChild('search') search: ElementRef;
  searchClicked = false;

  onElement;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  onSearch() {
    this.searchClicked = true;
    // Because the div is initially hidden, this timeout is required to allow time for it to be revealed before focusing
    setTimeout(() => {
      const onElement = this.renderer.selectRootElement(this.search.nativeElement);
      onElement.focus();
    });
  }

  onCloseSearch() {
    this.searchClicked = false;
    // Clear search contents
    this.renderer.setProperty(this.search.nativeElement, 'value', '');
  }

}
