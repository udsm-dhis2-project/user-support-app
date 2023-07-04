import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSendingAccountsRequestComponent } from './confirm-sending-accounts-request.component';

describe('ConfirmSendingAccountsRequestComponent', () => {
  let component: ConfirmSendingAccountsRequestComponent;
  let fixture: ComponentFixture<ConfirmSendingAccountsRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmSendingAccountsRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSendingAccountsRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
