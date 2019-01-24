import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsDialogueComponent } from './terms-and-conditions-dialogue.component';

describe('TermsAndConditionsDialogueComponent', () => {
  let component: TermsAndConditionsDialogueComponent;
  let fixture: ComponentFixture<TermsAndConditionsDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
