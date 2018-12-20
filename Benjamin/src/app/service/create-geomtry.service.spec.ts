import { TestBed } from '@angular/core/testing';

import { CreateGeomtryService } from './create-geomtry.service';

describe('CreateGeomtryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateGeomtryService = TestBed.get(CreateGeomtryService);
    expect(service).toBeTruthy();
  });
});
