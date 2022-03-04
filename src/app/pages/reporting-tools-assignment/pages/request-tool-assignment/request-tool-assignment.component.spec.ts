import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestToolAssignmentComponent } from './request-tool-assignment.component';

describe('RequestToolAssignmentComponent', () => {
  let component: RequestToolAssignmentComponent;
  let fixture: ComponentFixture<RequestToolAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestToolAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestToolAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
