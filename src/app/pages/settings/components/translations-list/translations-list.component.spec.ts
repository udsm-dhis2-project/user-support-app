import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationsListComponent } from './translations-list.component';

describe('TranslationsListComponent', () => {
  let component: TranslationsListComponent;
  let fixture: ComponentFixture<TranslationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TranslationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
