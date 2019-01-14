import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPasswordDialogueComponent } from './edit-password-dialogue.component';

describe('EditPasswordDialogueComponent', () => {
  let component: EditPasswordDialogueComponent;
  let fixture: ComponentFixture<EditPasswordDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPasswordDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPasswordDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
