import { TestBed } from '@angular/core/testing';

import { TextureLoaderService } from './texture-loader.service';

describe('TextureLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextureLoaderService = TestBed.get(TextureLoaderService);
    expect(service).toBeTruthy();
  });
});
