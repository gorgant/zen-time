import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerCardItemComponent } from './timer-card-item.component';

describe('TimerCardItemComponent', () => {
  let component: TimerCardItemComponent;
  let fixture: ComponentFixture<TimerCardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerCardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
