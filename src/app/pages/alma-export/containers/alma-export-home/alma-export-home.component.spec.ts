import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmaExportHomeComponent } from './alma-export-home.component';

describe('AlmaExportHomeComponent', () => {
  let component: AlmaExportHomeComponent;
  let fixture: ComponentFixture<AlmaExportHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlmaExportHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlmaExportHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
