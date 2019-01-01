import { TestBed } from '@angular/core/testing';

import { StatsHelperService } from './stats-helper.service';

describe('GuiHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatsHelperService = TestBed.get(StatsHelperService);
    expect(service).toBeTruthy();
  });
});
