import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsRequestsListComponent } from './indicators-requests-list.component';

describe('IndicatorsRequestsListComponent', () => {
  let component: IndicatorsRequestsListComponent;
  let fixture: ComponentFixture<IndicatorsRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorsRequestsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicatorsRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
