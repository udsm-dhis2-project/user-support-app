import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsListComponent } from './indicators-list.component';

describe('IndicatorsListComponent', () => {
  let component: IndicatorsListComponent;
  let fixture: ComponentFixture<IndicatorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndicatorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
