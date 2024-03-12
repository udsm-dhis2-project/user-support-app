import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectUserAccountModalComponent } from './reject-user-account-modal.component';

describe('RejectUserAccountModalComponent', () => {
  let component: RejectUserAccountModalComponent;
  let fixture: ComponentFixture<RejectUserAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectUserAccountModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectUserAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
