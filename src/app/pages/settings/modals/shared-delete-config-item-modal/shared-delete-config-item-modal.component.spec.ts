import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDeleteConfigItemModalComponent } from './shared-delete-config-item-modal.component';

describe('SharedDeleteConfigItemModalComponent', () => {
  let component: SharedDeleteConfigItemModalComponent;
  let fixture: ComponentFixture<SharedDeleteConfigItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDeleteConfigItemModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedDeleteConfigItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
