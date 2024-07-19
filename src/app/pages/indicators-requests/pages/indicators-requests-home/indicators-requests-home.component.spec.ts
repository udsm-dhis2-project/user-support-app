import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsRequestsHomeComponent } from './indicators-requests-home.component';

describe('IndicatorsRequestsHomeComponent', () => {
  let component: IndicatorsRequestsHomeComponent;
  let fixture: ComponentFixture<IndicatorsRequestsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorsRequestsHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicatorsRequestsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
