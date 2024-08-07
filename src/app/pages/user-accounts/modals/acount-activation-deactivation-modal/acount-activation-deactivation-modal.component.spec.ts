import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcountActivationDeactivationModalComponent } from './acount-activation-deactivation-modal.component';

describe('AcountActivationDeactivationModalComponent', () => {
  let component: AcountActivationDeactivationModalComponent;
  let fixture: ComponentFixture<AcountActivationDeactivationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcountActivationDeactivationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcountActivationDeactivationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
