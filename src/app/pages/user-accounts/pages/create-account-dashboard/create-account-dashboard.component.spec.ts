import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountDashboardComponent } from './create-account-dashboard.component';

describe('CreateAccountDashboardComponent', () => {
  let component: CreateAccountDashboardComponent;
  let fixture: ComponentFixture<CreateAccountDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccountDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
