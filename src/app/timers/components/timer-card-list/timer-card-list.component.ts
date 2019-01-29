import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Timer } from '../../models/timer.model';
import { fade, slide, fadeInAnimation, bounceOutLeftAnimation } from 'src/app/shared/animations/timer-animations';
import { trigger, transition, group, query, style, animate, stagger, animateChild, useAnimation } from '@angular/animations';

@Component({
  selector: 'app-timer-card-list',
  templateUrl: './timer-card-list.component.html',
  styleUrls: ['./timer-card-list.component.scss'],
  animations: [
    trigger('todosAnimation', [
      transition(':enter', [
        // Stagger is to be used inside query functions
        // animateChild ensures the parent doesn't block child behavior
        query('@todoAnimation',
          stagger(200, animateChild())),
      ])
    ]),
    trigger('todoAnimation', [
      transition(':enter', [
        useAnimation(fadeInAnimation, {
          params: {
            duration: '1000ms',
          }
        })
      ]),
      transition(':leave', [
        style({ backgroundColor: 'red' }),
        animate(500),
        useAnimation(bounceOutLeftAnimation)
      ]),
    ])
  ]
})
export class TimerCardListComponent implements OnInit {

  @Input() doneList: boolean;
  @Input() timers: Timer[];
  @Input() loading: boolean;
  @Input() error: any;

  @ViewChild('search') search: ElementRef;
  searchClicked = false;

  onElement;

  testItems: any[] = [
    'Wash the dishes',
    'Call the accountant',
    'Apply for a car insurance'
  ];

  timeoutComplete: boolean;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    // FIND A WAY TO GET RID OF THIS TIMEOUT!
    setTimeout(() => {
      this.timeoutComplete = true;
    }, 1000);
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

  animationStarted($event) { console.log('animation started', $event); }
  animationDone($event) { console.log('animation ended', $event); }

}
