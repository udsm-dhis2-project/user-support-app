import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlViewDataComponent } from './sql-view-data.component';

describe('SqlViewDataComponent', () => {
  let component: SqlViewDataComponent;
  let fixture: ComponentFixture<SqlViewDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqlViewDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlViewDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
