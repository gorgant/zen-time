import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailDialogueComponent } from './edit-email-dialogue.component';

describe('EditEmailDialogueComponent', () => {
  let component: EditEmailDialogueComponent;
  let fixture: ComponentFixture<EditEmailDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmailDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmailDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
