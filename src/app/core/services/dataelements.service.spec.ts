import { TestBed } from '@angular/core/testing';

import { DataelementsService } from './dataelements.service';

describe('DataelementsService', () => {
  let service: DataelementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataelementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
