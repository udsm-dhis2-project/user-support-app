import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountabilityHomeComponent } from './accountability-home.component';

describe('AccountabilityHomeComponent', () => {
  let component: AccountabilityHomeComponent;
  let fixture: ComponentFixture<AccountabilityHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountabilityHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountabilityHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
