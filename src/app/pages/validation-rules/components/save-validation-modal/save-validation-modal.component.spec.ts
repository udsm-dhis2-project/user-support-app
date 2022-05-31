import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveValidationModalComponent } from './save-validation-modal.component';

describe('SaveValidationModalComponent', () => {
  let component: SaveValidationModalComponent;
  let fixture: ComponentFixture<SaveValidationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveValidationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveValidationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
