import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedValidationRulesComponent } from './requested-validation-rules.component';

describe('RequestedValidationRulesComponent', () => {
  let component: RequestedValidationRulesComponent;
  let fixture: ComponentFixture<RequestedValidationRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedValidationRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedValidationRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
