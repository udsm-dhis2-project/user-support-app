import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlviewCountDataComponent } from './sqlview-count-data.component';

describe('SqlviewCountDataComponent', () => {
  let component: SqlviewCountDataComponent;
  let fixture: ComponentFixture<SqlviewCountDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqlviewCountDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlviewCountDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
