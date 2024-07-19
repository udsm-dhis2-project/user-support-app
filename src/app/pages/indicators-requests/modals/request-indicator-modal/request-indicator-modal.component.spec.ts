import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestIndicatorModalComponent } from './request-indicator-modal.component';

describe('RequestIndicatorModalComponent', () => {
  let component: RequestIndicatorModalComponent;
  let fixture: ComponentFixture<RequestIndicatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestIndicatorModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestIndicatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
