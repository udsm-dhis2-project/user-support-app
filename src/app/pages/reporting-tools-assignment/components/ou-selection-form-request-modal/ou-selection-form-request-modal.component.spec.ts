import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuSelectionFormRequestModalComponent } from './ou-selection-form-request-modal.component';

describe('OuSelectionFormRequestModalComponent', () => {
  let component: OuSelectionFormRequestModalComponent;
  let fixture: ComponentFixture<OuSelectionFormRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuSelectionFormRequestModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuSelectionFormRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
