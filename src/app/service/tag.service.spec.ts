import { TestBed } from '@angular/core/testing';

import { TagService } from './tag.service';

describe('TagService', () => {
  let service: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagService);
  });

  xit('should be created', () => {

    expect(service).toBeTruthy();
  });
});
