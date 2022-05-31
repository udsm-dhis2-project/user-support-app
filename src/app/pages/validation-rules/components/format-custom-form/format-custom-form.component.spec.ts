import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatCustomFormComponent } from './format-custom-form.component';

describe('FormatCustomFormComponent', () => {
  let component: FormatCustomFormComponent;
  let fixture: ComponentFixture<FormatCustomFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatCustomFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatCustomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
