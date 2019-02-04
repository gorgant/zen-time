import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushRequestComponent } from './push-request.component';

describe('PushRequestComponent', () => {
  let component: PushRequestComponent;
  let fixture: ComponentFixture<PushRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
