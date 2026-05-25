import { TestBed } from '@angular/core/testing';

import { RemoteconfigService } from './remoteconfig.service';

describe('RemoteconfigService', () => {
  let service: RemoteconfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteconfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
