import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureTranslationComponent } from './capture-translation.component';

describe('CaptureTranslationComponent', () => {
  let component: CaptureTranslationComponent;
  let fixture: ComponentFixture<CaptureTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptureTranslationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaptureTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
