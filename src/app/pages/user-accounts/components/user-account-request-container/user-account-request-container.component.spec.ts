import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountRequestContainerComponent } from './user-account-request-container.component';

describe('UserAccountRequestContainerComponent', () => {
  let component: UserAccountRequestContainerComponent;
  let fixture: ComponentFixture<UserAccountRequestContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountRequestContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountRequestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
