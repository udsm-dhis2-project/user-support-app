import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestUserAccountsComponent } from './request-user-accounts.component';

describe('RequestUserAccountsComponent', () => {
  let component: RequestUserAccountsComponent;
  let fixture: ComponentFixture<RequestUserAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestUserAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestUserAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
