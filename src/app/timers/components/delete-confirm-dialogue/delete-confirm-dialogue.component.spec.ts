import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmDialogueComponent } from './delete-confirm-dialogue.component';

describe('DeleteConfirmDialogueComponent', () => {
  let component: DeleteConfirmDialogueComponent;
  let fixture: ComponentFixture<DeleteConfirmDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteConfirmDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
