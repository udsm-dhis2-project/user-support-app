import { TestBed } from '@angular/core/testing';

import { MetadataDescriptionService } from './metadata-description.service';

describe('MetadataDescriptionService', () => {
  let service: MetadataDescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataDescriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
