import { TestBed } from '@angular/core/testing';

import { SqlViewsService } from './sql-views.service';

describe('SqlViewsService', () => {
  let service: SqlViewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlViewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
