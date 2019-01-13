import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTimersComponent } from './active-timers.component';

describe('TimersComponent', () => {
  let component: ActiveTimersComponent;
  let fixture: ComponentFixture<ActiveTimersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveTimersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveTimersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
