import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateUserAccountsListModalComponent } from './duplicate-user-accounts-list-modal.component';

describe('DuplicateUserAccountsListModalComponent', () => {
  let component: DuplicateUserAccountsListModalComponent;
  let fixture: ComponentFixture<DuplicateUserAccountsListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateUserAccountsListModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DuplicateUserAccountsListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
