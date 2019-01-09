import { TestBed } from '@angular/core/testing';

import { CreateGeometryService } from './create-geometry.service';

describe('CreateGeomtryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateGeometryService = TestBed.get(CreateGeometryService);
    expect(service).toBeTruthy();
  });
});
