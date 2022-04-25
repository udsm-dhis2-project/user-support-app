import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadUsersModalComponent } from './upload-users-modal.component';

describe('UploadUsersModalComponent', () => {
  let component: UploadUsersModalComponent;
  let fixture: ComponentFixture<UploadUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadUsersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
