import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountsFeedbacksListComponent } from './user-accounts-feedbacks-list.component';

describe('UserAccountsFeedbacksListComponent', () => {
  let component: UserAccountsFeedbacksListComponent;
  let fixture: ComponentFixture<UserAccountsFeedbacksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountsFeedbacksListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountsFeedbacksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
