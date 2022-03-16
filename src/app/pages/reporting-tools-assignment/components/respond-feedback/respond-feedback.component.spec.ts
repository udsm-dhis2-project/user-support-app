import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondFeedbackComponent } from './respond-feedback.component';

describe('RespondFeedbackComponent', () => {
  let component: RespondFeedbackComponent;
  let fixture: ComponentFixture<RespondFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespondFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespondFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
