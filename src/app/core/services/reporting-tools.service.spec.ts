import { TestBed } from '@angular/core/testing';

import { ReportingToolsService } from './reporting-tools.service';

describe('ReportingToolsService', () => {
  let service: ReportingToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportingToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
