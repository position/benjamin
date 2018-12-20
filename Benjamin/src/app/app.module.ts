import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SceneComponent } from './scene/scene.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

import { CreateGeomtryService } from './service/create-geomtry.service';

@NgModule({
	declarations: [
		AppComponent,
		SceneComponent,
		ProfileComponent,
		IntroductionComponent,
		PortfolioComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule
	],
	providers: [
		CreateGeomtryService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
