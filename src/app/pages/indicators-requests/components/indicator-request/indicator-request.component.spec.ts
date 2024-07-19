import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorRequestComponent } from './indicator-request.component';

describe('IndicatorRequestComponent', () => {
  let component: IndicatorRequestComponent;
  let fixture: ComponentFixture<IndicatorRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicatorRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
