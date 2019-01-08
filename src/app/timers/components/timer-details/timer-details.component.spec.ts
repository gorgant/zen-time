import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerDetailsComponent } from './timer-details.component';

describe('TimerDetailsComponent', () => {
  let component: TimerDetailsComponent;
  let fixture: ComponentFixture<TimerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
