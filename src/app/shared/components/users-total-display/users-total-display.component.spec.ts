import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTotalDisplayComponent } from './users-total-display.component';

describe('UsersTotalDisplayComponent', () => {
  let component: UsersTotalDisplayComponent;
  let fixture: ComponentFixture<UsersTotalDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTotalDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersTotalDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
