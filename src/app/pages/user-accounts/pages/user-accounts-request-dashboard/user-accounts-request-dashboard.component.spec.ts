import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountsRequestDashboardComponent } from './user-accounts-request-dashboard.component';

describe('UserAccountsRequestDashboardComponent', () => {
  let component: UserAccountsRequestDashboardComponent;
  let fixture: ComponentFixture<UserAccountsRequestDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountsRequestDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountsRequestDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
