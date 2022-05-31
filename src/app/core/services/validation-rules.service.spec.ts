import { TestBed } from '@angular/core/testing';

import { ValidationRulesService } from './validation-rules.service';

describe('ValidationRulesService', () => {
  let service: ValidationRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
