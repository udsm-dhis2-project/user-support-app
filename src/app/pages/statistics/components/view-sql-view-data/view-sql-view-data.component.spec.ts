import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSqlViewDataComponent } from './view-sql-view-data.component';

describe('ViewSqlViewDataComponent', () => {
  let component: ViewSqlViewDataComponent;
  let fixture: ComponentFixture<ViewSqlViewDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSqlViewDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSqlViewDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
