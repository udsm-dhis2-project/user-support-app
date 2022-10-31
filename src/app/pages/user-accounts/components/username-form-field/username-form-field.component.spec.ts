import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameFormFieldComponent } from './username-form-field.component';

describe('UsernameFormFieldComponent', () => {
  let component: UsernameFormFieldComponent;
  let fixture: ComponentFixture<UsernameFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsernameFormFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
