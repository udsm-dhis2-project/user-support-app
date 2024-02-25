import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturePasswordComponent } from './capture-password.component';

describe('CapturePasswordComponent', () => {
  let component: CapturePasswordComponent;
  let fixture: ComponentFixture<CapturePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapturePasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CapturePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
