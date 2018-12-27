import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { AppComponent } from './app.component';
import { SceneComponent } from './scene/scene.component';
import { ProfileComponent } from './profile/profile.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

import { CreateGeomtryService } from './service/create-geomtry.service';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
	direction: 'horizontal',
	slidesPerView: 'auto'
};

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
		HttpClientModule,
		SwiperModule
	],
	providers: [
		CreateGeomtryService,
		{
			provide: SWIPER_CONFIG,
			useValue: DEFAULT_SWIPER_CONFIG
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
