import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SceneComponent } from './scene/scene.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TournamentLeaderboardService } from './service/tournament-leaderboard.service';

@NgModule({
	declarations: [
		AppComponent,
		SceneComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule
	],
	providers: [
		TournamentLeaderboardService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
