import { TestBed } from '@angular/core/testing';

import { KakaoLoginService } from './kakao-login.service';

describe('KakaoLoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KakaoLoginService = TestBed.get(KakaoLoginService);
    expect(service).toBeTruthy();
  });
});
