import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountabilityListComponent } from './accountability-list.component';

describe('AccountabilityListComponent', () => {
  let component: AccountabilityListComponent;
  let fixture: ComponentFixture<AccountabilityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountabilityListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountabilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
