import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetCategoriesComponent } from './dataset-categories.component';

describe('DatasetCategoriesComponent', () => {
  let component: DatasetCategoriesComponent;
  let fixture: ComponentFixture<DatasetCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
