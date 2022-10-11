import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveUserAccountsModalComponent } from './approve-user-accounts-modal.component';

describe('ApproveUserAccountsModalComponent', () => {
  let component: ApproveUserAccountsModalComponent;
  let fixture: ComponentFixture<ApproveUserAccountsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveUserAccountsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveUserAccountsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
