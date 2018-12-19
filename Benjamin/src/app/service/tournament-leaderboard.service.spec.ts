import { TestBed } from '@angular/core/testing';

import { TournamentLeaderboardService } from './tournament-leaderboard.service';

describe('TournamentLeaderboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TournamentLeaderboardService = TestBed.get(TournamentLeaderboardService);
    expect(service).toBeTruthy();
  });
});
