import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRulesListComponent } from './validation-rules-list.component';

describe('ValidationRulesListComponent', () => {
  let component: ValidationRulesListComponent;
  let fixture: ComponentFixture<ValidationRulesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationRulesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationRulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
