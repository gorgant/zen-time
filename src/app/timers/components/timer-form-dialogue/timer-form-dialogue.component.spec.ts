import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerFormDialogueComponent } from './timer-form-dialogue.component';

describe('TimerFormComponent', () => {
  let component: TimerFormDialogueComponent;
  let fixture: ComponentFixture<TimerFormDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerFormDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerFormDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
