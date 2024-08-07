import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalUpdatePasswordModalComponent } from './approval-update-password-modal.component';

describe('ApprovalUpdatePasswordModalComponent', () => {
  let component: ApprovalUpdatePasswordModalComponent;
  let fixture: ComponentFixture<ApprovalUpdatePasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalUpdatePasswordModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalUpdatePasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
