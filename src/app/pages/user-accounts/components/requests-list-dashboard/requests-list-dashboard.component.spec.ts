import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsListDashboardComponent } from './requests-list-dashboard.component';

describe('RequestsListDashboardComponent', () => {
  let component: RequestsListDashboardComponent;
  let fixture: ComponentFixture<RequestsListDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestsListDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsListDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
