import { TestBed } from '@angular/core/testing';

import { ViewProjectService } from './view-project.service';

describe('ViewProjectService', () => {
  let service: ViewProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewProjectService);
  });

  xit('should be created', () => {

    expect(service).toBeTruthy();
  });
});
