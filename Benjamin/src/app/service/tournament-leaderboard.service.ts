import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class TournamentLeaderboardService {
	readonly endpoint;
	constructor(@Inject (HttpClient) protected http: HttpClient) { 
		this.endpoint = environment.endpoint.gateway;
	}

	getList (month: string): Observable<TournamentLeaderboardList> {
		return this.http.get<TournamentLeaderboardList> (`${this.endpoint}gm/tourneys/leaderboards/${month}`);
	}
}

export interface TournamentLeaderboardList {
    created: string;
    players: Array<TournamentLeaderboardItem>;
}

export class TournamentLeaderboardItem {
    position: number;
    countryCode: string;
    isAmbassador: boolean;
    nickName: string;
    accountId: number;
    totalTlp: number;
    cashPrize: number;
    ticketPrize: string;
    tournamentDollarPrize: number;
    change: number;
    isChange: any;
    isTie?: boolean;
    prize?: any;

    constructor() {
        this.isTie = false;
    }
}

