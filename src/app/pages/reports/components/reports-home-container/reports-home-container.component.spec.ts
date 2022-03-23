import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsHomeContainerComponent } from './reports-home-container.component';

describe('ReportsHomeContainerComponent', () => {
  let component: ReportsHomeContainerComponent;
  let fixture: ComponentFixture<ReportsHomeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsHomeContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsHomeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
