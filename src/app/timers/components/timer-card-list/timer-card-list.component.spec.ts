import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerCardListComponent } from './timer-card-list.component';

describe('TimerCardListComponent', () => {
  let component: TimerCardListComponent;
  let fixture: ComponentFixture<TimerCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
