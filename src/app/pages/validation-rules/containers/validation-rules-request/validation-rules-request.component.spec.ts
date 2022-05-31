import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRulesRequestComponent } from './validation-rules-request.component';

describe('ValidationRulesRequestComponent', () => {
  let component: ValidationRulesRequestComponent;
  let fixture: ComponentFixture<ValidationRulesRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationRulesRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationRulesRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
