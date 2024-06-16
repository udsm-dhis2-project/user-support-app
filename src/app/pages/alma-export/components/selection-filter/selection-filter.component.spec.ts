import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionFilterComponent } from './selection-filter.component';

describe('SelectionFilterComponent', () => {
  let component: SelectionFilterComponent;
  let fixture: ComponentFixture<SelectionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
