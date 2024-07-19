import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManipulationComponent } from './form-manipulation.component';

describe('FormManipulationComponent', () => {
  let component: FormManipulationComponent;
  let fixture: ComponentFixture<FormManipulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormManipulationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormManipulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
