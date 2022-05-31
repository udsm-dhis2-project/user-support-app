import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRulesHomeComponent } from './validation-rules-home.component';

describe('ValidationRulesHomeComponent', () => {
  let component: ValidationRulesHomeComponent;
  let fixture: ComponentFixture<ValidationRulesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationRulesHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationRulesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
