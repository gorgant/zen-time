import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneTimersComponent } from './done-timers.component';

describe('DoneComponent', () => {
  let component: DoneTimersComponent;
  let fixture: ComponentFixture<DoneTimersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneTimersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneTimersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
