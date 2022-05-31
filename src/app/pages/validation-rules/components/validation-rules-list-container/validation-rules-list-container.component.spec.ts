import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationRulesListContainerComponent } from './validation-rules-list-container.component';

describe('ValidationRulesListContainerComponent', () => {
  let component: ValidationRulesListContainerComponent;
  let fixture: ComponentFixture<ValidationRulesListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationRulesListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationRulesListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
