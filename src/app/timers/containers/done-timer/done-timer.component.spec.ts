import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneTimerComponent } from './done-timer.component';

describe('DoneTimerComponent', () => {
  let component: DoneTimerComponent;
  let fixture: ComponentFixture<DoneTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
