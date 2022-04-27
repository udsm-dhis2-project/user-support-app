import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedFormRequestsSummaryComponent } from './rejected-form-requests-summary.component';

describe('RejectedFormRequestsSummaryComponent', () => {
  let component: RejectedFormRequestsSummaryComponent;
  let fixture: ComponentFixture<RejectedFormRequestsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedFormRequestsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedFormRequestsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
