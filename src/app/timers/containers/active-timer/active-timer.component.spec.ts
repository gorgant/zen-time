import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTimerComponent } from './active-timer.component';

describe('TimerComponent', () => {
  let component: ActiveTimerComponent;
  let fixture: ComponentFixture<ActiveTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
