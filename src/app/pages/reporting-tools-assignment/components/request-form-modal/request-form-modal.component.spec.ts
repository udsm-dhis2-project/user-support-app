import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFormModalComponent } from './request-form-modal.component';

describe('RequestFormModalComponent', () => {
  let component: RequestFormModalComponent;
  let fixture: ComponentFixture<RequestFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
