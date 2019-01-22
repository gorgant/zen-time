import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetReminderDialogueComponent } from './set-reminder-dialogue.component';

describe('SetReminderDialogueComponent', () => {
  let component: SetReminderDialogueComponent;
  let fixture: ComponentFixture<SetReminderDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetReminderDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetReminderDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
