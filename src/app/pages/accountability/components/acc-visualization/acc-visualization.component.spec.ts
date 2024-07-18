import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccVisualizationComponent } from './acc-visualization.component';

describe('AccVisualizationComponent', () => {
  let component: AccVisualizationComponent;
  let fixture: ComponentFixture<AccVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccVisualizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
