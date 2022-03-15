import { TestBed } from '@angular/core/testing';

import { MessagesAndDatastoreService } from './messages-and-datastore.service';

describe('MessagesAndDatastoreService', () => {
  let service: MessagesAndDatastoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesAndDatastoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
