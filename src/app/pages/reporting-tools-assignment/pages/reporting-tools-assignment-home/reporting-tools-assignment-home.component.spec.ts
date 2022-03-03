import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingToolsAssignmentHomeComponent } from './reporting-tools-assignment-home.component';

describe('ReportingToolsAssignmentHomeComponent', () => {
  let component: ReportingToolsAssignmentHomeComponent;
  let fixture: ComponentFixture<ReportingToolsAssignmentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingToolsAssignmentHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingToolsAssignmentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
